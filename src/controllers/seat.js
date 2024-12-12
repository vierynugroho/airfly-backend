import { ErrorHandler } from '../middlewares/error.js';
import { SeatService } from '../services/seat.js';

export class SeatController {
  static async create(req, res, next) {
    try {
      const data = req.body;

      const seat = await SeatService.create(data);

      return res.json({
        meta: {
          statusCode: 200,
          message: 'seat created successfully',
        },
        data: seat,
      });
    } catch (e) {
      next(e);
    }
  }

  static async update(req, res, next) {
    try {
      const data = req.body;
      const seatID = parseInt(req.params.id);

      if (isNaN(seatID)) {
        throw new ErrorHandler(422, 'seat ID is not a number');
      }

      const seat = await SeatService.update(seatID, data);

      return res.json({
        meta: {
          statusCode: 200,
          message: 'seat updated successfully',
        },
        data: seat,
      });
    } catch (e) {
      next(e);
    }
  }

  static async delete(req, res, next) {
    try {
      const seatID = parseInt(req.params.id);

      if (isNaN(seatID)) {
        throw new ErrorHandler(422, 'seat ID is not a number');
      }

      const seat = await SeatService.delete(seatID);

      return res.json({
        meta: {
          statusCode: 200,
          message: 'seat deleted successfully',
        },
        data: seat,
      });
    } catch (e) {
      next(e);
    }
  }

  static async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || null;
      const { flightId } = req.query;

      const { seatClass, departureTime, arrivalTime, seatStatus } = req.query;

      let condition = {};
      const pagination = {};

      if (page && limit) {
        pagination.offset = (page - 1) * limit;
        pagination.limit = limit;
      }

      if (flightId) {
        condition.flightId = parseInt(flightId);
      }

      if (departureTime) {
        condition.departureTime = new Date(departureTime);
      }

      if (arrivalTime) {
        condition.arrivalTime = new Date(arrivalTime);
      }

      if (seatStatus) {
        condition.status = seatStatus;
      }

      if (seatClass) {
        condition.class = seatClass.toUpperCase() || {};
      }

      const { seats, totalSeats } = await SeatService.findMany(
        pagination,
        condition
      );

      res.json({
        meta: {
          statusCode: 200,
          message: 'seats data retrieved successfully',
          pagination:
            page && limit
              ? {
                  totalPage: Math.ceil(totalSeats / limit),
                  currentPage: page,
                  pageItems: seats.length,
                  nextPage:
                    page < Math.ceil(totalSeats / limit) ? page + 1 : null,
                  prevPage: page > 1 ? page - 1 : null,
                }
              : null,
        },
        data: seats,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByID(req, res, next) {
    try {
      const seatID = parseInt(req.params.id);

      if (isNaN(seatID)) {
        throw new ErrorHandler(422, 'seat ID is not a number');
      }

      const seat = await SeatService.findById(seatID);

      res.json({
        meta: {
          statusCode: 200,
          message: 'seat data retrieved successfully',
        },
        data: seat,
      });
    } catch (error) {
      next(error);
    }
  }
}
