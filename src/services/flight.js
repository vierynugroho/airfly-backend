import { ErrorHandler } from '../middlewares/error.js';
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

    console.log(pagination);
    console.log(filter);
    console.log(sorter);

    /*
    { offset: 0, limit: 10 }
    
    {
    price: { gte: 3000, lte: 1000 },
    class: 'BUSINESS',
    flightNumber: 'CH2'
    }
    
    { price: 'asc' }

    *Response
     {
            "id": 2,
            "flightNumber": "CH1",
            "airlineId": 2,
            "departureAirport": 1,
            "arrivalAirport": 2,
            "departureTime": "2024-01-01T00:00:00.000Z",
            "arrivalTime": "2024-01-02T00:00:00.000Z",
            "terminal": "terminal 2A",
            "information": "free wifi-free inflight meals",
            "price": 5000,
            "class": "BUSINESS",
            "_count": {
                "seat": 0,
                "booking": 0,
                "returnBooking": 0
            },
            "airline": {
                "id": 2,
                "name": "Batik Air",
                "imageUrl": "-",
                "imageId": "-"
            },
            "arrival": {
                "id": 2,
                "code": "SBY1",
                "name": "Juanda International Airport",
                "city": "SURABAYA",
                "state": "INDONESIA",
                "country": "INDONESIA",
                "timezone": "GMT+7",
                "latitude": "1",
                "longitude": "1",
                "elevation": "1",
                "imageUrl": "-",
                "imageId": "-",
                "createdAt": "1970-01-01T00:00:00.000Z"
            },
            "departure": {
                "id": 1,
                "code": "JKT1",
                "name": "Soekarno Hatta International Airport",
                "city": "JAKARTA",
                "state": "INDONESIA",
                "country": "INDONESIA",
                "timezone": "GMT+7",
                "latitude": "1",
                "longitude": "1",
                "elevation": "1",
                "imageUrl": "-",
                "imageId": "-",
                "createdAt": "1970-01-01T00:00:00.000Z"
            }
        },
    */

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
