import { TicketRepository } from '../repositories/ticket.js';
import { ErrorHandler } from '../middlewares/error.js';
import * as QRCode from 'qrcode';

export class TicketService {
  static async generateQR(ticketData) {
    try {
      const qrCodeString = JSON.stringify(ticketData);
      const qrCodeImage = await QRCode.toDataURL(qrCodeString);
      return qrCodeImage;
    } catch (error) {
      throw new Error(`Failed to generate QR Code: ${error.message}`);
    }
  }

  static async create(bookingID) {
    const booking = await TicketRepository.findBoking(bookingID);

    if (!booking) {
      throw new ErrorHandler(
        400,
        'flight ticket data not found or payment not yet paid'
      );
    }

    const bookingDetailData = booking.bookingDetail;

    const createQRTicket = await Promise.all(
      bookingDetailData.map(async (bookingData) => {
        const QRData = {
          bookingID: booking.id,
          flightID: booking.flightId,
          returnFlightId: booking.returnFlightId,
          bookingDate: booking.bookingDate,
          bookingCode: booking.code,
          passengerId: bookingData.passengerId,
          seatId: bookingData.seatId,
          uniqueToken: crypto.randomUUID(),
        };

        const QR = await this.generateQR(QRData);

        const updateDetailBooking = await TicketRepository.updateQRCode(
          bookingID,
          bookingData.id,
          QR
        );

        return updateDetailBooking;
      })
    );

    console.log(createQRTicket);
    return createQRTicket;
  }

  static async validate(QRCodeData) {
    const ticket = await TicketRepository.findBoking(
      QRCodeData.QRCodeData.bookingID
    );

    if (!ticket) {
      throw new ErrorHandler(400, 'invalid ticket');
    }

    return ticket;
  }
}
