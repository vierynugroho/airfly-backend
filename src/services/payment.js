import { ErrorHandler } from '../middlewares/error.js';
import { PaymentRepository } from '../repositories/payment.js';
import { BookingRepository } from '../repositories/booking.js';
import { NotificationService } from './notification.js';
import { snap } from '../config/midtrans.js';

export class PaymentService {
  static async create({ id, customerDetails, userId }) {
    const booking = await BookingRepository.findById(id);
    if (!booking) {
      throw new ErrorHandler(404, 'Booking not found or unauthorized.');
    }

    const itemDetails = booking.bookingDetail.map((detail) => {
      return {
        id: booking.id,
        price: Math.round(detail.price),
        quantity: 1,
        name: `${booking.code} Seat-${detail.seatId}`,
      };
    });

    const totalPriceWithoutTax = itemDetails.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const taxRate = 0.03;
    const tax = Math.round(totalPriceWithoutTax * taxRate);

    itemDetails.push({
      id: `Tax- ${booking.id}`,
      price: tax,
      quantity: 1,
      name: 'TAX',
    });

    const totalAmount = Math.round(totalPriceWithoutTax + tax);

    const itemDetailsTotal = itemDetails.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    if (itemDetailsTotal !== totalAmount) {
      throw new ErrorHandler(
        400,
        'The sum of item details does not match the gross amount.'
      );
    }

    const order_id = crypto.randomUUID();

    const parameter = {
      transaction_details: {
        gross_amount: totalAmount,
        order_id: order_id,
      },
      item_details: itemDetails,
      customer_details: {
        first_name: customerDetails.firstName,
        last_name: customerDetails.lastName,
        email: customerDetails.email,
        phone: customerDetails.phone,
      },
    };
    const response = await snap.createTransaction(parameter);

    const paymentData = {
      userId,
      bookingId: booking.id,
      snapToken: response.token,
      orderId: order_id,
      status: 'pending',
      amount: totalAmount,
      type: response.payment_type || null,
      transactionId: response.transaction_id || null,
      transactionTime: response.transaction_time || null,
    };

    const payment = await PaymentRepository.create(paymentData);

    const notificationData = {
      type: 'PAYMENT',
      title: 'Transaction Created',
      description: `Transaction for ID ${payment.id} has been successfully created!`,
      isRead: false,
      userId: payment.userId,
    };

    await NotificationService.create(notificationData);

    return {
      token: response.token,
      redirect_url: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${response.token}`,
      payment,
    };
  }

  static async getAll({ page, limit, user }) {
    const query = { page: parseInt(page) || 1, limit: parseInt(limit) || 10 };

    if (user.role === 'BUYER') {
      query.userId = user.id;
    }
    return PaymentRepository.getAll(query);
  }

  static async getById(paymentId, userId, role) {
    let payment;
    if (role === 'ADMIN') {
      payment = await PaymentRepository.getById(paymentId);
    } else {
      payment = await PaymentRepository.getByIdForBuyer(paymentId, userId);
    }

    if (!payment) {
      throw new ErrorHandler(404, 'Payment not found.');
    }
    return payment;
  }

  static async processWebhook(data) {
    const payment = await PaymentRepository.findByOrderId(data.order_id);
    if (!payment) {
      throw new ErrorHandler(404, 'Payment not found.');
    }

    const booking = await BookingRepository.getBooking(payment.bookingId);

    if (!booking) {
      throw new ErrorHandler(404, 'Booking is not found');
    }

    const seatIds = booking.bookingDetail.map((detail) => detail.seatId);

    console.log('payment on webhook');
    console.log(payment);
    console.log('-----------------');

    const paymentData = await snap.transaction.notification(data);
    console.log('paymentData on webhook');
    console.log(paymentData);
    console.log('-----------------');

    const { transaction_status, fraud_status, order_id } = paymentData;

    await PaymentRepository.updateStatus(
      order_id,
      transaction_status,
      paymentData.payment_type,
      paymentData.transaction_id,
      new Date(paymentData.transaction_time).toISOString()
    );

    console.log({
      transaction_status: transaction_status,
      capture: transaction_status === 'capture',
      accept: transaction_status === 'accept',
      settlement: transaction_status === 'settlement',
      cancel: transaction_status === 'cancel',
      deny: transaction_status === 'deny',
      expire: transaction_status === 'expire',
      pending: transaction_status === 'pending',
    });

    if (transaction_status === 'capture' && fraud_status === 'accept') {
      await BookingRepository.updateSeatStatusOnPayment(seatIds, 'UNAVAILABLE');
    } else if (transaction_status === 'settlement') {
      await BookingRepository.updateSeatStatusOnPayment(seatIds, 'UNAVAILABLE');
    } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
      await BookingRepository.updateSeatStatusOnPayment(seatIds, 'AVAILABLE');
    } else if (transaction_status === 'pending') {
      await BookingRepository.updateSeatStatusOnPayment(seatIds, 'LOCKED');
    } else {
      throw new ErrorHandler(400, 'Invalid transaction status.');
    }

    return payment;
  }

  static async cancel(orderId) {
    const payment = await PaymentRepository.findByOrderId(orderId);

    if (!payment) {
      throw new ErrorHandler(404, 'Payment not found.');
    }

    if (payment.paymentstatus === 'settlement') {
      throw new ErrorHandler(
        400,
        'Transaction is already settled. Cannot cancel.'
      );
    }

    const encodedServerKey = btoa(`${process.env.MIDTRANS_SERVER_KEY}:`);

    const url = `https://api.sandbox.midtrans.com/v2/${orderId}/cancel`;
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        authorization: `Basic ${encodedServerKey}`,
      },
    };

    const response = await fetch(url, options);
    const transaction = await response.json();

    console.log('response cancel');
    console.log(transaction);
    if (transaction.status_code === '404') {
      throw new ErrorHandler(422, "Transaction doesn't exist.");
    }

    if (typeof orderId !== 'string') {
      throw new ErrorHandler(400, 'orderId must be a string');
    }

    await PaymentRepository.updateStatus(orderId, 'cancel');

    const booking = await BookingRepository.getBooking(payment.bookingId);

    if (!booking) {
      throw new ErrorHandler(404, 'Booking is not found');
    }

    const seatIds = booking.bookingDetail.map((detail) => detail.seatId);

    await BookingRepository.updateSeatStatusOnPayment(seatIds, 'AVAILABLE');

    return transaction;
  }

  static async delete(paymentId, user) {
    if (user.role !== 'ADMIN') {
      throw new ErrorHandler(
        403,
        'You are not authorized to perform this action.'
      );
    }
    const payment = await PaymentRepository.getById(paymentId);
    if (!payment) {
      throw new ErrorHandler(404, 'Payment not found.');
    }
    return PaymentRepository.delete(paymentId);
  }
}
