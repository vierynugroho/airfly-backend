import { SeatStatus } from '@prisma/client';
import { prisma } from '../database/db.js';
import { ErrorHandler } from '../middlewares/error.js';

export class BookingRepository {
  /**
   * @typedef Booking
   * @property { number } userId
   * @property { number } flightId
   * @property { number } returnFlightId
   * @property { string } bookingDate
   * @property { number } totalPrice
   *
   * @param {Booking} booking
   */

  static async createBooking(booking) {
    return await prisma.booking.create({
      data: {
        userId: booking.userId,
        flightId: booking.flightId,
        returnFlightId: booking.returnFlightId || null,
        bookingDate: booking.bookingDate,
        totalPrice: booking.totalPrice,
      },
    });
  }

  static async createPassengers(data) {
    await prisma.$transaction([
      ...data.map((v) => prisma.passenger.create({ data: v })),
    ]);
  }

  static async isSeatAvailable(flightId, seatsId) {
    const seats = await prisma.seat.findMany({
      where: {
        id: {
          in: seatsId,
        },
        flightId: {
          in: flightId,
        },
        status: SeatStatus.AVAILABLE,
      },
    });

    if (seats.length != seatsId) {
      throw new ErrorHandler(404, 'Seats not available');
    }
  }

  static async setSeatStatus(seatsId, status) {
    await prisma.seat.updateMany({
      where: {
        id: {
          in: seatsId,
        },
      },
      data: {
        status,
      },
    });
  }
}
