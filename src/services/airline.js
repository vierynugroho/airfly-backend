import { ErrorHandler } from '../middlewares/error.js';
import { AirlineRepository } from '../repositories/airline.js';
import { UploadService } from './upload.js';

export class AirlineService {
  static async findAll() {
    const airlines = await AirlineRepository.findMany();
    return airlines;
  }

  static async create(files, data) {
    let fileUploaded = null;

    if (!('image' in files)) {
      throw new ErrorHandler(400, 'no file selected');
    }

    const existingAirline = await AirlineRepository.findByName(data.name);

    if (existingAirline) {
      throw new ErrorHandler(409, 'Airline name already exists');
    }

    fileUploaded = await UploadService.upload(files, 'airlines', ['airline']);

    /*
    console.log(fileUploaded);
    {
      image: {
        fileId: '674be24ce375273f60c4b254',
        name: 'image-1733026377745_gR9y6Ro7F.jpg',
        size: 9170,
        versionInfo: { id: '674be24ce375273f60c4b254', name: 'Version 1' },
        filePath: '/airlines/image-1733026377745_gR9y6Ro7F.jpg',
        url: 'https://ik.imagekit.io/vieryn/airlines/image-1733026377745_gR9y6Ro7F.jpg',
        fileType: 'image',
        height: 612,
        width: 612,
        thumbnailUrl: 'https://ik.imagekit.io/vieryn/tr:n-ik_ml_thumbnail/airlines/image-1733026377745_gR9y6Ro7F.jpg',
        AITags: null
      }
    }
    */

    data.imageUrl = fileUploaded.image.url;
    data.imageId = fileUploaded.image.fileId;

    const createdAirline = await AirlineRepository.create(data);

    return createdAirline;
  }

  static async update(airlineID, files, data) {
    let fileUploaded = null;
    const airline = await AirlineRepository.findByID(airlineID);

    if (!airline) {
      throw new ErrorHandler(404, 'Airline not found');
    }

    const existingAirline = await AirlineRepository.findByName(data.name);

    if (existingAirline && existingAirline.id !== airline.id) {
      throw new ErrorHandler(409, 'Airline name already exists');
    }

    if ('image' in files) {
      await UploadService.delete(airline.imageId);
      fileUploaded = await UploadService.upload(files, 'airlines', ['airline']);

      data.imageUrl = fileUploaded.image.url;
      data.imageId = fileUploaded.image.fileId;
    }

    const updatedAirline = await AirlineRepository.update(airlineID, data);

    return updatedAirline;
  }

  static async delete(airlineID) {
    const airline = await AirlineRepository.findByID(airlineID);

    if (!airline) {
      throw new ErrorHandler(404, 'Airline not found');
    }

    if (airline.id !== '') {
      await UploadService.delete(airline.imageId);
    }

    const deletedAirline = await AirlineRepository.delete(airlineID);

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
