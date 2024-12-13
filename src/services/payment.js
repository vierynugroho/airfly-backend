import { ErrorHandler } from '../middlewares/error.js';
import { PaymentRepository } from '../repositories/payment.js';
import { BookingRepository } from '../repositories/booking.js';
import { snap } from '../config/midtrans.js';

export class PaymentService {
  static async create({ id, customerDetails, userId }) {
    const booking = await BookingRepository.findById(id);
    if (!booking) {
      throw new ErrorHandler(404, 'Booking not found or unauthorized.');
    }

    const itemDetails = booking.bookingDetail.map((detail) => {
      return {
        id: `SEAT-${detail.seatId}`,
        price: detail.price,
        quantity: 1,
        name: `Seat ${detail.seatId} ${detail.passenger.name}`,
      };
    });

    const totalPriceWithoutTax = itemDetails.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const taxRate = 0.03;
    const tax = totalPriceWithoutTax * taxRate;

    itemDetails.push({
      id: 'TAX',
      price: tax,
      quantity: 1,
      name: 'Tax',
    });

    const totalAmount = totalPriceWithoutTax + tax;

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

    return {
      token: response.token,
      redirect_url: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${response.token}`,
      payment,
    };
  }

  static async getAll(query) {
    return PaymentRepository.getAll(query);
  }

  static async getById(paymentId) {
    const payment = await PaymentRepository.getById(paymentId);
    if (!payment) {
      throw new ErrorHandler(404, 'Payment not found.');
    }
    return payment;
  }

  static async processWebhook(data) {
    const payment = await PaymentRepository.findByOrderId(orderId);
    if (!payment) {
      throw new ErrorHandler(404, 'Payment not found.');
    }

    console.log('payment on webhook');
    console.log(payment);
    console.log('-----------------');

    const paymentData = await snap.transaction.notification(data);

    // TODO: update payment status
    console.log('paymentData on webhook');
    console.log(paymentData);
    console.log('-----------------');

    // TODO: paymentData.fraud_status == 'accept'
    // TODO: paymentData.transaction_status == 'settlement'
    // ? update seat status -> UNAVAILABLE

    // TODO: paymentData.transaction_status == 'pending'
    // ? update seat status -> LOCKED

    // TODO: paymentData.transaction_status = 'cancel || deny || expire'
    // ? update seat status -> AVAILABLE

    await PaymentRepository.updateStatus(
      payment.id,
      data.paymentstatus,
      data.paymentType,
      data.transactionId,
      data.transactionTime
    );

    await BookingRepository.updateSeatStatusOnPayment(
      paymentstatus,
      payment.bookingId
    );

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

    if (transaction.status_code === '404') {
      throw new ErrorHandler(422, "Transaction doesn't exist.");
    }

    if (typeof orderId !== 'string') {
      throw new ErrorHandler(400, 'orderId must be a string');
    }

    await PaymentRepository.updateStatus(
      orderId,
      'cancel',
      payment.paymentType
    );
    await BookingRepository.updateSeatStatusOnPayment(
      'cancel',
      payment.bookingId
    );

    return transaction;
  }

  static async delete(paymentId) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });
    if (!payment) {
      throw new ErrorHandler(404, 'Payment not found.');
    }
    return prisma.payment.delete({ where: { id: paymentId } });
  }
}
