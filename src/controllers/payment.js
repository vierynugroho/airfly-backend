import { PaymentService } from '../services/payment.js';

export class PaymentController {
  static async create(req, res, next) {
    try {
      const snapToken = await PaymentService.create({
        id: req.body.bookingId,
        userId: req.user.id,
      });
      res.status(201).json({
        meta: {
          statusCode: 201,
          message: 'Snap token created successfully',
        },
        data: { snapToken },
      });
    } catch (e) {
      next(e);
    }
  }

  static async handleWebhook(req, res, next) {
    try {
      const { snapToken, paymentStatus, paymentType } = req.body;

      await PaymentService.processWebhook({
        snapToken: snapToken,
        paymentStatus: paymentStatus,
        paymentType: paymentType,
      });

      res.status(200).send('OK');
    } catch (e) {
      next(e);
    }
  }

  static async getAll(req, res, next) {
    try {
      const payment = await PaymentService.getAll(req.query);
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

  static async getByID(req, res, next) {
    try {
      const paymentId = parseInt(req.params.id, 10);

      if (isNaN(paymentId)) {
        throw new ErrorHandler(400, 'Invalid payment ID.');
      }

      const payment = await PaymentService.getByID(paymentId);
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


  static async delete(req, res, next) {
    try {
      await PaymentService.delete(req.params.id);
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