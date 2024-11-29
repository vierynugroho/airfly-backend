import { AirlineService } from '../services/airline.js';
import imagekit from '../config/imagekit.js';

export class AirlineController {
  static async getAll(req, res, next) {
    try {
      // Ambil nilai offset dan limit dari query string
      const { offset = 0, limit = 10 } = req.query;

      // Konversi ke angka
      const pagination = { offset: Number(offset), limit: Number(limit) };

      // Dapatkan data airlines dan total airlines
      const { airlines, totalAirlines } =
        await AirlineService.findMany(pagination);

      // Hitung total halaman dan halaman sebelumnya/berikutnya
      const totalPages = Math.ceil(totalAirlines / limit);
      const currentPage = Math.floor(offset / limit) + 1;
      const nextPage = currentPage < totalPages ? currentPage + 1 : null;
      const prevPage = currentPage > 1 ? currentPage - 1 : null;

      // Kirim response
      res.json({
        meta: {
          statusCode: 200,
          message: 'Airlines fetched successfully',
          pagination: {
            totalAirlines,
            totalPages,
            currentPage,
            nextPage,
            prevPage,
          },
        },
        data: airlines,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { name, imageUrl, imageId } = req.body;
      const newAirline = await AirlineService.create({
        name,
        imageUrl,
        imageId,
      });
      res.json({
        meta: {
          statusCode: 201,
          message: 'Airline created successfully',
        },
        data: newAirline,
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
      const { id } = req.params;
      const { name, imageUrl, imageId } = req.body;
      const updatedAirline = await AirlineService.update(id, {
        name,
        imageUrl,
        imageId,
      });
      if (!updatedAirline) {
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
      const { id } = req.params;
      const deletedAirline = await AirlineService.delete(id);
      if (!deletedAirline) {
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
          message: 'Airline deleted successfully',
        },
        data: deletedAirline,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createWithImage(req, res, next) {
    try {
      const { name } = req.body;
      let imageUrl = '';
      let imageId = '';

      if (req.file) {
        const uploadResponse = await imagekit.upload({
          file: req.file.buffer,
          fileName: req.file.originalname,
          folder: '/airlines',
        });

        imageUrl = uploadResponse.url;
        imageId = uploadResponse.fileId;
      }

      const data = { name, imageUrl, imageId };
      const airline = await AirlineService.create(data);

      return res.json({
        meta: {
          statusCode: 200,
          message: 'Airline created successfully with image',
        },
        data: {
          airline,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateWithImage(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      let imageUrl = '';
      let imageId = '';

      if (req.file) {
        const uploadResponse = await imagekit.upload({
          file: req.file.buffer,
          fileName: req.file.originalname,
          folder: '/airlines',
        });

        imageUrl = uploadResponse.url;
        imageId = uploadResponse.fileId;
      }

      const data = { name, imageUrl, imageId };
      const airline = await AirlineService.update(id, data);

      return res.json({
        meta: {
          statusCode: 200,
          message: 'Airline updated successfully with image',
        },
        data: {
          airline,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
