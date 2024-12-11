import { ErrorHandler } from '../middlewares/error.js';
import { FlightService } from '../services/flight.js';

export class FlightController {
  static async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || null;

      const departureTime = req.query.departureTime;
      const returnTime = req.query.returnTime;
      const departureAirport = req.query.departureAirport
        ? parseInt(req.query.departureAirport)
        : null;
      const arrivalAirport = req.query.arrivalAirport
        ? parseInt(req.query.arrivalAirport)
        : null;

      if (isNaN(departureAirport) || isNaN(arrivalAirport)) {
        throw new ErrorHandler(
          422,
          'invalid value for departure airport or arrival airport'
        );
      }

      const isCheapest = req.query.isCheapest || 'false';
      const shortest = req.query.shortest || 'false';
      const earliestDeparture = req.query.earliestDeparture || 'false';
      const latestDeparture = req.query.latestDeparture || 'false';
      const earliestArrival = req.query.earliestArrival || 'false';
      const latestArrival = req.query.latestArrival || 'false';

      const { priceMin, priceMax, flightNumber, seatClass, state } = req.query;

      let sort = {};
      let condition = {};
      let duration = {};
      const pagination = {};

      if (page && limit) {
        pagination.offset = (page - 1) * limit;
        pagination.limit = limit;
      }

      if (isCheapest === 'true') {
        sort = { price: 'asc' };
      }
      if (shortest === 'true') {
        duration = { sort: 'asc' };
      }
      if (earliestDeparture === 'true') {
        sort = { departureTime: 'asc' };
      }
      if (latestDeparture === 'true') {
        sort = { departureTime: 'desc' };
      }
      if (earliestArrival === 'true') {
        sort = { arrivalTime: 'asc' };
      }
      if (latestArrival === 'true') {
        sort = { arrivalTime: 'desc' };
      }
      if (priceMin) {
        condition.price = condition.price || {};
        condition.price.gte = parseFloat(priceMin);
      }
      if (departureTime) {
        condition.departureTime = {
          gte: new Date(departureTime),
        };
      }
      if (returnTime) {
        condition.departureTime = {
          gte: new Date(returnTime),
        };
      }
      if (departureAirport) {
        condition.departureAirport = departureAirport;
      }
      if (arrivalAirport) {
        condition.arrivalAirport = arrivalAirport;
      }
      if (seatClass) {
        condition.class = seatClass.toUpperCase() || {};
      }
      if (state) {
        condition.arrival = {
          state: {
            contains: state,
            mode: 'insensitive',
          },
        };
      }
      if (priceMax) {
        condition.price = condition.price || {};
        condition.price.lte = parseFloat(priceMax);
      }
      if (flightNumber) {
        condition.flightNumber = flightNumber;
      }

      const { flights, totalFlights } = await FlightService.getAll(
        pagination,
        condition,
        sort,
        duration
      );

      res.json({
        meta: {
          statusCode: 200,
          message: 'flights data retrieved successfully',
          pagination:
            page && limit
              ? {
                  totalPage: Math.ceil(totalFlights / limit),
                  currentPage: page,
                  pageItems: flights.length,
                  nextPage:
                    page < Math.ceil(totalFlights / limit) ? page + 1 : null,
                  prevPage: page > 1 ? page - 1 : null,
                }
              : null,
        },
        data: flights,
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
