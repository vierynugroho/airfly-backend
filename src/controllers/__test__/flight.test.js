import { FlightController } from './../flight.js';
import { FlightService } from './../../services/flight.js';
import { ErrorHandler } from './../../middlewares/error.js';

// Mock the FlightService
jest.mock('./../../services/flight.js');

describe('FlightController', () => {
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

  describe('getAll', () => {
    const mockFlightsData = {
      flights: [
        {
          id: 1,
          flightNumber: 'FL001',
          departureAirport: 1,
          arrivalAirport: 2,
          departureTime: '2024-01-01T10:00:00Z',
          arrivalTime: '2024-01-01T12:00:00Z',
          price: 1000,
        },
      ],
      totalFlights: 1,
    };

    it('should return flights with pagination when page and limit are provided', async () => {
      mockRequest.query = {
        page: '1',
        limit: '10',
        departureAirport: '1',
        arrivalAirport: '2',
      };
      FlightService.getAll.mockResolvedValue(mockFlightsData);

      await FlightController.getAll(mockRequest, mockResponse, mockNext);

      expect(FlightService.getAll).toHaveBeenCalledWith(
        { offset: 0, limit: 10 },
        { departureAirport: 1, arrivalAirport: 2 },
        {},
        {}
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'flights data retrieved successfully',
          pagination: {
            totalPage: 1,
            currentPage: 1,
            pageItems: 1,
            nextPage: null,
            prevPage: null,
          },
        },
        data: mockFlightsData.flights,
      });
    });

    it('should handle invalid airport IDs', async () => {
      mockRequest.query = {
        departureAirport: 'invalid',
        arrivalAirport: 'invalid',
      };

      await FlightController.getAll(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });

    it('should apply all sorting options', async () => {
      mockRequest.query = {
        isCheapest: 'true',
        shortest: 'true',
        earliestDeparture: 'true',
        latestDeparture: 'true',
        earliestArrival: 'true',
        latestArrival: 'true',
        departureAirport: '1',
        arrivalAirport: '2',
      };
      FlightService.getAll.mockResolvedValue(mockFlightsData);

      await FlightController.getAll(mockRequest, mockResponse, mockNext);

      expect(FlightService.getAll).toHaveBeenCalled();
    });

    it('should apply all filter conditions', async () => {
      const testDate = new Date('2024-01-01').toISOString();
      mockRequest.query = {
        priceMin: '500',
        priceMax: '1500',
        departureTime: testDate,
        returnTime: testDate,
        startDeparture: testDate,
        flightNumber: 'FL001',
        seatClass: 'ECONOMY',
        state: 'California',
        departureAirport: '1',
        arrivalAirport: '2',
      };
      FlightService.getAll.mockResolvedValue(mockFlightsData);

      await FlightController.getAll(mockRequest, mockResponse, mockNext);

      expect(FlightService.getAll).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      FlightService.getAll.mockRejectedValue(error);
      mockRequest.query = {
        departureAirport: '1',
        arrivalAirport: '2',
      };

      await FlightController.getAll(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getByID', () => {
    const mockFlight = {
      id: 1,
      flightNumber: 'FL001',
    };

    it('should return flight when valid ID is provided', async () => {
      mockRequest.params = { id: '1' };
      FlightService.getByID.mockResolvedValue(mockFlight);

      await FlightController.getByID(mockRequest, mockResponse, mockNext);

      expect(FlightService.getByID).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'fligt data retrieved successfully',
        },
        data: mockFlight,
      });
    });

    it('should handle invalid ID format', async () => {
      mockRequest.params = { id: 'invalid' };

      await FlightController.getByID(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });
  });

  describe('create', () => {
    const mockFlightData = {
      flightNumber: 'FL001',
      departureAirport: 1,
      arrivalAirport: 2,
    };

    it('should create flight successfully', async () => {
      mockRequest.body = mockFlightData;
      FlightService.create.mockResolvedValue(mockFlightData);

      await FlightController.create(mockRequest, mockResponse, mockNext);

      expect(FlightService.create).toHaveBeenCalledWith(mockFlightData);
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'flight created successfully',
        },
        data: mockFlightData,
      });
    });

    it('should handle create errors', async () => {
      const error = new Error('Create error');
      FlightService.create.mockRejectedValue(error);
      mockRequest.body = mockFlightData;

      await FlightController.create(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('update', () => {
    const mockUpdateData = {
      price: 1500,
    };

    it('should update flight successfully', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = mockUpdateData;
      FlightService.update.mockResolvedValue({ id: 1, ...mockUpdateData });

      await FlightController.update(mockRequest, mockResponse, mockNext);

      expect(FlightService.update).toHaveBeenCalledWith(1, mockUpdateData);
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'flight updated successfully',
        },
        data: expect.objectContaining(mockUpdateData),
      });
    });

    it('should handle invalid ID format for update', async () => {
      mockRequest.params = { id: 'invalid' };
      mockRequest.body = mockUpdateData;

      await FlightController.update(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });
  });

  describe('delete', () => {
    it('should delete flight successfully', async () => {
      mockRequest.params = { id: '1' };
      FlightService.delete.mockResolvedValue({ id: 1 });

      await FlightController.delete(mockRequest, mockResponse, mockNext);

      expect(FlightService.delete).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'flight deleted successfully',
        },
        data: expect.objectContaining({ id: 1 }),
      });
    });

    it('should handle invalid ID format for delete', async () => {
      mockRequest.params = { id: 'invalid' };

      await FlightController.delete(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });

    it('should handle delete errors', async () => {
      const error = new Error('Delete error');
      FlightService.delete.mockRejectedValue(error);
      mockRequest.params = { id: '1' };

      await FlightController.delete(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
