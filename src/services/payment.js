import { ErrorHandler } from '../middlewares/error.js';
import { PaymentRepository } from '../repositories/payment.js';
import { BookingRepository } from '../repositories/booking.js';
import { snap } from '../config/midtrans.js';

export class PaymentService {
  static async create({ id, userId }) {
    const booking = await BookingRepository.findById(id);
    if (!booking) {
      throw new ErrorHandler(404, 'Booking not found or unauthorized.');
    }


    if (booking.userId !== userId) {
      throw new ErrorHandler(404, 'User associated with the booking not found.');
    }

    const existingPayment = await PaymentRepository.getByBookingId(id);
    if (existingPayment) {
        throw new ErrorHandler(409, 'Payment for this booking already exists.');
    }

    const snapResponse = await snap.createTransaction({
      transaction_details: {
        order_id: `ORDER-${id}-${Date.now()}`,
        gross_amount: booking.totalPrice,
      }
    });

    const payment = await PaymentRepository.create({
        bookingId: id,
        snapToken: snapResponse.token,
        paymentAmount: booking.totalPrice,
        paymentstatus: 'PENDING',
        userId,
    });

    return payment;
  }

  static async getAll(query) {
    return PaymentRepository.getAll(query);
  }

  static async getByID(paymentId) {
    const payment = await PaymentRepository.getByID(paymentId);
    if (!payment) throw new ErrorHandler(404, 'Payment not found.');
    return payment;
  }

  static async processWebhook({ snapToken, paymentStatus, paymentType }) {
    const payment = await PaymentRepository.findBySnapToken(snapToken);
    if (!payment) {
      throw new ErrorHandler(404, 'Payment not found.');
    }
  
    let updatedStatus;
    if (paymentStatus === 'settlement') {
      updatedStatus = 'SETTLEMENT';
    } else if (paymentStatus === 'cancel') {
      updatedStatus = 'CANCEL';
    } else if (paymentStatus === 'expire') {
      updatedStatus = 'EXPIRE';
    } else {
      updatedStatus = 'PENDING';
    }

    let validPaymentType;
    if (paymentType === 'credit_card') {
      validPaymentType = 'CREDIT_CARD';
    } else if (paymentType === 'bank_transfer') {
      validPaymentType = 'BANK_TRANSFER';
    } else if (paymentType === 'digital_wallet') {
      validPaymentType = 'DIGITAL_WALLET';
    } else if (paymentType === 'paypal') {
      validPaymentType = 'PAYPAL';
    } else {
      throw new ErrorHandler(400, 'Invalid payment type.');
    }
  
    return PaymentRepository.updateStatus(payment.id, updatedStatus, validPaymentType);
  }

  static async delete(paymentId) {
    return PaymentRepository.delete(paymentId);
  }
}