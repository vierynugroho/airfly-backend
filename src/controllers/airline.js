import { ErrorHandler } from '../middlewares/error.js';
import { AirlineService } from '../services/airline.js';

export class AirlineController {
  static async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || null;
      const pagination = {};

      if (page && limit) {
        pagination.offset = (page - 1) * limit;
        pagination.limit = limit;
      }

      const { airlines, totalAirlines } =
        await AirlineService.findMany(pagination);

      res.json({
        meta: {
          statusCode: 200,
          message: 'Airlines fetched successfully',
          pagination:
            page && limit
              ? {
                  totalPage: Math.ceil(totalAirlines / limit),
                  currentPage: page,
                  pageItems: airlines.length,
                  nextPage:
                    page < Math.ceil(totalAirlines / limit) ? page + 1 : null,
                  prevPage: page > 1 ? page - 1 : null,
                }
              : null,
        },
        data: airlines,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const data = req.body;
      const files = req.files;

      const airline = await AirlineService.create(files, data);

      res.json({
        meta: {
          statusCode: 201,
          message: 'Airline created successfully',
        },
        data: airline,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByID(req, res, next) {
    try {
      const { id } = req.params;
      const airline = await AirlineService.findByID(id);
      if (!airline) {
        return res.status(404).json({
          meta: {
            statusCode: 404,
            message: 'Airline not found',
          },
        });
      }
      res.json({
        meta: {
          statusCode: 200,
          message: 'Airline fetched successfully',
        },
        data: airline,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const data = req.body;
      const files = req.files;
      const airlineID = parseInt(req.params.id);

      if (isNaN(airlineID)) {
        throw new ErrorHandler(422, 'airline ID is not a number');
      }

      const updatedAirline = await AirlineService.update(
        airlineID,
        files,
        data
      );

      res.json({
        meta: {
          statusCode: 200,
          message: 'Airline updated successfully',
        },
        data: updatedAirline,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const airlineID = parseInt(req.params.id);

      if (isNaN(airlineID)) {
        throw new ErrorHandler(422, 'airline ID is not a number');
      }

      const deletedAirline = await AirlineService.delete(airlineID);

      res.json({
        meta: {
          statusCode: 200,
          message: 'Airline deleted successfully',
        },
        data: deletedAirline,
      });
    } catch (error) {
      next(error);
    }
  }
}
