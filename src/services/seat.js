import { ErrorHandler } from '../middlewares/error.js';
import { SeatRepository } from '../repositories/seat.js';

export class SeatService {
  static async create(data) {
    const existingSeat = await SeatRepository.findBySeatNumber(data.seatNumber);

    if (existingSeat) {
      const seatExistsInSameFlight = await SeatRepository.exists(
        data.flightId,
        data.seatNumber
      );
      if (seatExistsInSameFlight) {
        throw new ErrorHandler(
          409,
          'Seat number has already been used in the same flight'
        );
      }
    }

    const createdSeat = await SeatRepository.create(data);

    return createdSeat;
  }

  static async update(id, data) {
    const seat = await SeatRepository.findById(id);

    if (!seat) {
      throw new ErrorHandler(404, 'seat is not found');
    }

    const isSameFlight = data.flightId === seat.flightId;
    const isSeatNumberChanged =
      data.seatNumber && data.seatNumber !== seat.seatNumber;

    if (isSameFlight && isSeatNumberChanged) {
      const seatExists = await SeatRepository.exists(
        seat.flightId,
        data.seatNumber
      );
      if (seatExists) {
        throw new ErrorHandler(409, 'Seat number has already been used');
      }
    }

    const updatedSeat = await SeatRepository.update(id, data);

    return updatedSeat;
  }

  static async delete(id) {
    const seat = await SeatRepository.findById(id);

    if (!seat) {
      throw new ErrorHandler(404, 'seat is not found');
    }

    const deletedSeat = await SeatRepository.delete(id);

    return deletedSeat;
  }

  static async findMany(pagination, filter, sorter) {
    const seats = await SeatRepository.findMany(pagination, filter, sorter);
    const totalSeats = await SeatRepository.count(filter);

    return { seats, totalSeats };
  }

  static async findById(seatID) {
    const seat = await SeatRepository.findById(seatID);

    if (!seat) {
      throw new ErrorHandler(404, 'seat is not found');
    }

    return seat;
  }

  static async findByFlight(flightID) {
    const seats = await SeatRepository.findByFlight(flightID);

    return seats;
  }

  static async findBySeatNumber(seatNumber) {
    const seats = await SeatRepository.findBySeatNumber(seatNumber);

    return seats;
  }

  static async findByClass(seatClass) {
    const seats = await SeatRepository.findByClass(seatClass);

    return seats;
  }

  static async findByStatus(seatStatus) {
    const seats = await SeatRepository.findByStatus(seatStatus);

    return seats;
  }
}
