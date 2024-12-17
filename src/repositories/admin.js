import { UserRole } from '@prisma/client';
import { prisma } from '../database/db.js';

export class AdminRepository {
  static async count() {
    const totalAirlines = await prisma.airline.count();
    const totalAirports = await prisma.airport.count();
    const totalFlights = await prisma.flight.count();
    const totalUsers = await prisma.user.count({
      where: {
        role: UserRole.BUYER,
      },
    });
    const totalTransactions = await prisma.payment.count();
    const totalDiscounts = await prisma.discount.count();
    const totalNotifications = await prisma.notification.count();
    const totalBookings = await prisma.booking.count();
    const totalPassengers = await prisma.passenger.count();
    const totalSeats = await prisma.seat.count();
    const totalTickets = await prisma.bookingDetail.count();

    return {
      totalAirlines,
      totalAirports,
      totalFlights,
      totalUsers,
      totalTransactions,
      totalDiscounts,
      totalNotifications,
      totalBookings,
      totalPassengers,
      totalSeats,
      totalTickets,
    };
  }
}
