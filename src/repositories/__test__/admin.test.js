import { AdminRepository } from '../admin.js';
import { prisma } from '../../database/db.js';
import { UserRole } from '@prisma/client';

jest.mock('../../database/db.js', () => ({
  prisma: {
    airline: {
      count: jest.fn(),
    },
    airport: {
      count: jest.fn(),
    },
    flight: {
      count: jest.fn(),
    },
    user: {
      count: jest.fn(),
    },
    payment: {
      count: jest.fn(),
    },
    discount: {
      count: jest.fn(),
    },
    notification: {
      count: jest.fn(),
    },
    booking: {
      count: jest.fn(),
    },
    passenger: {
      count: jest.fn(),
    },
    seat: {
      count: jest.fn(),
    },
    bookingDetail: {
      count: jest.fn(),
    },
  },
}));

describe('AdminRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('count', () => {
    it('should return the correct counts for all entities', async () => {
      prisma.airline.count.mockResolvedValue(10);
      prisma.airport.count.mockResolvedValue(20);
      prisma.flight.count.mockResolvedValue(30);
      prisma.user.count.mockResolvedValue(40);
      prisma.payment.count.mockResolvedValue(50);
      prisma.discount.count.mockResolvedValue(60);
      prisma.notification.count.mockResolvedValue(70);
      prisma.booking.count.mockResolvedValue(80);
      prisma.passenger.count.mockResolvedValue(90);
      prisma.seat.count.mockResolvedValue(100);
      prisma.bookingDetail.count.mockResolvedValue(110);

      const result = await AdminRepository.count();

      expect(prisma.airline.count).toHaveBeenCalled();
      expect(prisma.airport.count).toHaveBeenCalled();
      expect(prisma.flight.count).toHaveBeenCalled();
      expect(prisma.user.count).toHaveBeenCalledWith({
        where: { role: UserRole.BUYER },
      });
      expect(prisma.payment.count).toHaveBeenCalled();
      expect(prisma.discount.count).toHaveBeenCalled();
      expect(prisma.notification.count).toHaveBeenCalled();
      expect(prisma.booking.count).toHaveBeenCalled();
      expect(prisma.passenger.count).toHaveBeenCalled();
      expect(prisma.seat.count).toHaveBeenCalled();
      expect(prisma.bookingDetail.count).toHaveBeenCalled();

      expect(result).toEqual({
        totalAirlines: 10,
        totalAirports: 20,
        totalFlights: 30,
        totalUsers: 40,
        totalTransactions: 50,
        totalDiscounts: 60,
        totalNotifications: 70,
        totalBookings: 80,
        totalPassengers: 90,
        totalSeats: 100,
        totalTickets: 110,
      });
    });
  });
});
