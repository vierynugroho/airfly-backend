import { FlightService } from '../flight.js';
import { FlightRepository } from '../../repositories/flight.js';
import { AirportRepository } from '../../repositories/airport.js';
import { AirlineRepository } from '../../repositories/airline.js';
import { SeatRepository } from '../../repositories/seat.js';
import { ErrorHandler } from '../../middlewares/error.js';
import { calculateDuration } from '../../utils/calculateDuration.js';

jest.mock('../../repositories/flight.js');
jest.mock('../../repositories/airport.js');
jest.mock('../../repositories/airline.js');
jest.mock('../../repositories/seat.js');
jest.mock('../../utils/calculateDuration.js');

describe('FlightService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    const mockPagination = { page: 1, limit: 10 };
    const mockFilter = { class: 'ECONOMY' };
    const mockSorter = { field: 'departureTime', order: 'asc' };

    it('should return flights with duration successfully', async () => {
      const mockFlights = [
        {
          id: 1,
          departureTime: '2024-01-01T10:00:00Z',
          arrivalTime: '2024-01-01T12:00:00Z',
        },
      ];

      SeatRepository.getClassEnum.mockResolvedValue({
        ECONOMY: 'ECONOMY',
        BUSINESS: 'BUSINESS',
      });
      FlightRepository.findMany.mockResolvedValue(mockFlights);
      FlightRepository.count.mockResolvedValue(1);
      calculateDuration.mockReturnValue('0 days 2 hours 0 minutes');

      const result = await FlightService.getAll(
        mockPagination,
        mockFilter,
        mockSorter
      );

      expect(SeatRepository.getClassEnum).toHaveBeenCalled();
      expect(FlightRepository.findMany).toHaveBeenCalledWith(
        mockPagination,
        mockFilter,
        mockSorter
      );
      expect(FlightRepository.count).toHaveBeenCalledWith(mockFilter);
      expect(result).toEqual({
        flights: [
          {
            id: 1,
            departureTime: '2024-01-01T10:00:00Z',
            arrivalTime: '2024-01-01T12:00:00Z',
            duration: '0 days 2 hours 0 minutes',
          },
        ],
        totalFlights: 1,
      });
    });

    it('should throw error for invalid seat class', async () => {
      const invalidFilter = { class: 'INVALID_CLASS' };
      SeatRepository.getClassEnum.mockResolvedValue({
        ECONOMY: 'ECONOMY',
        BUSINESS: 'BUSINESS',
      });

      await expect(
        FlightService.getAll(mockPagination, invalidFilter, mockSorter)
      ).rejects.toThrow(
        new ErrorHandler(
          422,
          'Invalid seat class. Available classes: ECONOMY, BUSINESS'
        )
      );
    });

    it('should sort flights by duration when specified', async () => {
      const mockFlights = [
        {
          departureTime: '2024-01-01T10:00:00Z',
          arrivalTime: '2024-01-01T14:00:00Z',
        },
        {
          departureTime: '2024-01-01T10:00:00Z',
          arrivalTime: '2024-01-01T12:00:00Z',
        },
      ];

      FlightRepository.findMany.mockResolvedValue(mockFlights);
      calculateDuration
        .mockReturnValueOnce('0 days 4 hours 0 minutes')
        .mockReturnValueOnce('0 days 2 hours 0 minutes');

      const result = await FlightService.getAll(
        mockPagination,
        {},
        mockSorter,
        { sort: 'asc' }
      );

      expect(result.flights[0].duration).toBe('0 days 2 hours 0 minutes');
    });
  });

  describe('getByID', () => {
    it('should return flight by ID successfully', async () => {
      const mockFlight = { id: 1, flightNumber: 'FL123' };
      FlightRepository.findByID.mockResolvedValue(mockFlight);
      FlightRepository.flightTicketsSoldOut.mockResolvedValue(false);

      const result = await FlightService.getByID(1);

      expect(FlightRepository.findByID).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockFlight);
    });

    it('should throw error if flight not found', async () => {
      FlightRepository.findByID.mockResolvedValue(null);

      await expect(FlightService.getByID(1)).rejects.toThrow(
        new ErrorHandler(404, 'flight is not found')
      );
    });

    it('should throw error if flight tickets are sold out', async () => {
      FlightRepository.findByID.mockResolvedValue({ id: 1 });
      FlightRepository.flightTicketsSoldOut.mockResolvedValue(true);

      await expect(FlightService.getByID(1)).rejects.toThrow(
        new ErrorHandler(400, 'Flight Tickets Sold Out')
      );
    });
  });

  describe('create', () => {
    const mockFlightData = {
      flightNumber: 'FL123',
      arrivalAirport: 1,
      departureAirport: 2,
      airlineId: 1,
    };

    it('should create flight successfully', async () => {
      AirportRepository.findByID
        .mockResolvedValueOnce({ id: 1 }) // arrival airport
        .mockResolvedValueOnce({ id: 2 }); // departure airport
      AirlineRepository.findByID.mockResolvedValue({ id: 1 });
      FlightRepository.findByFlightNumber.mockResolvedValue(null);
      FlightRepository.create.mockResolvedValue({ id: 1, ...mockFlightData });

      const result = await FlightService.create(mockFlightData);

      expect(result).toEqual({ id: 1, ...mockFlightData });
    });

    it('should throw error if arrival airport not found', async () => {
      AirportRepository.findByID.mockResolvedValue(null);

      await expect(FlightService.create(mockFlightData)).rejects.toThrow(
        new ErrorHandler(404, 'arrival airport is not found')
      );
    });

    it('should throw error if flight number already exists', async () => {
      AirportRepository.findByID
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce({ id: 2 });
      AirlineRepository.findByID.mockResolvedValue({ id: 1 });
      FlightRepository.findByFlightNumber.mockResolvedValue({ id: 2 });

      await expect(FlightService.create(mockFlightData)).rejects.toThrow(
        new ErrorHandler(409, 'Flight number is already used by another flight')
      );
    });
  });

  describe('update', () => {
    const mockFlightData = {
      flightNumber: 'FL123',
      arrivalAirport: 1,
      departureAirport: 2,
      airlineId: 1,
    };

    it('should update flight successfully', async () => {
      FlightRepository.findByID.mockResolvedValue({ id: 1 });
      AirportRepository.findByID
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce({ id: 2 });
      AirlineRepository.findByID.mockResolvedValue({ id: 1 });
      FlightRepository.findByFlightNumber.mockResolvedValue(null);
      FlightRepository.update.mockResolvedValue({ id: 1, ...mockFlightData });

      const result = await FlightService.update(1, mockFlightData);

      expect(result).toEqual({ id: 1, ...mockFlightData });
    });

    it('should throw error if flight not found', async () => {
      FlightRepository.findByID.mockResolvedValue(null);

      await expect(FlightService.update(1, mockFlightData)).rejects.toThrow(
        new ErrorHandler(404, 'Flight is not found')
      );
    });

    it('should throw error if flight number is already used by another flight', async () => {
      FlightRepository.findByID.mockResolvedValue({ id: 1 });
      AirportRepository.findByID
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce({ id: 2 });
      AirlineRepository.findByID.mockResolvedValue({ id: 1 });
      FlightRepository.findByFlightNumber.mockResolvedValue({ id: 2 });

      await expect(FlightService.update(1, mockFlightData)).rejects.toThrow(
        new ErrorHandler(409, 'Flight number is already used by another flight')
      );
    });
  });

  describe('delete', () => {
    it('should delete flight successfully', async () => {
      FlightRepository.findByID.mockResolvedValue({ id: 1 });
      FlightRepository.delete.mockResolvedValue({ success: true });

      const result = await FlightService.delete(1);

      expect(FlightRepository.findByID).toHaveBeenCalledWith(1);
      expect(FlightRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ success: true });
    });

    it('should throw error if flight not found', async () => {
      FlightRepository.findByID.mockResolvedValue(null);

      await expect(FlightService.delete(1)).rejects.toThrow(
        new ErrorHandler(404, 'flight is not found')
      );
    });
  });
});
