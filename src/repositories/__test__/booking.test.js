import { prisma } from '../../database/db.js';
import { BookingRepository } from '../booking.js';
import { SeatStatus } from '@prisma/client';
import { generateCode } from '../../utils/generateCode.js';

jest.mock('../../database/db.js', () => ({
  prisma: {
    booking: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    seat: {
      count: jest.fn(),
      updateMany: jest.fn(),
      findMany: jest.fn(),
    },
    passenger: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));
jest.mock('../../utils/generateCode.js');

describe('BookingRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    it('should create a booking and return the created record', async () => {
      const booking = {
        userId: 1,
        flightId: 1,
        returnFlightId: 2,
        bookingDate: '2024-12-20',
        totalPrice: 500,
      };

      const mockedBooking = { id: 1, ...booking, code: 'ABC123' };
      generateCode.mockReturnValue('ABC123');
      prisma.booking.create.mockResolvedValue(mockedBooking);

      const result = await BookingRepository.createBooking(booking);
      expect(prisma.booking.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          flightId: 1,
          returnFlightId: 2,
          bookingDate: '2024-12-20',
          totalPrice: 500,
          code: 'ABC123',
        },
      });
      expect(result).toEqual(mockedBooking);
    });
  });

  describe('createPassengers', () => {
    it('should create multiple passengers in a transaction', async () => {
      const passengers = [
        { name: 'John Doe', bookingId: 1 },
        { name: 'Jane Doe', bookingId: 1 },
      ];

      prisma.$transaction.mockResolvedValueOnce();

      await BookingRepository.createPassengers(passengers);

      expect(prisma.$transaction).toHaveBeenCalledWith(
        passengers.map((v) => prisma.passenger.create({ data: v }))
      );
    });
  });

  describe('isSeatAvailable', () => {
    it('should throw an error if seats are not available', async () => {
      prisma.seat.count.mockResolvedValueOnce(0);

      await expect(
        BookingRepository.isSeatAvailable([1], [1, 2])
      ).rejects.toThrow();
    });
  });

  describe('setSeatStatus', () => {
    it('should update the status of multiple seats', async () => {
      const seatsId = [1, 2, 3];
      const status = SeatStatus.BOOKED;

      prisma.seat.updateMany.mockResolvedValueOnce();

      await BookingRepository.setSeatStatus(seatsId, status);

      expect(prisma.seat.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: seatsId },
        },
        data: { status },
      });
    });
  });

  describe('getBooking', () => {
    it('should retrieve a booking by ID with booking details', async () => {
      const bookingID = 1;
      const mockedBooking = {
        id: 1,
        bookingDetail: [{ seatId: 1 }],
      };

      prisma.booking.findUnique.mockResolvedValueOnce(mockedBooking);

      const result = await BookingRepository.getBooking(bookingID);

      expect(prisma.booking.findUnique).toHaveBeenCalledWith({
        where: { id: bookingID },
        include: { bookingDetail: { select: { seatId: true } } },
      });
      expect(result).toEqual(mockedBooking);
    });
  });

  describe('updateSeatStatusOnPayment', () => {
    it('should update seat statuses on payment', async () => {
      const seatIds = [1, 2];
      const seatStatus = SeatStatus.BOOKED;

      prisma.seat.updateMany.mockResolvedValueOnce({ count: 2 });

      const result = await BookingRepository.updateSeatStatusOnPayment(
        seatIds,
        seatStatus
      );

      expect(prisma.seat.updateMany).toHaveBeenCalledWith({
        where: { id: { in: seatIds } },
        data: { status: seatStatus },
      });
      expect(result).toEqual({ count: 2 });
    });
  });
});
