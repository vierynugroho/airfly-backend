import { UserRole } from '@prisma/client';
import { BookingController } from '../booking.js';
import { BookingService } from '../../services/booking';

jest.mock('../../services/booking');

describe('BookingController', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      user: {
        id: 1,
        role: UserRole.USER,
      },
      body: {},
      query: {},
      params: {},
    };

    mockRes = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    it('should successfully create a booking', async () => {
      const mockBookingId = 123;
      const mockBookingData = { serviceId: 1, date: '2024-12-21' };

      mockReq.body = mockBookingData;
      BookingService.createBooking.mockResolvedValue(mockBookingId);

      await BookingController.createBooking(mockReq, mockRes, mockNext);

      expect(BookingService.createBooking).toHaveBeenCalledWith({
        ...mockBookingData,
        userId: mockReq.user.id,
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 201,
          message: 'booking created',
        },
        data: {
          bookingId: mockBookingId,
        },
      });
    });

    it('should handle errors in createBooking', async () => {
      const error = new Error('Database error');
      BookingService.createBooking.mockRejectedValue(error);

      await BookingController.createBooking(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAll', () => {
    it('should get all bookings with pagination for regular user', async () => {
      const mockBookings = [
        { id: 1, userId: 1 },
        { id: 2, userId: 1 },
      ];
      const mockTotalBooking = 10;

      mockReq.query = { page: '1', limit: '5' };
      BookingService.findBooking.mockResolvedValue({
        bookings: mockBookings,
        totalBooking: mockTotalBooking,
      });

      await BookingController.getAll(mockReq, mockRes, mockNext);

      expect(BookingService.findBooking).toHaveBeenCalledWith({
        page: 1,
        limit: 5,
        sort: null,
        status: undefined,
        userId: 1,
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        meta: {
          status: 200,
          message: 'success',
          pagination: {
            totalPage: 2,
            currentPage: 1,
            pageItems: 2,
            nextPage: 2,
            prevPage: null,
          },
        },
        data: mockBookings,
      });
    });

    it('should get all bookings for admin user', async () => {
      mockReq.user.role = UserRole.ADMIN;
      const mockBookings = [
        { id: 1, userId: 1 },
        { id: 2, userId: 2 },
      ];

      BookingService.findBooking.mockResolvedValue({
        bookings: mockBookings,
        totalBooking: 2,
      });

      await BookingController.getAll(mockReq, mockRes, mockNext);

      expect(BookingService.findBooking).toHaveBeenCalledWith({
        page: 1,
        limit: null,
        sort: null,
        status: undefined,
        userId: undefined,
      });
    });
  });

  describe('getById', () => {
    it('should get booking by id successfully', async () => {
      const mockBooking = { id: 1, userId: 1 };
      mockReq.params = { id: '1' };

      BookingService.findById.mockResolvedValue(mockBooking);

      await BookingController.getById(mockReq, mockRes, mockNext);

      expect(BookingService.findById).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith({
        meta: {
          status: 200,
          message: 'successs',
        },
        data: mockBooking,
      });
    });

    it('should return empty array when booking not found', async () => {
      mockReq.params = { id: '999' };
      BookingService.findById.mockResolvedValue(null);

      await BookingController.getById(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({
        meta: {
          status: 200,
          message: 'successs',
        },
        data: [],
      });
    });
  });

  describe('getGroupedBy', () => {
    it('should get grouped bookings with pagination', async () => {
      const mockGroupedBookings = [{ date: '2024-12-21', bookings: [] }];
      mockReq.query = { page: '1', limit: '5' };

      BookingService.findGrouped.mockResolvedValue({
        groupedBookings: mockGroupedBookings,
        totalBooking: 10,
        totalItems: 5,
      });

      await BookingController.getGroupedBy(mockReq, mockRes, mockNext);

      expect(BookingService.findGrouped).toHaveBeenCalledWith({
        page: 1,
        limit: 5,
        sort: null,
        userId: 1,
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        meta: {
          status: 200,
          message: 'success',
          pagination: {
            totalPage: 2,
            currentPage: 1,
            pageItems: 5,
            nextPage: 2,
            prevPage: null,
          },
        },
        data: mockGroupedBookings,
      });
    });
  });

  describe('getByCode', () => {
    it('should get booking by code successfully', async () => {
      const mockBooking = { id: 1, code: 'ABC123' };
      mockReq.params = { code: 'ABC123' };

      BookingService.findByCode.mockResolvedValue(mockBooking);

      await BookingController.getByCode(mockReq, mockRes, mockNext);

      expect(BookingService.findByCode).toHaveBeenCalledWith('ABC123');
      expect(mockRes.json).toHaveBeenCalledWith({
        meta: {
          status: 200,
          message: 'successs',
        },
        data: mockBooking,
      });
    });

    it('should return empty array when booking code not found', async () => {
      mockReq.params = { code: 'NOTFOUND' };
      BookingService.findByCode.mockResolvedValue(null);

      await BookingController.getByCode(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({
        meta: {
          status: 200,
          message: 'successs',
        },
        data: [],
      });
    });
  });
});
