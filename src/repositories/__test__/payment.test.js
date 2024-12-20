import { PaymentRepository } from '../payment.js';
import { prisma } from '../../database/db.js';

jest.mock('../../database/db.js', () => ({
  prisma: {
    payment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe('PaymentRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new payment', async () => {
      const mockPaymentData = { bookingId: 1, amount: 100 };
      const mockResponse = { id: 1, ...mockPaymentData };

      prisma.payment.create.mockResolvedValue(mockResponse);

      const result = await PaymentRepository.create(mockPaymentData);

      expect(prisma.payment.create).toHaveBeenCalledWith({ data: mockPaymentData });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getByBookingId', () => {
    it('should return payment by booking ID', async () => {
      const mockBookingId = 1;
      const mockResponse = { id: 1, bookingId: mockBookingId };

      prisma.payment.findUnique.mockResolvedValue(mockResponse);

      const result = await PaymentRepository.getByBookingId(mockBookingId);

      expect(prisma.payment.findUnique).toHaveBeenCalledWith({ where: { bookingId: mockBookingId } });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getAll', () => {
    it('should return all payments with pagination and filtering by user ID', async () => {
      const mockPage = 1;
      const mockLimit = 10;
      const mockUserId = 2;
      const mockPayments = [
        { id: 1, userId: mockUserId },
        { id: 2, userId: mockUserId },
      ];
      const mockTotal = 2;

      prisma.$transaction.mockResolvedValue([mockPayments, mockTotal]);

      const result = await PaymentRepository.getAll({ page: mockPage, limit: mockLimit, userId: mockUserId });

      expect(prisma.$transaction).toHaveBeenCalledWith([
        prisma.payment.findMany({
          where: { userId: mockUserId },
          skip: 0,
          take: mockLimit,
          orderBy: { transactionTime: 'desc' },
        }),
        prisma.payment.count({ where: { userId: mockUserId } }),
      ]);

      expect(result).toEqual({ payments: mockPayments, total: mockTotal, page: mockPage, limit: mockLimit });
    });
  });

  describe('getById', () => {
    it('should return payment by ID', async () => {
      const mockPaymentId = 1;
      const mockResponse = { id: mockPaymentId };

      prisma.payment.findUnique.mockResolvedValue(mockResponse);

      const result = await PaymentRepository.getById(mockPaymentId);

      expect(prisma.payment.findUnique).toHaveBeenCalledWith({ where: { id: mockPaymentId } });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getByIdForBuyer', () => {
    it('should return payment by ID and user ID for buyer', async () => {
      const mockPaymentId = 1;
      const mockUserId = 2;
      const mockResponse = { id: mockPaymentId, userId: mockUserId };

      prisma.payment.findUnique.mockResolvedValue(mockResponse);

      const result = await PaymentRepository.getByIdForBuyer(mockPaymentId, mockUserId);

      expect(prisma.payment.findUnique).toHaveBeenCalledWith({
        where: { id: mockPaymentId, userId: mockUserId },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findByOrderId', () => {
    it('should return payment by order ID', async () => {
      const mockOrderId = 'ORD123';
      const mockResponse = { id: 1, orderId: mockOrderId };

      prisma.payment.findUnique.mockResolvedValue(mockResponse);

      const result = await PaymentRepository.findByOrderId(mockOrderId);

      expect(prisma.payment.findUnique).toHaveBeenCalledWith({ where: { orderId: mockOrderId } });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateStatus', () => {
    it('should update payment status by order ID', async () => {
      const mockOrderId = 'ORD123';
      const mockData = {
        status: 'PAID',
        type: 'CREDIT_CARD',
        transactionId: 'TXN123',
        transactionTime: new Date(),
      };
      const mockResponse = { id: 1, ...mockData };

      prisma.payment.update.mockResolvedValue(mockResponse);

      const result = await PaymentRepository.updateStatus(
        mockOrderId,
        mockData.status,
        mockData.type,
        mockData.transactionId,
        mockData.transactionTime
      );

      expect(prisma.payment.update).toHaveBeenCalledWith({
        where: { orderId: mockOrderId },
        data: mockData,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('should delete a payment by ID', async () => {
      const mockPaymentId = 1;
      const mockResponse = { id: mockPaymentId };

      prisma.payment.delete.mockResolvedValue(mockResponse);

      const result = await PaymentRepository.delete(mockPaymentId);

      expect(prisma.payment.delete).toHaveBeenCalledWith({ where: { id: mockPaymentId } });
      expect(result).toEqual(mockResponse);
    });
  });
});
