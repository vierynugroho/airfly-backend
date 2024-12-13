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

  static async getAll({ page, limit }) {
    const offset = (page - 1) * limit;
    const [payments, total] = await prisma.$transaction([
      prisma.payment.findMany({
        skip: offset,
        take: limit,
        orderBy: { transactionTime: 'desc' },
      }),
      prisma.payment.count(),
    ]);

    return { payments, total, page, limit };
  }

  static async getById(paymentId, userId) {
    return prisma.payment.findUnique({
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

    const isoTransactionTime = new Date(transactionTime).toISOString();

    return prisma.payment.update({
      where: { orderId: orderId },
      data: {
        status: paymentstatus,
        type: paymentType,
        transactionId: transactionId,
        transactionTime: isoTransactionTime,
      },
    });
  }

  static async delete(paymentId) {
    return prisma.payment.delete({ where: { id: paymentId } });
  }
}
