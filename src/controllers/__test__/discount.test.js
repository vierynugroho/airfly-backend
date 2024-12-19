import { DiscountController } from './../discount.js';
import { DiscountService } from './../../services/discount.js';

// Mock the DiscountService
jest.mock('./../../services/discount.js');

describe('DiscountController', () => {
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

  describe('create', () => {
    const validDiscountData = {
      code: 'DISCOUNT50',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      percentage: 50,
    };

    it('should create discount successfully with valid data', async () => {
      mockRequest.body = validDiscountData;
      const mockCreatedDiscount = { id: 1, ...validDiscountData };
      DiscountService.create.mockResolvedValue(mockCreatedDiscount);

      await DiscountController.create(mockRequest, mockResponse, mockNext);

      expect(DiscountService.create).toHaveBeenCalledWith(validDiscountData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: { statusCode: 201, message: 'Discount created successfully' },
        data: mockCreatedDiscount,
      });
    });

    it('should handle invalid date format', async () => {
      mockRequest.body = {
        ...validDiscountData,
        startDate: 'invalid-date',
        endDate: 'invalid-date',
      };

      await DiscountController.create(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid date format',
        })
      );
    });
  });

  describe('update', () => {
    const updateData = {
      percentage: 60,
    };

    it('should update discount successfully', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = updateData;
      const mockUpdatedDiscount = { id: 1, ...updateData };
      DiscountService.update.mockResolvedValue(mockUpdatedDiscount);

      await DiscountController.update(mockRequest, mockResponse, mockNext);

      expect(DiscountService.update).toHaveBeenCalledWith(1, updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: { statusCode: 200, message: 'Discount updated successfully' },
        data: expect.objectContaining({ id: '1' }),
      });
    });

    it('should handle invalid ID format', async () => {
      mockRequest.params = { id: 'invalid' };
      mockRequest.body = updateData;

      await DiscountController.update(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Discount ID must be a number',
        })
      );
    });
  });

  describe('delete', () => {
    it('should delete discount successfully', async () => {
      mockRequest.params = { id: '1' };
      const mockDeletedDiscount = { id: 1, code: 'DISCOUNT50' };
      DiscountService.delete.mockResolvedValue(mockDeletedDiscount);

      await DiscountController.delete(mockRequest, mockResponse, mockNext);

      expect(DiscountService.delete).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: { statusCode: 200, message: 'Discount deleted successfully' },
        data: expect.objectContaining({ id: '1' }),
      });
    });

    it('should handle invalid ID format for deletion', async () => {
      mockRequest.params = { id: 'invalid' };

      await DiscountController.delete(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Discount ID must be a number',
        })
      );
    });
  });

  describe('getAll', () => {
    const mockDiscountsData = {
      discounts: [
        { id: 1, code: 'DISCOUNT50' },
        { id: 2, code: 'DISCOUNT25' },
      ],
      totalDiscounts: 2,
    };

    it('should return discounts with pagination', async () => {
      mockRequest.query = {
        page: '1',
        limit: '10',
      };
      DiscountService.findMany.mockResolvedValue(mockDiscountsData);

      await DiscountController.getAll(mockRequest, mockResponse, mockNext);

      expect(DiscountService.findMany).toHaveBeenCalledWith(
        { offset: 0, limit: 10 },
        {}
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'Discounts retrieved successfully',
          pagination: {
            totalPage: 1,
            currentPage: 1,
            pageItems: 2,
          },
        },
        data: expect.arrayContaining([
          expect.objectContaining({ id: '1' }),
          expect.objectContaining({ id: '2' }),
        ]),
      });
    });

    it('should apply filters correctly', async () => {
      mockRequest.query = {
        code: 'TEST',
        isActive: 'true',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };
      DiscountService.findMany.mockResolvedValue({
        discounts: [],
        totalDiscounts: 0,
      });

      await DiscountController.getAll(mockRequest, mockResponse, mockNext);

      expect(DiscountService.findMany).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          code: expect.any(Object),
          isActive: true,
          startDate: expect.any(Object),
          endDate: expect.any(Object),
        })
      );
    });

    it('should handle invalid date formats in filters', async () => {
      mockRequest.query = {
        startDate: 'invalid-date',
        endDate: 'invalid-date',
      };

      await DiscountController.getAll(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid startDate format',
        })
      );
    });
  });

  describe('getByID', () => {
    const mockDiscount = {
      id: 1,
      code: 'DISCOUNT50',
      percentage: 50,
    };

    it('should return discount when valid ID is provided', async () => {
      mockRequest.params = { id: '1' };
      DiscountService.findByID.mockResolvedValue(mockDiscount);

      await DiscountController.getByID(mockRequest, mockResponse, mockNext);

      expect(DiscountService.findByID).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: { statusCode: 200, message: 'Discount retrieved successfully' },
        data: expect.objectContaining({ id: '1' }),
      });
    });

    it('should handle invalid ID format', async () => {
      mockRequest.params = { id: 'invalid' };

      await DiscountController.getByID(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Discount ID must be a number',
        })
      );
    });

    it('should handle service errors', async () => {
      mockRequest.params = { id: '1' };
      const error = new Error('Service error');
      DiscountService.findByID.mockRejectedValue(error);

      await DiscountController.getByID(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
