import { ErrorHandler } from '../middlewares/error.js';
import { TicketService } from '../services/ticket.js';

export class TicketController {
  static async create(req, res, next) {
    try {
      const bookingID = parseInt(req.params.bookingID);

      if (isNaN(bookingID)) {
        throw new ErrorHandler(400, 'invalid booking ID value');
      }

      const QRTickets = await TicketService.create(bookingID);

      return res.json({
        meta: {
          statusCode: 200,
          message: 'QR Ticket generated successfully',
        },
        data: QRTickets,
      });
    } catch (e) {
      next(e);
    }
  }

  static async validate(req, res, next) {
    try {
      const QRCodeData = req.body;

      const QRTickets = await TicketService.validate(QRCodeData);

      return res.json({
        meta: {
          statusCode: 200,
          message: 'QR Ticket validate successfully',
        },
        data: QRTickets,
      });
    } catch (e) {
      next(e);
    }
  }
}
