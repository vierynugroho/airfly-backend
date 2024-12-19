import { SeatController } from './../seat.js';
import { SeatService } from './../../services/seat.js';
import { ErrorHandler } from './../../middlewares/error.js';

// Mock the SeatService
jest.mock('./../../services/seat.js');

describe('SeatController', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {},
    };
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getByID', () => {
    const mockSeatData = {
      id: 8,
      flightId: 1,
      seatNumber: 'A6',
      price: 1000,
      status: 'AVAILABLE',
      class: 'ECONOMY',
      _count: {
        passenger: 0,
      },
      flight: {
        id: 1,
        flightNumber: 'GRD1',
        airlineId: 1,
        departureAirport: 2,
        arrivalAirport: 1,
        departureTime: '1970-01-01T00:00:00.000Z',
        arrivalTime: '1970-01-01T00:00:00.000Z',
      },
    };

    it('should return seat data when valid ID is provided', async () => {
      mockRequest.params = { id: '8' };
      SeatService.findById.mockResolvedValue(mockSeatData);

      await SeatController.getByID(mockRequest, mockResponse, mockNext);

      expect(SeatService.findById).toHaveBeenCalledWith(8);
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'seat data retrieved successfully',
        },
        data: mockSeatData,
      });
    });

    it('should throw error when invalid ID is provided', async () => {
      mockRequest.params = { id: 'invalid' };

      await SeatController.getByID(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });
  });

  describe('create', () => {
    const mockCreateData = {
      flightId: 1,
      seatNumber: 'A6',
      price: 1000,
      status: 'AVAILABLE',
      class: 'ECONOMY',
    };

    it('should create a new seat successfully', async () => {
      mockRequest.body = mockCreateData;
      SeatService.create.mockResolvedValue(mockCreateData);

      await SeatController.create(mockRequest, mockResponse, mockNext);

      expect(SeatService.create).toHaveBeenCalledWith(mockCreateData);
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'seat created successfully',
        },
        data: mockCreateData,
      });
    });
  });

  describe('update', () => {
    const mockUpdateData = {
      price: 1500,
      status: 'BOOKED',
    };

    it('should update seat successfully when valid ID is provided', async () => {
      mockRequest.params = { id: '8' };
      mockRequest.body = mockUpdateData;
      SeatService.update.mockResolvedValue({ ...mockUpdateData, id: 8 });

      await SeatController.update(mockRequest, mockResponse, mockNext);

      expect(SeatService.update).toHaveBeenCalledWith(8, mockUpdateData);
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'seat updated successfully',
        },
        data: expect.objectContaining(mockUpdateData),
      });
    });

    it('should throw error when invalid ID is provided for update', async () => {
      mockRequest.params = { id: 'invalid' };
      mockRequest.body = mockUpdateData;

      await SeatController.update(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });
  });

  describe('delete', () => {
    it('should delete seat successfully when valid ID is provided', async () => {
      mockRequest.params = { id: '8' };
      SeatService.delete.mockResolvedValue({ id: 8 });

      await SeatController.delete(mockRequest, mockResponse, mockNext);

      expect(SeatService.delete).toHaveBeenCalledWith(8);
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'seat deleted successfully',
        },
        data: expect.objectContaining({ id: 8 }),
      });
    });

    it('should throw error when invalid ID is provided for deletion', async () => {
      mockRequest.params = { id: 'invalid' };

      await SeatController.delete(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });
  });

  describe('getAll', () => {
    const mockSeatsData = {
      seats: [
        {
          id: 8,
          flightId: 1,
          seatNumber: 'A6',
          price: 1000,
          status: 'AVAILABLE',
          class: 'ECONOMY',
        },
      ],
      totalSeats: 1,
    };

    it('should return all seats with pagination when page and limit are provided', async () => {
      mockRequest.query = {
        page: '1',
        limit: '10',
      };
      SeatService.findMany.mockResolvedValue(mockSeatsData);

      await SeatController.getAll(mockRequest, mockResponse, mockNext);

      expect(SeatService.findMany).toHaveBeenCalledWith(
        { offset: 0, limit: 10 },
        {}
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'seats data retrieved successfully',
          pagination: {
            totalPage: 1,
            currentPage: 1,
            pageItems: 1,
            nextPage: null,
            prevPage: null,
          },
        },
        data: mockSeatsData.seats,
      });
    });

    it('should apply filters when provided in query', async () => {
      mockRequest.query = {
        flightId: '1',
        seatClass: 'economy',
        seatStatus: 'AVAILABLE',
      };
      SeatService.findMany.mockResolvedValue(mockSeatsData);

      await SeatController.getAll(mockRequest, mockResponse, mockNext);

      expect(SeatService.findMany).toHaveBeenCalledWith(
        {},
        {
          flightId: 1,
          class: 'ECONOMY',
          status: 'AVAILABLE',
        }
      );
    });
  });
});
