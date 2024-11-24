import { prisma } from '../database/db.js';

export class FlightRepository {
  static async create(data) {
    const flight = await prisma.flight.create({
      data,
    });

    return flight;
  }

  static async update(flightID, data) {
    const updatedFlight = await prisma.flight.update({
      where: {
        id: flightID,
      },
      data,
    });

    return updatedFlight;
  }

  static async delete(flightID) {
    const deletedFlight = await prisma.flight.delete({
      where: {
        id: flightID,
      },
    });

    return deletedFlight;
  }

  static async findMany(pagination, filter, sorter) {
    const flights = await prisma.flight.findMany({
      skip: pagination.offset,
      take: pagination.limit,
      where: filter,
      orderBy: sorter,
      include: {
        _count: true,
        airline: true,
        arrival: true,
        departure: true,
        seat: true,
      },
    });

    return flights;
  }

  static async findByID(flightID) {
    const flight = await prisma.flight.findUnique({
      where: {
        id: flightID,
      },
      include: {
        _count: true,
        airline: true,
        arrival: true,
        departure: true,
        seat: true,
      },
    });

    return flight;
  }

  static async count(filter) {
    const totalFlights = await prisma.flight.count({
      where: filter,
    });

    return totalFlights;
  }

  static async findByFlightNumber(flightNumber) {
    const flight = await prisma.flight.findFirst({
      where: {
        flightNumber,
      },
    });
    return !!flight;
  }
}
