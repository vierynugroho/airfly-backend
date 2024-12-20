import { BookingService } from '../booking.js';
import { BookingRepository } from '../../repositories/booking.js';
import { SeatStatus } from '@prisma/client';

jest.mock('../../repositories/booking.js', () => ({
  BookingRepository: {
    isSeatAvailable: jest.fn(),
    createBooking: jest.fn(),
    createPassengers: jest.fn(),
    setSeatStatus: jest.fn(),
    findBooking: jest.fn(),
    totalBooking: jest.fn(),
    findById: jest.fn(),
    findByCode: jest.fn(),
    findGrouped: jest.fn(),
  },
}));

describe('BookingService', () => {
  describe('createBooking', () => {
    it('should create a new booking successfully', async () => {
      const mockBooking = {
        userId: 1,
        flightId: 100,
        returnFlightId: 101,
        bookingDetail: [
          {
            seatId: 1,
            passenger: { name: 'John Doe', title: 'Mr', dob: '1990-01-01' },
            price: 100,
          },
        ],
      };

      BookingRepository.isSeatAvailable.mockResolvedValue(true);
      BookingRepository.createBooking.mockResolvedValue({ id: 1 });
      BookingRepository.createPassengers.mockResolvedValue(true);
      BookingRepository.setSeatStatus.mockResolvedValue(true);

      const result = await BookingService.createBooking(mockBooking);

      expect(result).toEqual(1);
      expect(BookingRepository.isSeatAvailable).toHaveBeenCalledWith(
        [100, 101],
        [1]
      );
      expect(BookingRepository.createBooking).toHaveBeenCalledWith({
        userId: 1,
        flightId: 100,
        returnFlightId: 101,
        bookingDate: expect.any(String),
        totalPrice: 100,
      });
      expect(BookingRepository.createPassengers).toHaveBeenCalled();
      expect(BookingRepository.setSeatStatus).toHaveBeenCalledWith(
        [1],
        SeatStatus.LOCKED
      );
    });

    it('should throw an error if booking details are empty', async () => {
      const mockBooking = {
        userId: 1,
        flightId: 100,
        returnFlightId: 101,
        bookingDetail: [],
      };

      await expect(BookingService.createBooking(mockBooking)).rejects.toThrow(
        'booking request at least have one passenger'
      );
    });

    it('should throw an error if flightId and returnFlightId are the same', async () => {
      const mockBooking = {
        userId: 1,
        flightId: 100,
        returnFlightId: 100,
        bookingDetail: [
          {
            seatId: 1,
            passenger: { name: 'John Doe', title: 'Mr', dob: '1990-01-01' },
            price: 100,
          },
        ],
      };

      await expect(BookingService.createBooking(mockBooking)).rejects.toThrow(
        "flightId and returnFlightId can't be same"
      );
    });

    it('should handle booking with a return flight ID', async () => {
      const mockBooking = {
        userId: 1,
        flightId: 100,
        returnFlightId: 101,
        bookingDetail: [
          {
            seatId: 1,
            passenger: { name: 'John Doe', title: 'Mr', dob: '1990-01-01' },
            price: 100,
          },
        ],
      };

      BookingRepository.isSeatAvailable.mockResolvedValue(true);
      BookingRepository.createBooking.mockResolvedValue({ id: 1 });
      BookingRepository.createPassengers.mockResolvedValue(true);
      BookingRepository.setSeatStatus.mockResolvedValue(true);

      const result = await BookingService.createBooking(mockBooking);

      expect(result).toEqual(1);
      expect(BookingRepository.isSeatAvailable).toHaveBeenCalledWith(
        [100, 101],
        [1]
      );
    });

    it('should handle booking without a return flight ID', async () => {
      const mockBooking = {
        userId: 1,
        flightId: 100,
        bookingDetail: [
          {
            seatId: 1,
            passenger: { name: 'John Doe', title: 'Mr', dob: '1990-01-01' },
            price: 100,
          },
        ],
      };

      BookingRepository.isSeatAvailable.mockResolvedValue(true);
      BookingRepository.createBooking.mockResolvedValue({ id: 1 });
      BookingRepository.createPassengers.mockResolvedValue(true);
      BookingRepository.setSeatStatus.mockResolvedValue(true);

      const result = await BookingService.createBooking(mockBooking);

      expect(result).toEqual(1);
      expect(BookingRepository.isSeatAvailable).toHaveBeenCalledWith(
        [100],
        [1]
      );
    });
  });

  describe('findBooking', () => {
    it('should return paginated booking data', async () => {
      const mockCriteria = {
        page: 1,
        limit: 10,
        userId: 1,
        sort: 'asc',
      };

      const mockBookings = [{ id: 1, userId: 1, bookingDate: '2024-01-01' }];
      const mockTotalBooking = 1;

      BookingRepository.findBooking.mockResolvedValue(mockBookings);
      BookingRepository.totalBooking.mockResolvedValue(mockTotalBooking);

      const result = await BookingService.findBooking(mockCriteria);

      expect(result).toEqual({ bookings: mockBookings, totalBooking: 1 });
      expect(BookingRepository.findBooking).toHaveBeenCalledWith(
        { userId: 1 },
        { offset: 0, limit: 10 },
        { bookingDate: 'asc' }
      );
      expect(BookingRepository.totalBooking).toHaveBeenCalledWith(
        { userId: 1 },
        { bookingDate: 'asc' }
      );
    });
  });

  describe('findById', () => {
    it('should return a booking by ID', async () => {
      const mockBooking = { id: 1, userId: 1 };

      BookingRepository.findById.mockResolvedValue(mockBooking);

      const result = await BookingService.findById(1);

      expect(result).toEqual(mockBooking);
      expect(BookingRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw an error if booking ID is invalid', async () => {
      BookingRepository.findById.mockResolvedValue(null);

      await expect(BookingService.findById(999)).resolves.toBeNull();
    });
  });

  describe('findByCode', () => {
    it('should return booking by code', async () => {
      const mockCode = 'ABC123';
      const mockBooking = { id: 1, code: 'ABC123' };

      BookingRepository.findByCode.mockResolvedValue(mockBooking);

      const result = await BookingService.findByCode(mockCode);

      expect(result).toEqual(mockBooking);
      expect(BookingRepository.findByCode).toHaveBeenCalledWith(mockCode);
    });
  });

  describe('findGrouped', () => {
    it('should return grouped booking data', async () => {
      const mockCriteria = {
        userId: 100,
        page: 1,
        limit: 5,
        sort: 'asc',
      };

      const mockGroupedData = [{ id: 1, userId: 1, bookingDate: '2024-01-01' }];

      BookingRepository.findBooking.mockResolvedValue(mockGroupedData);

      const result = await BookingService.findGrouped(mockCriteria);

      expect(result).toEqual({
        groupedBookings: {
          Januari: [{ bookingDate: '2024-01-01', id: 1, userId: 1 }],
        },
        totalBooking: 1,
        totalItems: 1,
      });
      expect(BookingRepository.findBooking).toHaveBeenCalledWith(
        { userId: mockCriteria.userId },
        { limit: mockCriteria.limit, offset: 0 },
        { bookingDate: mockCriteria.sort }
      );
    });

    it('should return an empty array if no grouped data is found', async () => {
      const mockCriteria = {
        userId: 100,
        page: 1,
        limit: 5,
        sort: 'asc',
      };

      const mockGroupedData = [];

      BookingRepository.findBooking.mockResolvedValue(mockGroupedData);

      const result = await BookingService.findGrouped(mockCriteria);

      expect(result).toEqual({
        groupedBookings: {},
        totalBooking: 1,
        totalItems: 0,
      });
      expect(BookingRepository.findBooking).toHaveBeenCalledWith(
        { userId: mockCriteria.userId },
        { limit: mockCriteria.limit, offset: 0 },
        { bookingDate: mockCriteria.sort }
      );
    });
  });
});
