import { PaymentService } from '../payment.js';
import { PaymentRepository } from '../../repositories/payment.js';
import { BookingRepository } from '../../repositories/booking.js';
import { NotificationService } from '../notification.js';
import { snap } from '../../config/midtrans';
import { ErrorHandler } from '../../middlewares/error';

jest.mock('../../repositories/payment.js');
jest.mock('../../repositories/booking.js');
jest.mock('../notification.js');
jest.mock('../../config/midtrans.js');
jest.mock('crypto', () => ({
  randomUUID: () => 'mock-uuid',
  randomBytes: () => 'abcd',
}));

describe('PaymentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const mockBooking = {
      id: 1,
      code: 'BOOK123',
      bookingDetail: [
        { price: 100000, seatId: 'A1' },
        { price: 150000, seatId: 'A2' },
      ],
    };

    const mockCustomerDetails = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
    };

    it('should create payment successfully', async () => {
      BookingRepository.findById.mockResolvedValue(mockBooking);
      snap.createTransaction.mockResolvedValue({
        token: 'snap-token-123',
        payment_type: 'credit_card',
        transaction_id: 'trans-123',
        transaction_time: '2024-01-01T10:00:00Z',
      });
      PaymentRepository.create.mockResolvedValue({ id: 1, userId: 1 });

      const result = await PaymentService.create({
        id: 1,
        customerDetails: mockCustomerDetails,
        userId: 123,
      });

      expect(result).toHaveProperty('token', 'snap-token-123');
      expect(result).toHaveProperty('redirect_url');
      expect(result).toHaveProperty('payment');
      expect(NotificationService.create).toHaveBeenCalled();
    });

    it('should throw error if booking not found', async () => {
      BookingRepository.findById.mockResolvedValue(null);

      await expect(
        PaymentService.create({
          id: 1,
          customerDetails: mockCustomerDetails,
          userId: 123,
        })
      ).rejects.toThrow(
        new ErrorHandler(404, 'Booking not found or unauthorized.')
      );
    });
  });

  describe('getAll', () => {
    it('should get all payments for ADMIN', async () => {
      const mockPayments = [{ id: 1 }, { id: 2 }];
      PaymentRepository.getAll.mockResolvedValue(mockPayments);

      const result = await PaymentService.getAll({
        page: 1,
        limit: 10,
        user: { role: 'ADMIN' },
      });

      expect(result).toEqual(mockPayments);
    });

    it('should get user payments for BUYER', async () => {
      const mockPayments = [{ id: 1 }];
      PaymentRepository.getAll.mockResolvedValue(mockPayments);

      await PaymentService.getAll({
        page: 1,
        limit: 10,
        user: { role: 'BUYER', id: 123 },
      });

      expect(PaymentRepository.getAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        userId: 123,
      });
    });
  });

  describe('getById', () => {
    it('should get payment by ID for ADMIN', async () => {
      const mockPayment = { id: 1 };
      PaymentRepository.getById.mockResolvedValue(mockPayment);

      const result = await PaymentService.getById(1, 123, 'ADMIN');

      expect(result).toEqual(mockPayment);
    });

    it('should get payment by ID for BUYER', async () => {
      const mockPayment = { id: 1, userId: 123 };
      PaymentRepository.getByIdForBuyer.mockResolvedValue(mockPayment);

      const result = await PaymentService.getById(1, 123, 'BUYER');

      expect(result).toEqual(mockPayment);
    });

    it('should throw error if payment not found', async () => {
      PaymentRepository.getById.mockResolvedValue(null);

      await expect(PaymentService.getById(1, 123, 'ADMIN')).rejects.toThrow(
        new ErrorHandler(404, 'Payment not found.')
      );
    });
  });

  describe('processWebhook', () => {
    const mockWebhookData = {
      order_id: 'order-123',
      transaction_status: 'settlement',
      fraud_status: 'accept',
    };

    const mockPayment = {
      id: 1,
      bookingId: 1,
    };

    const mockBooking = {
      bookingDetail: [{ seatId: 'A1' }, { seatId: 'A2' }],
    };

    it('should process settlement webhook successfully', async () => {
      PaymentRepository.findByOrderId.mockResolvedValue(mockPayment);
      BookingRepository.getBooking.mockResolvedValue(mockBooking);
      snap.transaction.notification.mockResolvedValue({
        ...mockWebhookData,
        payment_type: 'credit_card',
        transaction_id: 'trans-123',
        transaction_time: '2024-01-01T10:00:00Z',
      });

      await PaymentService.processWebhook(mockWebhookData);

      expect(BookingRepository.updateSeatStatusOnPayment).toHaveBeenCalledWith(
        ['A1', 'A2'],
        'UNAVAILABLE'
      );
    });

    it('should process cancel webhook successfully', async () => {
      const cancelWebhookData = {
        ...mockWebhookData,
        transaction_status: 'cancel',
        transaction_time: new Date().toISOString(),
      };

      PaymentRepository.findByOrderId.mockResolvedValue(mockPayment);
      BookingRepository.getBooking.mockResolvedValue(mockBooking);
      snap.transaction.notification.mockResolvedValue(cancelWebhookData);

      await PaymentService.processWebhook(cancelWebhookData);

      expect(BookingRepository.updateSeatStatusOnPayment).toHaveBeenCalledWith(
        ['A1', 'A2'],
        'AVAILABLE'
      );
    });
  });

  describe('cancel', () => {
    const mockPayment = {
      id: 1,
      bookingId: 1,
      paymentstatus: 'pending',
    };

    const mockBooking = {
      bookingDetail: [{ seatId: 'A1' }],
    };

    beforeEach(() => {
      global.fetch = jest.fn();
      global.btoa = jest.fn().mockReturnValue('encoded-key');
    });

    it('should cancel payment successfully', async () => {
      PaymentRepository.findByOrderId.mockResolvedValue(mockPayment);
      BookingRepository.getBooking.mockResolvedValue(mockBooking);
      global.fetch.mockResolvedValue({
        json: () => Promise.resolve({ status_code: '200' }),
      });

      await PaymentService.cancel('order-123');

      expect(PaymentRepository.updateStatus).toHaveBeenCalledWith(
        'order-123',
        'cancel'
      );
      expect(BookingRepository.updateSeatStatusOnPayment).toHaveBeenCalledWith(
        ['A1'],
        'AVAILABLE'
      );
    });

    it('should throw error if payment is already settled', async () => {
      PaymentRepository.findByOrderId.mockResolvedValue({
        ...mockPayment,
        paymentstatus: 'settlement',
      });

      await expect(PaymentService.cancel('order-123')).rejects.toThrow(
        new ErrorHandler(400, 'Transaction is already settled. Cannot cancel.')
      );
    });
  });

  describe('delete', () => {
    it('should delete payment successfully for ADMIN', async () => {
      PaymentRepository.getById.mockResolvedValue({ id: 1 });
      PaymentRepository.delete.mockResolvedValue({ success: true });

      const result = await PaymentService.delete(1, { role: 'ADMIN' });

      expect(result).toEqual({ success: true });
    });

    it('should throw error for non-ADMIN users', async () => {
      await expect(PaymentService.delete(1, { role: 'BUYER' })).rejects.toThrow(
        new ErrorHandler(403, 'You are not authorized to perform this action.')
      );
    });
  });
});
