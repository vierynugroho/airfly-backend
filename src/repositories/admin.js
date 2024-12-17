import { UserRole } from '@prisma/client';
import { prisma } from '../database/db.js';

export class AdminRepository {
  static async count() {
    const totalAirlines = await prisma.airline.aggregate({
      _count: true,
    });
    const totalAirports = await prisma.airport.aggregate({
      _count: true,
    });
    const totalFlights = await prisma.flight.aggregate({
      _count: true,
    });
    const totalUsers = await prisma.user.aggregate({
      _count: true,
      where: {
        role: UserRole.BUYER,
      },
    });
    const totalTransactions = await prisma.payment.aggregate({
      _count: true,
    });

    return {
      totalAirlines,
      totalAirports,
      totalFlights,
      totalUsers,
      totalTransactions,
    };
  }
}
