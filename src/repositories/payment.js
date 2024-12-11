import { prisma } from '../database/db.js';

export class PaymentRepository {
  static async create(data) {
    return prisma.payment.create({ data });
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

  static async getByID(paymentId) {
    return prisma.payment.findUnique({ where: { id: paymentId } });
  }

  static async findBySnapToken(snapToken) {
    return prisma.payment.findUnique({ where: { snapToken } });
  }

  static async updateStatus(paymentId, paymentstatus, paymentType) {
    return prisma.payment.update({
      where: { id: paymentId },
      data: { 
        paymentstatus: paymentstatus,
        paymentType: paymentType},
    });
  }

  static async delete(paymentId) {
    return prisma.payment.delete({ where: { id: paymentId } });
  }
}