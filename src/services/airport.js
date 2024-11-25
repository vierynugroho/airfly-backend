import { ErrorHandler } from '../middlewares/error.js';
import { AirportRepository } from '../repositories/airport.js';

export class AirportService {
  static async create(data) {
    const existingAirport = await AirportRepository.findByCode(data.code);

    if (existingAirport) {
      throw new ErrorHandler(409, 'Airport code already exists');
    }

    const createdAirport = await AirportRepository.create(data);

    return createdAirport;
  }

  static async update(id, data) {
    const airport = await AirportRepository.findByID(id);

    if (!airport) {
      throw new ErrorHandler(404, 'Airport not found');
    }

    const updatedAirport = await AirportRepository.update(id, data);

    return updatedAirport;
  }

  static async delete(id) {
    const airport = await AirportRepository.findByID(id);

    if (!airport) {
      throw new ErrorHandler(404, 'Airport not found');
    }

    const deletedAirport = await AirportRepository.delete(id);

    return deletedAirport;
  }

  static async findMany(pagination, filter, sorter) {
    const airports = await AirportRepository.findMany(pagination, filter, sorter);
    const totalAirports = await AirportRepository.count(filter);

    return { airports, totalAirports };
  }

  static async findByID(id) {
    const airport = await AirportRepository.findByID(id);

    if (!airport) {
      throw new ErrorHandler(404, 'Airport not found');
    }

    return airport;
  }

  static async findByCode(code) {
    const airport = await AirportRepository.findByCode(code);

    if (!airport) {
      throw new ErrorHandler(404, 'Airport not found');
    }

    return airport;
  }
}
