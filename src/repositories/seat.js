import { prisma } from '../database/db.js';

export class SeatRepository {
  static async create(data) {
    const seat = await prisma.seat.create({
      data,
    });

    return seat;
  }

  static async update(id, data) {
    const seat = await prisma.seat.update({
      where: {
        id,
      },
      data,
    });

    return seat;
  }

  static async delete(id) {
    const seat = await prisma.seat.delete({
      where: {
        id,
      },
    });

    return seat;
  }

  static async findMany(pagination, where, orderBy) {
    const seats = await prisma.seat.findMany({
      skip: pagination.offset,
      take: pagination.limit,
      where,
      orderBy,
      include: {
        _count: true,
        flight: true,
      },
    });

    return seats;
  }

  static async count(where) {
    const totalSeats = await prisma.seat.count({
      where,
    });

    return totalSeats;
  }

  static async findById(id) {
    const seat = await prisma.seat.findUnique({
      where: {
        id,
      },
      include: {
        _count: true,
        flight: true,
      },
    });

    return seat;
  }

  static async findByFlight(flightID) {
    const seats = await prisma.seat.findMany({
      where: {
        flightId: flightID,
      },
      include: {
        flight: {
          include: {
            airline: true,
            arrival: true,
            departure: true,
          },
        },
      },
    });

    return seats;
  }

  static async findBySeatNumber(seatNumber) {
    const seats = await prisma.seat.findMany({
      where: {
        seatNumber,
      },
      include: {
        flight: {
          include: {
            airline: true,
            arrival: true,
            departure: true,
          },
        },
      },
    });

    return seats;
  }

  static async exists(flightId, seatNumber) {
    const seat = await prisma.seat.findFirst({
      where: {
        flightId: flightId,
        seatNumber: seatNumber,
      },
    });
    return !!seat;
  }

  static async findByClass(seatClass) {
    const seats = await prisma.seat.findFirst({
      where: {
        class: seatClass,
      },
    });

    return seats;
  }

  static async findByStatus(seatStatus) {
    const seats = await prisma.seat.findFirst({
      where: {
        status: seatStatus,
      },
    });

    return seats;
  }
}
