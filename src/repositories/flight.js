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
      },
    });

    const haveSorting = sorter && Object.keys(sorter).length > 0;
    const haveFiltering = filter && Object.keys(filter).length > 0;
    const haveSortFilter = !haveSorting && !haveFiltering;
    console.log({ haveSorting, haveFiltering, haveSortFilter });

    if (!haveSorting && !haveFiltering) {
      const sortedFlights = flights.sort((a, b) => {
        const totalA = (a._count.booking || 0) + (a._count.returnBooking || 0);
        const totalB = (b._count.booking || 0) + (b._count.returnBooking || 0);
        return totalB - totalA;
      });

      return sortedFlights;
    }

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

  static async flightTicketsSoldOut(flightID) {
    const availableSeats = await prisma.flight.findFirst({
      where: {
        id: flightID,
      },
      include: {
        seat: {
          where: {
            status: 'AVAILABLE',
          },
        },
      },
    });

    const isSoldOut = !availableSeats || availableSeats.seat.length === 0;

    return isSoldOut;
  }
}
