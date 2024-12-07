//import { storagetransfer_v1 } from 'googleapis';
import { ErrorHandler } from '../middlewares/error.js';
import { AirportService } from '../services/airport.js';

export class AirportController {
  static async create(req, res, next) {
    try {
      const data = req.body;
      const files = req.files;

      const airport = await AirportService.create(files, data);

      return res.json({
        meta: {
          statusCode: 200,
          message: 'Airport created successfully',
        },
        data: {
          airport,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  static async update(req, res, next) {
    try {
      const data = req.body;
      const files = req.files;
      const airportID = parseInt(req.params.id);

      if (isNaN(airportID)) {
        throw new ErrorHandler(422, 'Airport ID is not a number');
      }

      const airport = await AirportService.update(airportID, files, data);

      return res.json({
        meta: {
          statusCode: 200,
          message: 'Airport updated successfully',
        },
        data: {
          airport,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  static async delete(req, res, next) {
    try {
      const airportID = parseInt(req.params.id);

      if (isNaN(airportID)) {
        throw new ErrorHandler(422, 'Airport ID is not a number');
      }

      const airport = await AirportService.delete(airportID);

      return res.json({
        meta: {
          statusCode: 200,
          message: 'Airport deleted successfully',
        },
        data: {
          airport,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  static async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || null;
      const { name, city, country, state, sortBy, order } = req.query;

      const condition = {};
      const pagination = {};
      const sorter = {};

      const validSortFields = ['name', 'city', 'state', 'country', 'createdAt'];
      const validOrders = ['asc', 'desc'];

      if (sortBy && validSortFields.includes(sortBy)) {
        sorter[sortBy] = validOrders.includes(order?.toLowerCase())
          ? order.toLowerCase()
          : 'asc';
      } else {
        sorter.createdAt = 'desc';
      }

      if (page && limit) {
        pagination.offset = (page - 1) * limit;
        pagination.limit = limit;
      }

      if (name) condition.name = { contains: name, mode: 'insensitive' };
      if (city) condition.city = { contains: city, mode: 'insensitive' };
      if (state) condition.state = { contains: state, mode: 'insensitive' };
      if (country)
        condition.country = { contains: country, mode: 'insensitive' };

      const { airports, totalAirports } = await AirportService.findMany(
        pagination,
        condition,
        sorter
      );

      res.json({
        meta: {
          statusCode: 200,
          message: 'Airports data retrieved successfully',
          pagination:
            page && limit
              ? {
                  totalPage: Math.ceil(totalAirports / limit),
                  currentPage: page,
                  pageItems: airports.length,
                  nextPage:
                    page < Math.ceil(totalAirports / limit) ? page + 1 : null,
                  prevPage: page > 1 ? page - 1 : null,
                }
              : null,
        },
        data: airports,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByID(req, res, next) {
    try {
      const airportID = parseInt(req.params.id);

      if (isNaN(airportID)) {
        throw new ErrorHandler(422, 'Airport ID is not a number');
      }

      const airport = await AirportService.findByID(airportID);

      res.json({
        meta: {
          statusCode: 200,
          message: 'Airport data retrieved successfully',
        },
        data: airport,
      });
    } catch (error) {
      next(error);
    }
  }
}
