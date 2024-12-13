import { BookingService } from '../services/booking.js';

export class BookingController {
  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async createBooking(req, res, next) {
    try {
      const bookingId = await BookingService.createBooking({
        ...req.body,
        userId: req.user.id,
      });

      return res.json({
        meta: {
          statusCode: 201,
          message: 'booking created',
        },
        data: {
          bookingId,
        },
      });
    } catch (err) {
      next(err);
    }
  }
  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || null;
      const sort = req.query.sort?.toLowerCase() || null;
      const userId = req.user.id;

      const { bookings, totalBooking } = await BookingService.findBooking({
        page,
        limit,
        sort,
        userId,
      });

      return res.json({
        meta: {
          status: 200,
          message: 'success',
          pagination:
            page && limit
              ? {
                  totalPage: Math.ceil(totalBooking / limit),
                  currentPage: page,
                  pageItems: bookings.length,
                  nextPage:
                    page < Math.ceil(totalBooking / limit) ? page + 1 : null,
                  prevPage: page > 1 ? page - 1 : null,
                }
              : null,
        },
        data: bookings,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const booking = await BookingService.findById(parseInt(id));

      return res.json({
        meta: {
          status: 200,
          message: 'successs',
        },
        data: booking ? booking : [],
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getGroupedBy(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || null;
      const sort = req.query.sort?.toLowerCase() || null;
      const userId = req.user.id;

      const { groupedBookings, totalBooking, totalItems } =
        await BookingService.findGrouped({
          page,
          limit,
          sort,
          userId,
        });

      return res.json({
        meta: {
          status: 200,
          message: 'success',
          pagination:
            page && limit
              ? {
                  totalPage: Math.ceil(totalBooking / limit),
                  currentPage: page,
                  pageItems: totalItems,
                  nextPage:
                    page < Math.ceil(totalBooking / limit) ? page + 1 : null,
                  prevPage: page > 1 ? page - 1 : null,
                }
              : null,
        },
        data: groupedBookings,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getByCode(req, res, next) {
    try {
      const { code } = req.params;
      const booking = await BookingService.findByCode(code);

      return res.json({
        meta: {
          status: 200,
          message: 'successs',
        },
        data: booking ? booking : [],
      });
    } catch (err) {
      next(err);
    }
  }
}
