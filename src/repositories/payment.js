import { prisma } from '../database/db.js';

export class PaymentRepository {
  static async create(paymentData) {
    return prisma.payment.create({ 
      data: paymentData, });
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

  static async getById(paymentId) {
    return prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
    });
  }

  static async findByOrderId(orderId) {
    return prisma.payment.findUnique({ where: { orderId} });
  }

  static async updateStatus(orderId, paymentstatus, paymentType, transactionId, transactionTime) {
    return prisma.payment.update({
      where: { orderId: orderId},
      data: { 
        paymentstatus: paymentstatus,
        paymentType: paymentType},
        transactionId: transactionId,
        transactionTime: transactionTime,
    });
  }

  static async delete(paymentId) {
    return prisma.payment.delete({ where: { id: paymentId } });
  }
}