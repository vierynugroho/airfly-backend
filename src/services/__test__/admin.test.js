import { AdminService } from '../admin.js';
import { AdminRepository } from '../../repositories/admin.js';

jest.mock('../../repositories/admin.js', () => ({
  AdminRepository: {
    count: jest.fn(),
  },
}));

describe('AdminService', () => {
  describe('count', () => {
    it('should return the result from AdminRepository.count', async () => {
      const mockResult = {
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
      };
      AdminRepository.count.mockResolvedValue(mockResult);

      const result = await AdminService.count();

      expect(result).toEqual(mockResult);
      expect(AdminRepository.count).toHaveBeenCalledTimes(1);
    });
  });
});
