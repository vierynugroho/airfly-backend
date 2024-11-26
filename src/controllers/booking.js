import { BookingService } from '../services/booking.js';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function createBooking(req, res, next) {
  try {
    await BookingService.createBooking({
      ...req.body,
      userId: req.user.id,
    });

    return res.json({
      meta: {
        statusCode: 201,
        message: 'booking created',
      },
    });
  } catch (err) {
    next(err);
  }
}
