import { ErrorHandler } from '../middlewares/error.js';
import { AirlineRepository } from '../repositories/airline.js';

export class AirlineService {
  static async findAll() {
    const airlines = await AirlineRepository.findMany();
    return airlines;
  }

  static async create(data) {
    const existingAirline = await AirlineRepository.findByName(data.name);

    if (existingAirline) {
      throw new ErrorHandler(409, 'Airline name already exists');
    }

    const createdAirline = await AirlineRepository.create(data);
    return createdAirline;
  }

  static async update(id, data) {
    const airlineId = parseInt(id, 10);
    if (isNaN(airlineId)) {
      throw new ErrorHandler(400, 'Invalid ID format');
    }

    const airline = await AirlineRepository.findByID(airlineId);
    if (!airline) {
      throw new ErrorHandler(404, 'Airline not found');
    }

    // Hapus gambar lama jika ada gambar baru diunggah
    if (data.imageUrl && data.imageUrl !== airline.imageUrl) {
      try {
        if (airline.imageKitId) {
          console.log(`Deleting old image: ${airline.imageKitId}`);
          await AirlineRepository.deleteImage(airline.imageKitId);
        }
      } catch (err) {
        console.error(
          `Failed to delete old image for airline ID ${airlineId}:`,
          err.message
        );
        throw new ErrorHandler(
          500,
          `Failed to delete old image: ${err.message}`
        );
      }
    }

    const updatedAirline = await AirlineRepository.update(airlineId, data);
    return updatedAirline;
  }

  static async delete(id) {
    const airlineId = parseInt(id, 10);
    if (isNaN(airlineId)) {
      throw new ErrorHandler(400, 'Invalid ID format');
    }

    const airline = await AirlineRepository.findByID(airlineId);
    if (!airline) {
      throw new ErrorHandler(404, 'Airline not found');
    }

    if (airline.imageKitId) {
      try {
        await AirlineRepository.deleteImage(airline.imageKitId);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        throw new ErrorHandler(500, 'Failed to delete associated image');
      }
    }

    const deletedAirline = await AirlineRepository.delete(airlineId);
    return deletedAirline;
  }

  static async findMany(pagination, filter, sorter) {
    const airlines = await AirlineRepository.findMany(
      pagination,
      filter,
      sorter
    );
    const totalAirlines = await AirlineRepository.count(filter);

    return { airlines, totalAirlines };
  }

  static async findByID(id) {
    const airlineId = parseInt(id, 10);
    if (isNaN(airlineId)) {
      throw new ErrorHandler(400, 'Invalid ID format');
    }

    const airline = await AirlineRepository.findByID(airlineId);

    if (!airline) {
      throw new ErrorHandler(404, 'Airline not found');
    }

    return airline;
  }

  static async findByName(name) {
    const airline = await AirlineRepository.findByName(name);

    if (!airline) {
      throw new ErrorHandler(404, 'Airline not found');
    }

    return airline;
  }
}
