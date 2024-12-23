import { SeatStatus } from '@prisma/client';
import { prisma } from '../database/db.js';
import { ErrorHandler } from '../middlewares/error.js';
import { generateCode } from '../utils/generateCode.js';

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
        code: generateCode(),
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
    if (flightId.length == 2) {
      const departureSeats = await prisma.seat.count({
        where: {
          id: {
            in: seatsId,
          },
          flightId: flightId[0],
          status: SeatStatus.AVAILABLE,
        },
      });

      const arrivalSeats = await prisma.seat.count({
        where: {
          id: {
            in: seatsId,
          },
          flightId: flightId[1],
          status: SeatStatus.AVAILABLE,
        },
      });

      if (departureSeats + arrivalSeats != seatsId.length) {
        throw new ErrorHandler(404, 'Seats not available');
      }
    } else {
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

      if (seats.length != seatsId.length) {
        throw new ErrorHandler(404, 'Seats not available');
      }
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

  static async getBooking(bookingID) {
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingID,
      },
      include: {
        bookingDetail: {
          select: {
            seatId: true,
          },
        },
      },
    });

    return booking;
  }

  static async updateSeatStatusOnPayment(seatIds, seatStatus) {
    try {
      const update = await prisma.seat.updateMany({
        where: { id: { in: seatIds } },
        data: { status: seatStatus },
      });

      return update;
    } catch (error) {
      console.error('Error updating seat status on payment:', error);
      throw Error(error.message);
    }
  }

  static async findBooking(condition, pagination, orderBy) {
    return await prisma.booking.findMany({
      where: condition,
      orderBy,
      include: {
        flight: {
          include: {
            departure: true,
            arrival: true,
          },
        },
        payment: true,
        returnFlight: {
          include: {
            departure: true,
            arrival: true,
          },
        },
      },
      skip: pagination.offset,
      take: pagination.limit,
    });
  }

  static async totalBooking(condition, orderBy) {
    return await prisma.booking.count({
      where: condition,
      orderBy,
    });
  }

  static async findById(id) {
    return await prisma.booking.findFirst({
      where: {
        id,
      },
      include: {
        bookingDetail: {
          include: {
            passenger: true,
            seat: true,
          },
        },
        flight: {
          include: {
            departure: true,
            arrival: true,
            airline: true,
          },
        },
        returnFlight: {
          include: {
            departure: true,
            arrival: true,
            airline: true,
          },
        },
      },
    });
  }

  static async findByCode(code) {
    return await prisma.booking.findFirst({
      where: {
        code,
      },
      include: {
        bookingDetail: {
          include: {
            passenger: true,
            seat: true,
          },
        },
        flight: {
          include: {
            departure: true,
            arrival: true,
          },
        },
        returnFlight: {
          include: {
            departure: true,
            arrival: true,
          },
        },
      },
    });
  }
}
