import { ErrorHandler } from '../middlewares/error.js';
import { FlightService } from '../services/flight.js';

export class FlightController {
  static async getAll(req, res, next) {
    //TODO: filtering & Sorting
    /*
    1. Harga Termurah
    2. Durasi Terpendek
    3. Keberangkatan - paling awal
    4. Keberangkatan - paling akhir
    5. kedatangan - paling awal
    6. kedatangan - paling akhir
    7. Class

    TODO: fix
    1. not found relation (on create and update): airport, flight, airline | butuh repository airline sama airport
    2. class filtering invalid enum value ✅
    */

    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || null;
      const isCheapest = req.query.isCheapest || 'false';
      const { priceMin, priceMax, flightId, seatClass } = req.query;

      let sort = {};
      let condition = {};
      const pagination = {};

      if (page && limit) {
        pagination.offset = (page - 1) * limit;
        pagination.limit = limit;
      }

      if (isCheapest) {
        sort = { price: 'asc' };
      }

      if (priceMin) {
        condition.price = condition.price || {};
        condition.price.gte = parseFloat(priceMin);
      }

      if (seatClass) {
        condition.class = seatClass.toUpperCase() || {};
      }

      if (priceMax) {
        condition.price = condition.price || {};
        condition.price.lte = parseFloat(priceMax);
      }

      if (flightId) {
        condition.flightId = parseInt(flightId);
      }

      const { seats, totalSeats } = await SeatService.findMany(
        pagination,
        condition,
        sort
      );

      res.json({
        meta: {
          statusCode: 200,
          message: 'flights data retrieved successfully',
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
      const flightID = parseInt(req.params.id);

      if (isNaN(flightID)) {
        throw new ErrorHandler(422, 'flight ID is not a number');
      }

      const flight = await FlightService.getByID(flightID);

      res.json({
        meta: {
          statusCode: 200,
          message: 'fligt data retrieved successfully',
        },
        data: flight,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const data = req.body;

      const flight = await FlightService.create(data);

      return res.json({
        meta: {
          statusCode: 200,
          message: 'flight created successfully',
        },
        data: {
          flight,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  static async update(req, res, next) {
    try {
      const data = req.body;
      const flightID = parseInt(req.params.id);

      if (isNaN(flightID)) {
        throw new ErrorHandler(422, 'flight ID is not a number');
      }

      const flight = await FlightService.update(flightID, data);

      return res.json({
        meta: {
          statusCode: 200,
          message: 'flight updated successfully',
        },
        data: {
          flight,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  static async delete(req, res, next) {
    try {
      const flightID = parseInt(req.params.id);

      if (isNaN(flightID)) {
        throw new ErrorHandler(422, 'flight ID is not a number');
      }

      const flight = await FlightService.delete(flightID);

      return res.json({
        meta: {
          statusCode: 200,
          message: 'flight deleted successfully',
        },
        data: {
          flight,
        },
      });
    } catch (e) {
      next(e);
    }
  }
}
