import { TicketRepository } from '../ticket.js';
import { prisma } from '../../database/db.js';

jest.mock('../../database/db.js', () => ({
  prisma: {
    bookingDetail: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    booking: {
      findUnique: jest.fn(),
    },
  },
}));

describe('TicketRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findMany', () => {
    it('should return booking details for a user with pagination', async () => {
      const mockBookingDetails = [
        { id: 1, passenger: { name: 'John Doe' }, seat: { number: 'A1' } },
        { id: 2, passenger: { name: 'Jane Doe' }, seat: { number: 'B1' } },
      ];
      const userID = 1;
      const pagination = { offset: 0, limit: 10 };

      prisma.bookingDetail.findMany.mockResolvedValue(mockBookingDetails);

      const result = await TicketRepository.findMany(userID, pagination);

      expect(prisma.bookingDetail.findMany).toHaveBeenCalledWith({
        skip: pagination.offset,
        take: pagination.limit,
        where: {
          booking: {
            userId: userID,
          },
        },
      });
      expect(result).toEqual(mockBookingDetails);
    });
  });

  describe('findBoking', () => {
    it('should return a booking with details, flight, and payment', async () => {
      const mockBooking = {
        id: 1,
        payment: { status: 'settlement' },
        bookingDetail: [
          { id: 1, passenger: { name: 'John Doe' }, seat: { number: 'A1' } },
        ],
        payment: { status: 'settlement' },
        flight: {
          airline: { name: 'Airline1' },
          departure: { airport: 'JFK' },
          arrival: { airport: 'LAX' },
        },
        returnFlight: {
          airline: { name: 'Airline2' },
          departure: { airport: 'LAX' },
          arrival: { airport: 'JFK' },
        },
      };
      const bookingID = 1;

      prisma.booking.findUnique.mockResolvedValue(mockBooking);

      const result = await TicketRepository.findBoking(bookingID);

      expect(prisma.booking.findUnique).toHaveBeenCalledWith({
        where: { id: bookingID, payment: { status: 'settlement' } },
        include: {
          bookingDetail: { include: { passenger: true, seat: true } },
          payment: true,
          flight: { include: { airline: true, departure: true, arrival: true } },
          returnFlight: { include: { airline: true, departure: true, arrival: true } },
        },
      });
      expect(result).toEqual(mockBooking);
    });

    it('should return null if no booking is found with settlement status', async () => {
      const bookingID = 2;
      prisma.booking.findUnique.mockResolvedValue(null);

      const result = await TicketRepository.findBoking(bookingID);

      expect(prisma.booking.findUnique).toHaveBeenCalledWith({
        where: { id: bookingID, payment: { status: 'settlement' } },
        include: {
          bookingDetail: { include: { passenger: true, seat: true } },
          payment: true,
          flight: { include: { airline: true, departure: true, arrival: true } },
          returnFlight: { include: { airline: true, departure: true, arrival: true } },
        },
      });
      expect(result).toBeNull();
    });
  });

  describe('updateQRCode', () => {
    it('should update booking detail with QR code and token', async () => {
      const mockUpdatedDetail = {
        qrCodeImage: 'image.png',
        qrToken: 'token123',
        passenger: { name: 'John Doe', familyName: 'Doe', type: 'Adult' },
        booking: {
          flight: { airline: { name: 'Airline1' }, departure: { airport: 'JFK' }, arrival: { airport: 'LAX' } },
          returnFlight: { airline: { name: 'Airline2' }, departure: { airport: 'LAX' }, arrival: { airport: 'JFK' } },
        },
      };
      const bookingID = 1;
      const detailBookingID = 1;
      const qrCodeImage = 'image.png';
      const qrToken = 'token123';

      prisma.bookingDetail.update.mockResolvedValue(mockUpdatedDetail);

      const result = await TicketRepository.updateQRCode(bookingID, detailBookingID, qrCodeImage, qrToken);

      expect(prisma.bookingDetail.update).toHaveBeenCalledWith({
        where: { bookingId: bookingID, id: detailBookingID },
        data: { qrCodeImage, qrToken },
        select: {
          passenger: { select: { name: true, familyName: true, type: true } },
          qrCodeImage: true,
          booking: { include: { flight: { include: { airline: true, departure: true, arrival: true } }, returnFlight: { include: { airline: true, departure: true, arrival: true } } } },
        },
      });
      expect(result).toEqual(mockUpdatedDetail);
    });
  });

  describe('validateQRCode', () => {
    it('should return booking detail if QR code token is valid', async () => {
      const mockBookingDetail = {
        id: 1,
        bookingId: 1,
        qrToken: 'token123',
        passenger: { name: 'John Doe' },
        seat: { number: 'A1' },
      };
      const bookingID = 1;
      const bookingDetailID = 1;
      const QRToken = 'token123';

      prisma.bookingDetail.findUnique.mockResolvedValue(mockBookingDetail);

      const result = await TicketRepository.validateQRCode(bookingID, bookingDetailID, QRToken);

      expect(prisma.bookingDetail.findUnique).toHaveBeenCalledWith({
        where: { bookingId: bookingID, id: bookingDetailID, qrToken: QRToken },
        include: { booking: true, passenger: true, seat: true },
      });
      expect(result).toEqual(mockBookingDetail);
    });

    it('should return null if QR code token is invalid', async () => {
      const bookingID = 1;
      const bookingDetailID = 1;
      const QRToken = 'invalidToken';

      prisma.bookingDetail.findUnique.mockResolvedValue(null);

      const result = await TicketRepository.validateQRCode(bookingID, bookingDetailID, QRToken);

      expect(prisma.bookingDetail.findUnique).toHaveBeenCalledWith({
        where: { bookingId: bookingID, id: bookingDetailID, qrToken: QRToken },
        include: { booking: true, passenger: true, seat: true },
      });
      expect(result).toBeNull();
    });
  });
});
