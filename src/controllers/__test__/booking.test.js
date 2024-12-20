import { BookingController } from '../booking.js';
import { BookingService } from '../../services/booking.js';
import { UserRole } from '@prisma/client';

jest.mock('../../services/booking.js');

const mockRequest = (user, query = {}, params = {}, body = {}) => ({
  user,
  query,
  params,
  body,
});

const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe('BookingController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    it('should create a booking and return the booking ID', async () => {
      const req = mockRequest({ id: 1 }, {}, {}, { bookingDetails: 'test' });
      const res = mockResponse();
      BookingService.createBooking.mockResolvedValue(1);

      await BookingController.createBooking(req, res, mockNext);

      expect(BookingService.createBooking).toHaveBeenCalledWith({
        ...req.body,
        userId: req.user.id,
      });
      expect(res.json).toHaveBeenCalledWith({
        meta: { statusCode: 201, message: 'booking created' },
        data: { bookingId: 1 },
      });
    });

    it('should handle errors', async () => {
      const req = mockRequest({ id: 1 });
      const res = mockResponse();
      const error = new Error('Test error');
      BookingService.createBooking.mockRejectedValue(error);

      await BookingController.createBooking(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAll', () => {
    it('should return all bookings with pagination', async () => {
      const req = mockRequest(
        { id: 1, role: UserRole.USER },
        { page: '1', limit: '5', sort: 'asc' }
      );
      const res = mockResponse();
      const mockResponseData = { bookings: [], totalBooking: 0 };
      BookingService.findBooking.mockResolvedValue(mockResponseData);

      await BookingController.getAll(req, res, mockNext);

      expect(BookingService.findBooking).toHaveBeenCalledWith({
        page: 1,
        limit: 5,
        sort: 'asc',
        userId: req.user.id,
      });
      expect(res.json).toHaveBeenCalledWith({
        meta: {
          status: 200,
          message: 'success',
          pagination: {
            totalPage: 0,
            currentPage: 1,
            pageItems: 0,
            nextPage: null,
            prevPage: null,
          },
        },
        data: [],
      });
    });
  });

  describe('getById', () => {
    it('should return a booking by ID', async () => {
      const req = mockRequest({}, {}, { id: '1' });
      const res = mockResponse();
      BookingService.findById.mockResolvedValue({ id: 1 });

      await BookingController.getById(req, res, mockNext);

      expect(BookingService.findById).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({
        meta: { status: 200, message: 'successs' },
        data: { id: 1 },
      });
    });
  });

  describe('getByCode', () => {
    it('should return a booking by code', async () => {
      const req = mockRequest({}, {}, { code: 'ABC123' });
      const res = mockResponse();
      BookingService.findByCode.mockResolvedValue({ code: 'ABC123' });

      await BookingController.getByCode(req, res, mockNext);

      expect(BookingService.findByCode).toHaveBeenCalledWith('ABC123');
      expect(res.json).toHaveBeenCalledWith({
        meta: { status: 200, message: 'successs' },
        data: { code: 'ABC123' },
      });
    });
  });

  describe('getGroupedBy', () => {
    it('should return grouped bookings with pagination', async () => {
      const req = mockRequest(
        { id: 1, role: UserRole.USER },
        { page: '1', limit: '5', sort: 'desc' }
      );
      const res = mockResponse();
      const mockResponseData = {
        groupedBookings: [],
        totalBooking: 0,
        totalItems: 0,
      };
      BookingService.findGrouped.mockResolvedValue(mockResponseData);

      await BookingController.getGroupedBy(req, res, mockNext);

      expect(BookingService.findGrouped).toHaveBeenCalledWith({
        page: 1,
        limit: 5,
        sort: 'desc',
        userId: req.user.id,
      });
      expect(res.json).toHaveBeenCalledWith({
        meta: {
          status: 200,
          message: 'success',
          pagination: {
            totalPage: 0,
            currentPage: 1,
            pageItems: 0,
            nextPage: null,
            prevPage: null,
          },
        },
        data: [],
      });
    });
  });
});
