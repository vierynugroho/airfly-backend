import { ErrorHandler } from '../middlewares/error.js';
import { FlightRepository } from '../repositories/flight.js';
import { SeatRepository } from '../repositories/seat.js';

export class FlightService {
  static async getAll(pagination, filter, sorter) {
    if (filter.class) {
      const seatClassEnum = await SeatRepository.getClassEnum();
      const upperCaseClass = filter.class.trim().toUpperCase();

      if (!Object.keys(seatClassEnum).includes(upperCaseClass)) {
        throw new ErrorHandler(
          422,
          `Invalid seat class. Available classes: ${Object.keys(seatClassEnum).join(', ')}`
        );
      }
    }
    const flights = await FlightRepository.findMany(pagination, filter, sorter);
    const totalFlights = await FlightRepository.count(filter);

    return { flights, totalFlights };
  }

  static async getByID(flightID) {
    const flight = await FlightRepository.findByID(flightID);

    if (!flight) {
      throw new ErrorHandler(404, 'flight is not found');
    }

    return flight;
  }

  static async create(data) {
    const createdFlight = await FlightRepository.create(data);

    return createdFlight;
  }

  static async update(id, data) {
    const flight = await FlightRepository.findByID(id);

    if (!flight) {
      throw new ErrorHandler(404, 'Flight is not found');
    }

    if (data.flightNumber) {
      const existingFlight = await FlightRepository.findByFlightNumber(
        data.flightNumber
      );

      if (existingFlight && existingFlight.id !== id) {
        throw new ErrorHandler(
          409,
          'Flight number is already used by another flight'
        );
      }
    }

    const updatedFlight = await FlightRepository.update(id, data);

    return updatedFlight;
  }

  static async delete(flightID) {
    const flight = await FlightRepository.findByID(flightID);

    if (!flight) {
      throw new ErrorHandler(404, 'flight is not found');
    }

    const deletedFlight = await FlightRepository.delete(flightID);

    return deletedFlight;
  }
}
