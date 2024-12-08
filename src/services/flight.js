import { ErrorHandler } from '../middlewares/error.js';
import { AirportRepository } from '../repositories/airport.js';
import { FlightRepository } from '../repositories/flight.js';
import { SeatRepository } from '../repositories/seat.js';
import { AirlineRepository } from '../repositories/airline.js';
import { calculateDuration } from '../utils/calculateDuration.js';

export class FlightService {
  static async getAll(pagination, filter, sorter, duration) {
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

    if (duration && duration.sort) {
      flightsWithDuration.sort((a, b) => {
        const [aDays, aHours, aMinutes] = a.duration.match(/\d+/g).map(Number);
        const [bDays, bHours, bMinutes] = b.duration.match(/\d+/g).map(Number);

        const aTotalMinutes = aDays * 24 * 60 + aHours * 60 + aMinutes;
        const bTotalMinutes = bDays * 24 * 60 + bHours * 60 + bMinutes;

        if (duration.sort === 'asc') {
          return aTotalMinutes - bTotalMinutes;
        }
      });
    }

    const totalFlights = await FlightRepository.count(filter);

    return { flights: flightsWithDuration, totalFlights };
  }

  static async getByID(flightID) {
    const flight = await FlightRepository.findByID(flightID);

    if (!flight) {
      throw new ErrorHandler(404, 'flight is not found');
    }

    const flightSoldOut = await FlightRepository.flightTicketsSoldOut(flightID);

    console.log(flightSoldOut);
    if (flightSoldOut) {
      throw new ErrorHandler(400, 'Flight Tickets Sold Out');
    }

    return flight;
  }

  static async create(data) {
    const arrivalAirport = await AirportRepository.findByID(
      data.arrivalAirport
    );
    const departureAirport = await AirportRepository.findByID(
      data.departureAirport
    );

    if (!arrivalAirport) {
      throw new ErrorHandler(404, 'arrival airport is not found');
    }

    if (!departureAirport) {
      throw new ErrorHandler(404, 'departure airport is not found');
    }

    const airline = await AirlineRepository.findByID(data.airlineId);

    if (!airline) {
      throw new ErrorHandler(404, 'airline is not found');
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

  static async update(flightID, data) {
    const flight = await FlightRepository.findByID(flightID);

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

    const airline = await AirlineRepository.findByID(data.airlineId);

    if (!airline) {
      throw new ErrorHandler(404, 'airline is not found');
    }

    if (data.flightNumber) {
      const existingFlight = await FlightRepository.findByFlightNumber(
        data.flightNumber
      );

      if (existingFlight && existingFlight.id !== flightID) {
        throw new ErrorHandler(
          409,
          'Flight number is already used by another flight'
        );
      }
    }

    const updatedFlight = await FlightRepository.update(flightID, data);

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
