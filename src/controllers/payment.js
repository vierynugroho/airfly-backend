import { PaymentService } from '../services/payment.js';

export class PaymentController {
  static async create(req, res, next) {
    try {
      const customerDetails = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phone: req.user.phone,
      };

      const snapToken = await PaymentService.create({
        id: req.body.bookingId,
        userId: req.user.id,
        customerDetails,
      });

      res.status(201).json({
        meta: {
          statusCode: 201,
          message: 'Snap token created successfully',
        },
        data: snapToken,
      });
    } catch (e) {
      next(e);
    }
  }

  static async handleWebhook(req, res, next) {
    try {
      console.log('req body weebhook:');
      console.log(req.body);
      console.log('-----------------');
      const data = req.body;

      await PaymentService.processWebhook(data);

      res.status(200).send('OK');
    } catch (e) {
      next(e);
    }
  }

  static async getAll(req, res, next) {
    try {
      const { page, limit } = req.query;
      const payment = await PaymentService.getAll({
        page,
        limit,
        user: req.user,
      });
      res.json({
        meta: {
          statusCode: 200,
          message: 'Payments retrieved successfully',
        },
        data: payment,
      });
    } catch (e) {
      next(e);
    }
  }

  static async getById(req, res, next) {
    try {
      const paymentId = parseInt(req.params.id, 10);
      const userId = req.user.id;
      const role = req.user.role;
      const payment = await PaymentService.getById(paymentId, userId, role);
      res.json({
        meta: {
          statusCode: 200,
          message: 'Payment retrieved successfully',
        },
        data: payment,
      });
    } catch (e) {
      next(e);
    }
  }

  static async cancel(req, res, next) {
    try {
      const { orderId } = req.params;
      console.log(`orderID: ${orderId}`);
      const transaction = await PaymentService.cancel(orderId);

      res.status(200).json({
        meta: {
          statusCode: 200,
          message: 'Transaction canceled successfully',
        },
        data: transaction,
      });
    } catch (e) {
      next(e);
    }
  }

  static async delete(req, res, next) {
    try {
      const paymentId = parseInt(req.params.id, 10);
      await PaymentService.delete(paymentId, req.user);
      res.json({
        meta: {
          statusCode: 200,
          message: 'Payment deleted successfully',
        },
      });
    } catch (e) {
      next(e);
    }
  }
}
