import { FlightRepository } from '../flight.js';
import { prisma } from '../../database/db.js';

jest.mock('../../database/db.js', () => ({
  prisma: {
    flight: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe('FlightRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new flight', async () => {
      const mockData = { flightNumber: 'FL123', airlineId: 1 };
      const mockResponse = { id: 1, ...mockData };

      prisma.flight.create.mockResolvedValue(mockResponse);

      const result = await FlightRepository.create(mockData);

      expect(prisma.flight.create).toHaveBeenCalledWith({ data: mockData });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should update a flight by ID', async () => {
      const mockFlightID = 1;
      const mockData = { flightNumber: 'FL456' };
      const mockResponse = { id: mockFlightID, ...mockData };

      prisma.flight.update.mockResolvedValue(mockResponse);

      const result = await FlightRepository.update(mockFlightID, mockData);

      expect(prisma.flight.update).toHaveBeenCalledWith({
        where: { id: mockFlightID },
        data: mockData,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('should delete a flight by ID', async () => {
      const mockFlightID = 1;
      const mockResponse = { id: mockFlightID };

      prisma.flight.delete.mockResolvedValue(mockResponse);

      const result = await FlightRepository.delete(mockFlightID);

      expect(prisma.flight.delete).toHaveBeenCalledWith({
        where: { id: mockFlightID },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findMany', () => {
    it('should return a list of flights with pagination, filtering, and sorting', async () => {
      const mockPagination = { offset: 0, limit: 10 };
      const mockFilter = { destination: 'City A' };
      const mockSorter = { departureTime: 'asc' };
      const mockFlights = [
        { id: 1, flightNumber: 'FL123' },
        { id: 2, flightNumber: 'FL456' },
      ];

      prisma.flight.findMany.mockResolvedValue(mockFlights);

      const result = await FlightRepository.findMany(
        mockPagination,
        mockFilter,
        mockSorter
      );

      expect(prisma.flight.findMany).toHaveBeenCalledWith({
        skip: mockPagination.offset,
        take: mockPagination.limit,
        where: mockFilter,
        orderBy: mockSorter,
        include: {
          _count: true,
          airline: true,
          arrival: true,
          departure: true,
        },
      });
      expect(result).toEqual(mockFlights);
    });

    it('should return flights sorted by total bookings if no sorting and filtering are provided', async () => {
      const mockPagination = { offset: 0, limit: 10 };
      const mockFlights = [
        { id: 1, _count: { booking: 5, returnBooking: 3 } },
        { id: 2, _count: { booking: 2, returnBooking: 1 } },
        { id: 3, _count: { booking: 4, returnBooking: 6 } },
      ];

      prisma.flight.findMany.mockResolvedValue(mockFlights);

      const result = await FlightRepository.findMany(
        mockPagination,
        null,
        null
      );

      expect(prisma.flight.findMany).toHaveBeenCalledWith({
        skip: mockPagination.offset,
        take: mockPagination.limit,
        where: null,
        orderBy: null,
        include: {
          _count: true,
          airline: true,
          arrival: true,
          departure: true,
        },
      });

      expect(result).toEqual([
        { id: 3, _count: { booking: 4, returnBooking: 6 } },
        { id: 1, _count: { booking: 5, returnBooking: 3 } },
        { id: 2, _count: { booking: 2, returnBooking: 1 } },
      ]);
    });
  });

  describe('findByID', () => {
    it('should return a flight by ID', async () => {
      const mockFlightID = 1;
      const mockResponse = { id: mockFlightID, flightNumber: 'FL123' };

      prisma.flight.findUnique.mockResolvedValue(mockResponse);

      const result = await FlightRepository.findByID(mockFlightID);

      expect(prisma.flight.findUnique).toHaveBeenCalledWith({
        where: { id: mockFlightID },
        include: {
          _count: true,
          airline: true,
          arrival: true,
          departure: true,
          seat: true,
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('count', () => {
    it('should return the total number of flights with filters', async () => {
      const mockFilter = { destination: 'City A' };
      const mockCount = 5;

      prisma.flight.count.mockResolvedValue(mockCount);

      const result = await FlightRepository.count(mockFilter);

      expect(prisma.flight.count).toHaveBeenCalledWith({ where: mockFilter });
      expect(result).toEqual(mockCount);
    });
  });

  describe('findByFlightNumber', () => {
    it('should return true if a flight exists with the given flight number', async () => {
      const mockFlightNumber = 'FL123';
      const mockResponse = { id: 1, flightNumber: mockFlightNumber };

      prisma.flight.findFirst.mockResolvedValue(mockResponse);

      const result =
        await FlightRepository.findByFlightNumber(mockFlightNumber);

      expect(prisma.flight.findFirst).toHaveBeenCalledWith({
        where: { flightNumber: mockFlightNumber },
      });
      expect(result).toBe(true);
    });

    it('should return false if no flight exists with the given flight number', async () => {
      const mockFlightNumber = 'FL999';

      prisma.flight.findFirst.mockResolvedValue(null);

      const result =
        await FlightRepository.findByFlightNumber(mockFlightNumber);

      expect(prisma.flight.findFirst).toHaveBeenCalledWith({
        where: { flightNumber: mockFlightNumber },
      });
      expect(result).toBe(false);
    });
  });

  describe('flightTicketsSoldOut', () => {
    it('should return true if all tickets are sold out for a flight', async () => {
      const mockFlightID = 1;

      prisma.flight.findFirst.mockResolvedValue({ id: mockFlightID, seat: [] });

      const result = await FlightRepository.flightTicketsSoldOut(mockFlightID);

      expect(prisma.flight.findFirst).toHaveBeenCalledWith({
        where: { id: mockFlightID },
        include: {
          seat: { where: { status: 'AVAILABLE' } },
        },
      });
      expect(result).toBe(true);
    });

    it('should return false if there are available seats for a flight', async () => {
      const mockFlightID = 1;
      const mockSeats = [{ id: 1, status: 'AVAILABLE' }];

      prisma.flight.findFirst.mockResolvedValue({
        id: mockFlightID,
        seat: mockSeats,
      });

      const result = await FlightRepository.flightTicketsSoldOut(mockFlightID);

      expect(prisma.flight.findFirst).toHaveBeenCalledWith({
        where: { id: mockFlightID },
        include: {
          seat: { where: { status: 'AVAILABLE' } },
        },
      });
      expect(result).toBe(false);
    });
  });
});
