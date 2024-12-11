import { prisma } from '../database/db.js';

export class TicketRepository {
  static async findMany(userID, pagination) {
    const bookingDetail = await prisma.bookingDetail.findMany({
      skip: pagination.offset,
      take: pagination.limit,
      where: {
        booking: {
          userId: userID,
        },
      },
    });

    return bookingDetail;
  }

  static async findBoking(bookingID) {
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingID,
        payment: {
          paymentStatus: 'PAID',
        },
      },
      include: {
        bookingDetail: {
          where: {
            id: bookingID,
          },
          include: {
            passenger: true,
            seat: true,
          },
        },
        payment: true,
        flight: {
          include: {
            airline: true,
            departure: true,
            arrival: true,
          },
        },
        returnFlight: {
          include: {
            airline: true,
            departure: true,
            arrival: true,
          },
        },
      },
    });

    return booking;
  }

  static async updateQRCode(bookingID, detailBookingID, qrCodeImage) {
    const generate = await prisma.bookingDetail.update({
      where: {
        bookingId: bookingID,
        id: detailBookingID,
      },
      data: {
        qrCodeImage,
      },
      select: {
        passenger: {
          select: {
            name: true,
            familyName: true,
            type: true,
          },
        },
        booking: {
          include: {
            flight: {
              include: {
                airline: true,
                departure: true,
                arrival: true,
              },
            },
            returnFlight: {
              include: {
                airline: true,
                departure: true,
                arrival: true,
              },
            },
          },
        },
        qrCodeImage: true,
      },
    });

    return generate;
  }

  static async validateQRCode(QRToken, bookingID, detailBookingID) {
    const booking = await prisma.bookingDetail.findUnique({
      where: {
        id: detailBookingID,
        bookingId: bookingID,
        qrToken: QRToken,
      },
      include: {
        booking: true,
        passenger: true,
        seat: true,
      },
    });

    return booking;
  }
}
