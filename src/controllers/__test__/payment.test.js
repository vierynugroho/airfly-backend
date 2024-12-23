import { PaymentController } from '../payment.js';
import { PaymentService } from '../../services/payment.js';

jest.mock('../../services/payment.js');

describe('PaymentController', () => {
  let mockRequest, mockResponse, mockNext;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {},
      user: {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
      },
    };
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a snap token and return status 201', async () => {
      const mockSnapToken = 'someSnapToken';
      mockRequest.body.bookingId = 123;

      PaymentService.create.mockResolvedValue(mockSnapToken);

      await PaymentController.create(mockRequest, mockResponse, mockNext);

      expect(PaymentService.create).toHaveBeenCalledWith({
        id: 123,
        userId: 1,
        customerDetails: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '1234567890',
        },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 201,
          message: 'Snap token created successfully',
        },
        data: mockSnapToken,
      });
    });

    it('should handle errors and call next', async () => {
      const error = new Error('Error creating snap token');
      PaymentService.create.mockRejectedValue(error);

      await PaymentController.create(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('handleWebhook', () => {
    it('should process webhook data and return status 200', async () => {
      const mockWebhookData = { status: 'success' };

      PaymentService.processWebhook.mockResolvedValue();

      mockRequest.body = mockWebhookData;

      await PaymentController.handleWebhook(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(PaymentService.processWebhook).toHaveBeenCalledWith(
        mockWebhookData
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith('OK');
    });

    it('should handle errors and call next', async () => {
      const error = new Error('Error processing webhook');
      PaymentService.processWebhook.mockRejectedValue(error);

      await PaymentController.handleWebhook(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAll', () => {
    it('should return all payments with status 200', async () => {
      const mockUser = { id: 1 };
      const mockRequest = {
        user: mockUser,
        query: { page: '1', limit: '10' },
      };
      const mockResponse = {
        json: jest.fn(),
      };
      const mockNext = jest.fn();
      const mockPayments = {
        payments: [{ id: 1, userId: mockUser.id }],
        total: 1,
        page: 1,
        limit: 10,
      };

      jest.spyOn(PaymentService, 'getAll').mockResolvedValue(mockPayments);

      await PaymentController.getAll(mockRequest, mockResponse, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'Payments retrieved successfully',
          pagination: {
            total: 1,
            page: 1,
            limit: 10,
          },
        },
        data: mockPayments.payments,
      });

      expect(PaymentService.getAll).toHaveBeenCalledWith({
        page: '1',
        limit: '10',
        user: mockUser,
      });
    });

    it('should handle errors and call next', async () => {
      const error = new Error('Error retrieving payments');
      mockRequest.query = { page: 1, limit: 10 };
      mockRequest.user = { id: 1 };

      PaymentService.getAll.mockRejectedValue(error);

      await PaymentController.getAll(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getById', () => {
    it('should return a payment by ID with status 200', async () => {
      const mockPayment = { id: 1, amount: 100 };
      mockRequest.params = { id: 1 };
      mockRequest.user = { id: 1, role: 'BUYER' };

      PaymentService.getById.mockResolvedValue(mockPayment);

      await PaymentController.getById(mockRequest, mockResponse, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'Payment retrieved successfully',
        },
        data: mockPayment,
      });
    });

    it('should handle errors and call next', async () => {
      const error = new Error('Error retrieving payment');
      mockRequest.params = { id: 1 };
      mockRequest.user = { id: 1, role: 'BUYER' };

      PaymentService.getById.mockRejectedValue(error);

      await PaymentController.getById(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('cancel', () => {
    it('should cancel the payment and return status 200', async () => {
      const mockTransaction = { orderId: '12345', status: 'canceled' };
      mockRequest.params = { orderId: '12345' };

      PaymentService.cancel.mockResolvedValue(mockTransaction);

      await PaymentController.cancel(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'Transaction canceled successfully',
        },
        data: mockTransaction,
      });
    });

    it('should handle errors and call next', async () => {
      const error = new Error('Error canceling transaction');
      mockRequest.params = { orderId: '12345' };

      PaymentService.cancel.mockRejectedValue(error);

      await PaymentController.cancel(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('delete', () => {
    it('should delete the payment and return status 200', async () => {
      mockRequest.params = { id: 1 };
      mockRequest.user = { id: 1 };

      PaymentService.delete.mockResolvedValue();

      await PaymentController.delete(mockRequest, mockResponse, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'Payment deleted successfully',
        },
      });
    });

    it('should handle errors and call next', async () => {
      const error = new Error('Error deleting payment');
      mockRequest.params = { id: 1 };
      mockRequest.user = { id: 1 };

      PaymentService.delete.mockRejectedValue(error);

      await PaymentController.delete(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
