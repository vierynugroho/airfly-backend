import { SeatStatus } from '@prisma/client';
import { ErrorHandler } from '../middlewares/error.js';
import { BookingRepository } from '../repositories/booking.js';

/**
 * @typedef Booking
 * @property { number } userId
 * @property { number } flightId
 * @property { number } returnFlightId
 * @property { string } bookingDate
 * @property { BookingDetail[] } bookingDetail
 *
 * @typedef Passenger
 * @property { string } name
 * @property { string } familyName
 * @property { "MALE" | "FEMALE" } gender
 * @property { string } identityNumber
 * @property { string } citizenship
 * @property { string } countryOfIssue
 * @property { "Mr" | "Mrs" } title
 * @property { string } dob
 * @property { string } expiredDate
 * @property { "BABY" | "CHILD" | "ADULT" } type
 *
 * @typedef BookingDetail
 * @property { number } seatId
 * @property { Passenger } passenger
 * @property { number } price
 * @property { number? } bookingId
 */

export class BookingService {
  /**
   *
   * @param {Booking} booking
   */
  static async createBooking(booking) {
    if (booking.bookingDetail.length == 0) {
      throw new ErrorHandler(
        400,
        'booking request at least have one passenger'
      );
    }

    const seatsId = [];
    for (let i = 0; i < booking.bookingDetail.length; i++) {
      seatsId.push(booking.bookingDetail[i].seatId);
    }

    await BookingRepository.isSeatAvailable(booking.flightId, seatsId);

    const created = new Date().toISOString();
    let totalPrice = 0;

    for (let i = 0; i < booking.bookingDetail.length; i++) {
      totalPrice += booking.bookingDetail[i].price;
    }

    const bookingCreated = await BookingRepository.createBooking({
      userId: booking.userId,
      flightId: booking.flightId,
      returnFlightId: booking.returnFlightId,
      bookingDate: created,
      totalPrice,
    });

    const payload = [];

    for (let i = 0; i < booking.bookingDetail.length; i++) {
      payload.push({
        ...booking.bookingDetail[i].passenger,
        bookingDetail: {
          create: {
            bookingId: bookingCreated.id,
            seatId: booking.bookingDetail[i].seatId,
            price: booking.bookingDetail[i].price,
          },
        },
      });
    }

    await BookingRepository.createPassengers(payload);
    await BookingRepository.setSeatStatus(seatsId, SeatStatus.LOCKED);
  }
}
