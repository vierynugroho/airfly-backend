import { ErrorHandler } from '../middlewares/error.js';
import { AirportRepository } from '../repositories/airport.js';
import { UploadService } from './upload.js';

export class AirportService {
  static async create(files, data) {
    let fileUploaded = null;

    if (!('image' in files)) {
      throw new ErrorHandler(400, 'no file selected');
    }

    const existingAirport = await AirportRepository.findByCode(data.code);

    if (existingAirport) {
      throw new ErrorHandler(409, 'Airport code already exists');
    }

    fileUploaded = await UploadService.upload(files, 'airports', ['airport']);

    data.imageUrl = fileUploaded.image.url;
    data.imageId = fileUploaded.image.fileId;

    const createdAirport = await AirportRepository.create(data);

    return createdAirport;
  }

  static async update(airportID, files, data) {
    let fileUploaded = null;
    const airport = await AirportRepository.findByID(airportID);

    if (!airport) {
      throw new ErrorHandler(404, 'Airport not found');
    }

    if ('image' in files) {
      await UploadService.delete(airport.imageId);
      fileUploaded = await UploadService.upload(files, 'airports', ['airport']);

      data.imageUrl = fileUploaded.image.url;
      data.imageId = fileUploaded.image.fileId;
    }

    const updatedAirport = await AirportRepository.update(airportID, data);

    return updatedAirport;
  }

  static async delete(airportID) {
    const airport = await AirportRepository.findByID(airportID);

    if (!airport) {
      throw new ErrorHandler(404, 'Airport not found');
    }

    const deletedAirport = await AirportRepository.delete(airportID);

    return deletedAirport;
  }

  static async findMany(pagination, filter, sorter) {
    const airports = await AirportRepository.findMany(
      pagination,
      filter,
      sorter
    );
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
