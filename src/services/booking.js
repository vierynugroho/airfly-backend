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

    if (booking.flightId == booking.returnFlightId) {
      throw new ErrorHandler(400, "flightId and returnFlightId can't be same");
    }

    const seatsId = [];
    for (let i = 0; i < booking.bookingDetail.length; i++) {
      seatsId.push(booking.bookingDetail[i].seatId);
    }

    let flightId = [];

    if (booking.returnFlightId && booking.returnFlightId != booking.flightId) {
      flightId = [booking.flightId, booking.returnFlightId];
    } else {
      flightId = [booking.flightId];
    }

    await BookingRepository.isSeatAvailable(flightId, seatsId);

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

  /**
   * @typedef CriteriaBooking
   * @property { number } page
   * @property { number } limit
   * @property { number } id
   * @property { number } userId
   * @property { string } sort
   *
   * @param {CriteriaBooking} criteria
   */
  static async findBooking(criteria) {
    const condition = {};
    const pagination = {};
    const orderBy = {};

    if (criteria.page && criteria.limit) {
      pagination.offset = (criteria.page - 1) * criteria.limit;
      pagination.limit = criteria.limit;
    }

    if (criteria.sort) {
      orderBy.bookingDate = criteria.sort == 'asc' ? 'asc' : 'desc';
    }

    condition.userId = criteria.userId;

    const bookings = await BookingRepository.findBooking(
      condition,
      pagination,
      orderBy
    );
    const totalBooking = await BookingRepository.totalBooking(
      condition,
      orderBy
    );

    return { bookings, totalBooking };
  }

  static async findById(id) {
    return await BookingRepository.findById(id);
  }

  static async findGrouped(criteria) {
    const { bookings, totalBooking } = await this.findBooking(criteria);

    const bulanMap = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];

    const groupedBookings = {};

    bookings.forEach((booking) => {
      const date = new Date(booking.bookingDate);
      const month = bulanMap[date.getMonth()];

      if (!groupedBookings[month]) {
        groupedBookings[month] = [];
      }

      groupedBookings[month].push(booking);
    });

    return { groupedBookings, totalBooking, totalItems: bookings.length };
  }
}
