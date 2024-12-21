import { BookingService } from '../booking.js';
import { BookingRepository } from '../../repositories/booking';
import { SeatStatus } from '@prisma/client';

jest.mock('../../repositories/booking');

describe('BookingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    const mockBookingData = {
      userId: 1,
      flightId: 100,
      returnFlightId: 101,
      bookingDetail: [
        {
          seatId: 1,
          price: 1000000,
          passenger: {
            name: 'John',
            familyName: 'Doe',
            gender: 'MALE',
            identityNumber: '1234567890',
            citizenship: 'ID',
            countryOfIssue: 'Indonesia',
            title: 'Mr',
            dob: '1990-01-01',
            expiredDate: '2025-01-01',
            type: 'ADULT',
          },
        },
      ],
    };

    it('should create a booking successfully', async () => {
      // Mock repository responses
      BookingRepository.isSeatAvailable.mockResolvedValue(true);
      BookingRepository.createBooking.mockResolvedValue({ id: 1 });
      BookingRepository.createPassengers.mockResolvedValue(true);
      BookingRepository.setSeatStatus.mockResolvedValue(true);

      const bookingId = await BookingService.createBooking(mockBookingData);

      expect(bookingId).toBe(1);
      expect(BookingRepository.isSeatAvailable).toHaveBeenCalledWith(
        [100, 101],
        [1]
      );
      expect(BookingRepository.createBooking).toHaveBeenCalled();
      expect(BookingRepository.createPassengers).toHaveBeenCalled();
      expect(BookingRepository.setSeatStatus).toHaveBeenCalledWith(
        [1],
        SeatStatus.LOCKED
      );
    });

    it('should throw error when booking has no passengers', async () => {
      const invalidBooking = {
        ...mockBookingData,
        bookingDetail: [],
      };

      await expect(
        BookingService.createBooking(invalidBooking)
      ).rejects.toThrow('booking request at least have one passenger');
    });

    it('should throw error when flightId and returnFlightId are same', async () => {
      const invalidBooking = {
        ...mockBookingData,
        flightId: 100,
        returnFlightId: 100,
      };

      await expect(
        BookingService.createBooking(invalidBooking)
      ).rejects.toThrow("flightId and returnFlightId can't be same");
    });
  });

  describe('findBooking', () => {
    const mockCriteria = {
      page: 1,
      limit: 10,
      userId: 1,
      sort: 'desc',
      status: 'PAID',
    };

    it('should find bookings with pagination and sorting', async () => {
      const mockBookings = [
        { id: 1, bookingDate: '2024-01-01' },
        { id: 2, bookingDate: '2024-01-02' },
      ];
      const mockTotal = 2;

      BookingRepository.findBooking.mockResolvedValue(mockBookings);
      BookingRepository.totalBooking.mockResolvedValue(mockTotal);

      const result = await BookingService.findBooking(mockCriteria);

      expect(result).toEqual({
        bookings: mockBookings,
        totalBooking: mockTotal,
      });
      expect(BookingRepository.findBooking).toHaveBeenCalledWith(
        {
          userId: 1,
          payment: { status: 'PAID' },
        },
        { offset: 0, limit: 10 },
        { bookingDate: 'desc' }
      );
    });
  });

  describe('findGrouped', () => {
    it('should group bookings by month', async () => {
      const mockBookings = [
        { id: 1, bookingDate: '2024-01-01T00:00:00.000Z' },
        { id: 2, bookingDate: '2024-02-01T00:00:00.000Z' },
        { id: 3, bookingDate: '2024-01-15T00:00:00.000Z' },
      ];

      BookingRepository.findBooking.mockResolvedValue(mockBookings);
      BookingRepository.totalBooking.mockResolvedValue(3);

      const result = await BookingService.findGrouped({
        userId: 1,
        page: 1,
        limit: 10,
      });

      expect(result.totalItems).toBe(3);
      expect(result.totalBooking).toBe(3);
      expect(result.groupedBookings).toHaveProperty('Januari');
      expect(result.groupedBookings).toHaveProperty('Februari');
      expect(result.groupedBookings.Januari).toHaveLength(2);
      expect(result.groupedBookings.Februari).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('should find booking by id', async () => {
      const mockBooking = { id: 1, bookingDate: '2024-01-01' };
      BookingRepository.findById.mockResolvedValue(mockBooking);

      const result = await BookingService.findById(1);

      expect(result).toEqual(mockBooking);
      expect(BookingRepository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('findByCode', () => {
    it('should find booking by code', async () => {
      const mockBooking = { id: 1, code: 'BOOK123' };
      BookingRepository.findByCode.mockResolvedValue(mockBooking);

      const result = await BookingService.findByCode('BOOK123');

      expect(result).toEqual(mockBooking);
      expect(BookingRepository.findByCode).toHaveBeenCalledWith('BOOK123');
    });
  });
});
