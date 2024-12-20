import { SeatService } from '../seat.js';
import { FlightRepository } from '../../repositories/flight';
import { SeatRepository } from '../../repositories/seat';
import { ErrorHandler } from '../../middlewares/error';

jest.mock('../../repositories/flight');
jest.mock('../../repositories/seat');

describe('SeatService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const mockSeatData = {
      flightId: 1,
      seatNumber: 'A1',
      class: 'ECONOMY',
      price: 100,
    };

    it('should create seat successfully', async () => {
      FlightRepository.findByID.mockResolvedValue({ id: 1 });
      SeatRepository.findBySeatNumber.mockResolvedValue(null);
      SeatRepository.exists.mockResolvedValue(false);
      SeatRepository.create.mockResolvedValue({ id: 1, ...mockSeatData });

      const result = await SeatService.create(mockSeatData);

      expect(FlightRepository.findByID).toHaveBeenCalledWith(
        mockSeatData.flightId
      );
      expect(SeatRepository.findBySeatNumber).toHaveBeenCalledWith(
        mockSeatData.seatNumber
      );
      expect(SeatRepository.create).toHaveBeenCalledWith(mockSeatData);
      expect(result).toEqual({ id: 1, ...mockSeatData });
    });

    it('should throw error if flight not found', async () => {
      FlightRepository.findByID.mockResolvedValue(null);

      await expect(SeatService.create(mockSeatData)).rejects.toThrow(
        new ErrorHandler(404, 'flight id is not found')
      );
    });

    it('should throw error if seat number already exists in same flight', async () => {
      FlightRepository.findByID.mockResolvedValue({ id: 1 });
      SeatRepository.findBySeatNumber.mockResolvedValue({ id: 2 });
      SeatRepository.exists.mockResolvedValue(true);

      await expect(SeatService.create(mockSeatData)).rejects.toThrow(
        new ErrorHandler(
          409,
          'Seat number has already been used in the same flight'
        )
      );
    });
  });

  describe('update', () => {
    const mockSeatData = {
      flightId: 1,
      seatNumber: 'A2',
      class: 'ECONOMY',
      price: 150,
    };

    const existingSeat = {
      id: 1,
      flightId: 1,
      seatNumber: 'A1',
      class: 'ECONOMY',
      price: 100,
    };

    it('should update seat successfully', async () => {
      SeatRepository.findById.mockResolvedValue(existingSeat);
      FlightRepository.findByID.mockResolvedValue({ id: 1 });
      SeatRepository.exists.mockResolvedValue(false);
      SeatRepository.update.mockResolvedValue({
        ...existingSeat,
        ...mockSeatData,
      });

      const result = await SeatService.update(1, mockSeatData);

      expect(SeatRepository.findById).toHaveBeenCalledWith(1);
      expect(FlightRepository.findByID).toHaveBeenCalledWith(
        mockSeatData.flightId
      );
      expect(SeatRepository.update).toHaveBeenCalledWith(1, mockSeatData);
      expect(result).toEqual({ ...existingSeat, ...mockSeatData });
    });

    it('should throw error if seat not found', async () => {
      SeatRepository.findById.mockResolvedValue(null);

      await expect(SeatService.update(1, mockSeatData)).rejects.toThrow(
        new ErrorHandler(404, 'seat is not found')
      );
    });

    it('should throw error if flight not found', async () => {
      SeatRepository.findById.mockResolvedValue(existingSeat);
      FlightRepository.findByID.mockResolvedValue(null);

      await expect(SeatService.update(1, mockSeatData)).rejects.toThrow(
        new ErrorHandler(404, 'flight id is not found')
      );
    });

    it('should throw error if seat number already exists in same flight', async () => {
      SeatRepository.findById.mockResolvedValue(existingSeat);
      FlightRepository.findByID.mockResolvedValue({ id: 1 });
      SeatRepository.exists.mockResolvedValue(true);

      await expect(SeatService.update(1, mockSeatData)).rejects.toThrow(
        new ErrorHandler(409, 'Seat number has already been used')
      );
    });
  });

  describe('delete', () => {
    it('should delete seat successfully', async () => {
      SeatRepository.findById.mockResolvedValue({ id: 1 });
      SeatRepository.delete.mockResolvedValue({ success: true });

      const result = await SeatService.delete(1);

      expect(SeatRepository.findById).toHaveBeenCalledWith(1);
      expect(SeatRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ success: true });
    });

    it('should throw error if seat not found', async () => {
      SeatRepository.findById.mockResolvedValue(null);

      await expect(SeatService.delete(1)).rejects.toThrow(
        new ErrorHandler(404, 'seat is not found')
      );
    });
  });

  describe('findMany', () => {
    const mockPagination = { page: 1, limit: 10 };
    const mockFilter = { class: 'ECONOMY' };

    it('should return seats and total count', async () => {
      const mockSeats = [
        { id: 1, seatNumber: 'A1' },
        { id: 2, seatNumber: 'A2' },
      ];

      SeatRepository.getClassEnum.mockResolvedValue({
        ECONOMY: 'ECONOMY',
        BUSINESS: 'BUSINESS',
      });
      SeatRepository.findMany.mockResolvedValue(mockSeats);
      SeatRepository.count.mockResolvedValue(2);

      const result = await SeatService.findMany(mockPagination, mockFilter);

      expect(SeatRepository.findMany).toHaveBeenCalledWith(
        mockPagination,
        mockFilter
      );
      expect(SeatRepository.count).toHaveBeenCalledWith(mockFilter);
      expect(result).toEqual({
        seats: mockSeats,
        totalSeats: 2,
      });
    });

    it('should throw error for invalid seat class', async () => {
      const invalidFilter = { class: 'INVALID' };
      SeatRepository.getClassEnum.mockResolvedValue({
        ECONOMY: 'ECONOMY',
        BUSINESS: 'BUSINESS',
      });

      await expect(
        SeatService.findMany(mockPagination, invalidFilter)
      ).rejects.toThrow(
        new ErrorHandler(
          422,
          'Invalid seat class. Available classes: ECONOMY, BUSINESS'
        )
      );
    });
  });

  describe('findById', () => {
    it('should return seat by ID', async () => {
      const mockSeat = { id: 1, seatNumber: 'A1' };
      SeatRepository.findById.mockResolvedValue(mockSeat);

      const result = await SeatService.findById(1);

      expect(SeatRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockSeat);
    });

    it('should throw error if seat not found', async () => {
      SeatRepository.findById.mockResolvedValue(null);

      await expect(SeatService.findById(1)).rejects.toThrow(
        new ErrorHandler(404, 'seat is not found')
      );
    });
  });
});
