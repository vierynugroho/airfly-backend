import { ErrorHandler } from '../middlewares/error.js';
import { AirportRepository } from '../repositories/airport.js';
import { FlightRepository } from '../repositories/flight.js';
import { SeatRepository } from '../repositories/seat.js';
import { calculateDuration } from '../utils/calculateDuration.js';

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

    console.log(filter);
    const flights = await FlightRepository.findMany(pagination, filter, sorter);
    const flightsWithDuration = flights.map((flight) => {
      const duration = calculateDuration(
        flight.departureTime,
        flight.arrivalTime
      );
      return {
        duration,
        ...flight,
      };
    });
    const totalFlights = await FlightRepository.count(filter);

    return { flights: flightsWithDuration, totalFlights };
  }

  static async getByID(flightID) {
    const flight = await FlightRepository.findByID(flightID);

    if (!flight) {
      throw new ErrorHandler(404, 'flight is not found');
    }

    return flight;
  }

  static async create(data) {
    /*
    TODO: validation create and update by airline | available or not
    */
    const checkArrivalAirport = await AirportRepository.findByID(
      data.arrivalAirport
    );
    const checkDepartureAirport = await AirportRepository.findByID(
      data.departureAirport
    );

    if (!checkArrivalAirport) {
      throw new ErrorHandler(404, 'arrival airport is not found');
    }

    if (!checkDepartureAirport) {
      throw new ErrorHandler(404, 'departure airport is not found');
    }

    if (data.flightNumber) {
      const existingFlight = await FlightRepository.findByFlightNumber(
        data.flightNumber
      );

      if (existingFlight) {
        throw new ErrorHandler(
          409,
          'Flight number is already used by another flight'
        );
      }
    }
    const createdFlight = await FlightRepository.create(data);

    return createdFlight;
  }

  static async update(id, data) {
    const flight = await FlightRepository.findByID(id);

    if (!flight) {
      throw new ErrorHandler(404, 'Flight is not found');
    }

    const checkArrivalAirport = await AirportRepository.findByID(
      data.arrivalAirport
    );
    const checkDepartureAirport = await AirportRepository.findByID(
      data.departureAirport
    );

    if (!checkArrivalAirport) {
      throw new ErrorHandler(404, 'arrival airport is not found');
    }

    if (!checkDepartureAirport) {
      throw new ErrorHandler(404, 'departure airport is not found');
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
