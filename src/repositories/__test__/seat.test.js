import { SeatRepository } from '../seat.js';
import { prisma } from '../../database/db.js';
import { SeatClass } from '@prisma/client';

jest.mock('../../database/db.js', () => ({
  prisma: {
    seat: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

describe('SeatRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new seat', async () => {
      const mockSeat = { id: 1, seatNumber: 'A1', class: SeatClass.ECONOMY };
      const data = { seatNumber: 'A1', class: SeatClass.ECONOMY };

      prisma.seat.create.mockResolvedValue(mockSeat);

      const result = await SeatRepository.create(data);

      expect(prisma.seat.create).toHaveBeenCalledWith({ data });
      expect(result).toEqual(mockSeat);
    });
  });

  describe('update', () => {
    it('should update a seat by ID', async () => {
      const mockSeat = { id: 1, seatNumber: 'A1', class: SeatClass.BUSINESS };
      const seatID = 1;
      const data = { seatNumber: 'A1', class: SeatClass.BUSINESS };

      prisma.seat.update.mockResolvedValue(mockSeat);

      const result = await SeatRepository.update(seatID, data);

      expect(prisma.seat.update).toHaveBeenCalledWith({
        where: { id: seatID },
        data,
      });
      expect(result).toEqual(mockSeat);
    });
  });

  describe('delete', () => {
    it('should delete a seat by ID', async () => {
      const mockSeat = { id: 1, seatNumber: 'A1' };
      const seatID = 1;

      prisma.seat.delete.mockResolvedValue(mockSeat);

      const result = await SeatRepository.delete(seatID);

      expect(prisma.seat.delete).toHaveBeenCalledWith({
        where: { id: seatID },
      });
      expect(result).toEqual(mockSeat);
    });
  });

  describe('findMany', () => {
    it('should return a list of seats with pagination and filter', async () => {
      const mockSeats = [
        { id: 1, seatNumber: 'A1', class: SeatClass.ECONOMY },
        { id: 2, seatNumber: 'A2', class: SeatClass.BUSINESS },
      ];
      const pagination = { offset: 0, limit: 10 };
      const filter = { class: SeatClass.ECONOMY };

      prisma.seat.findMany.mockResolvedValue(mockSeats);

      const result = await SeatRepository.findMany(pagination, filter);

      expect(prisma.seat.findMany).toHaveBeenCalledWith({
        skip: pagination.offset,
        take: pagination.limit,
        where: filter,
        include: { _count: true, flight: true },
      });
      expect(result).toEqual(mockSeats);
    });
  });

  describe('count', () => {
    it('should return the total number of seats based on filter', async () => {
      const mockCount = 5;
      const filter = { class: SeatClass.BUSINESS };

      prisma.seat.count.mockResolvedValue(mockCount);

      const result = await SeatRepository.count(filter);

      expect(prisma.seat.count).toHaveBeenCalledWith({ where: filter });
      expect(result).toBe(mockCount);
    });
  });

  describe('getClassEnum', () => {
    it('should return the SeatClass enum', async () => {
      const result = await SeatRepository.getClassEnum();

      expect(result).toBe(SeatClass);
    });
  });

  describe('findById', () => {
    it('should return a seat by ID', async () => {
      const mockSeat = { id: 1, seatNumber: 'A1', class: SeatClass.ECONOMY };
      const seatID = 1;

      prisma.seat.findUnique.mockResolvedValue(mockSeat);

      const result = await SeatRepository.findById(seatID);

      expect(prisma.seat.findUnique).toHaveBeenCalledWith({
        where: { id: seatID },
        include: { _count: true, flight: true },
      });
      expect(result).toEqual(mockSeat);
    });
  });

  describe('findBySeatNumber', () => {
    it('should return a list of seats by seat number', async () => {
      const mockSeats = [
        { id: 1, seatNumber: 'A1', class: SeatClass.ECONOMY },
        { id: 2, seatNumber: 'A1', class: SeatClass.BUSINESS },
      ];
      const seatNumber = 'A1';

      prisma.seat.findMany.mockResolvedValue(mockSeats);

      const result = await SeatRepository.findBySeatNumber(seatNumber);

      expect(prisma.seat.findMany).toHaveBeenCalledWith({
        where: { seatNumber },
        include: {
          flight: {
            include: {
              airline: true,
              arrival: true,
              departure: true,
            },
          },
        },
      });
      expect(result).toEqual(mockSeats);
    });
  });

  describe('exists', () => {
    it('should return true if the seat exists', async () => {
      const flightId = 1;
      const seatNumber = 'A1';
      const mockSeat = { id: 1, seatNumber: 'A1', flightId };

      prisma.seat.findFirst.mockResolvedValue(mockSeat);

      const result = await SeatRepository.exists(flightId, seatNumber);

      expect(prisma.seat.findFirst).toHaveBeenCalledWith({
        where: { flightId, seatNumber },
      });
      expect(result).toBe(true);
    });

    it('should return false if the seat does not exist', async () => {
      const flightId = 1;
      const seatNumber = 'A1';

      prisma.seat.findFirst.mockResolvedValue(null);

      const result = await SeatRepository.exists(flightId, seatNumber);

      expect(prisma.seat.findFirst).toHaveBeenCalledWith({
        where: { flightId, seatNumber },
      });
      expect(result).toBe(false);
    });
  });
});
