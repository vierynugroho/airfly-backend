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

  static async updateQRCode(bookingID, detailBookingID, qrCodeImage, qrToken) {
    const generate = await prisma.bookingDetail.update({
      where: {
        bookingId: bookingID,
        id: detailBookingID,
      },
      data: {
        qrCodeImage,
        qrToken,
      },
      select: {
        passenger: {
          select: {
            name: true,
            familyName: true,
            type: true,
          },
        },
        qrCodeImage: true,
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
      },
    });

    return generate;
  }

  static async validateQRCode(bookingID, bookingDetailID, QRToken) {
    const booking = await prisma.bookingDetail.findUnique({
      where: {
        bookingId: bookingID,
        id: bookingDetailID,
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
