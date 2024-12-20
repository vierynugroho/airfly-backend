import { prisma } from '../database/db.js';

export class PaymentRepository {
  static async create(paymentData) {
    return prisma.payment.create({
      data: paymentData,
    });
  }

  static async getByBookingId(bookingId) {
    return prisma.payment.findUnique({ where: { bookingId } });
  }

  static async getAll({ page, limit, userId }) {
    const offset = (page - 1) * limit;

    const whereClause = userId ? { userId } : {};

    const [payments, total] = await prisma.$transaction([
      prisma.payment.findMany({
        where: whereClause,
        skip: offset,
        take: limit,
        orderBy: { transactionTime: 'desc' },
      }),
      prisma.payment.count({ where: whereClause }),
    ]);

    return { payments, total, page, limit };
  }

  static async getById(paymentId) {
    return prisma.payment.findUnique({
      where: { id: paymentId },
    });
  }

  static async getByIdForBuyer(paymentId, userId) {
    return prisma.payment.findFirst({
      where: {
        id: paymentId,
        userId: userId,
      },
    });
  }

  static async findByOrderId(orderId) {
    return prisma.payment.findUnique({ where: { orderId } });
  }

  static async updateStatus(
    orderId,
    paymentstatus,
    paymentType,
    transactionId,
    transactionTime
  ) {
    return prisma.payment.update({
      where: { orderId: orderId },
      data: {
        status: paymentstatus,
        type: paymentType,
        transactionId,
        transactionTime,
      },
    });
  }

  static async delete(paymentId) {
    return prisma.payment.delete({ where: { id: paymentId } });
  }
}
