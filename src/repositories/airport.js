import { prisma } from '../database/db.js';

export class AirportRepository {
  static async create(data) {
    const airport = await prisma.airport.create({
      data,
    });
    return airport;
  }

  static async update(airportID, data) {
    const updatedAirport = await prisma.airport.update({
      where: {
        id: airportID,
      },
      data,
    });
    return updatedAirport;
  }

  static async delete(airportID) {
    const deletedAirport = await prisma.airport.delete({
      where: {
        id: airportID,
      },
    });
    return deletedAirport;
  }

  static async findMany(pagination, filter, sorter) {
    const airports = await prisma.airport.findMany({
      skip: pagination.offset,
      take: pagination.limit,
      where: filter,
      orderBy: sorter,
    });
    return airports;
  }

  static async findByID(airportID) {
    const airport = await prisma.airport.findUnique({
      where: {
        id: airportID,
      },
    });
    return airport;
  }


  static async count(filter) {
    const totalAirports = await prisma.airport.count({
      where: filter,
    });
    return totalAirports;
  }

  static async findByCode(code) {
    const airport = await prisma.airport.findFirst({
      where: {
        code,
      },
    });
    return airport;
  }
}
