import { DiscountRepository } from '../discount.js';
import { prisma } from '../../database/db.js';

jest.mock('../../database/db.js', () => ({
  prisma: {
    discount: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

describe('DiscountRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a discount and return it', async () => {
      const mockDiscount = { id: 1, name: 'Holiday Discount', code: 'HOLIDAY2024' };
      const data = { name: 'Holiday Discount', code: 'HOLIDAY2024' };

      prisma.discount.create.mockResolvedValue(mockDiscount);

      const result = await DiscountRepository.create(data);

      expect(prisma.discount.create).toHaveBeenCalledWith({ data });
      expect(result).toEqual(mockDiscount);
    });
  });

  describe('update', () => {
    it('should update a discount and return the updated discount', async () => {
      const mockUpdatedDiscount = { id: 1, name: 'Updated Discount', code: 'HOLIDAY2024' };
      const discountID = 1;
      const data = { name: 'Updated Discount' };

      prisma.discount.update.mockResolvedValue(mockUpdatedDiscount);

      const result = await DiscountRepository.update(discountID, data);

      expect(prisma.discount.update).toHaveBeenCalledWith({
        where: { id: discountID },
        data,
      });
      expect(result).toEqual(mockUpdatedDiscount);
    });
  });

  describe('delete', () => {
    it('should delete a discount and return the deleted discount', async () => {
      const mockDeletedDiscount = { id: 1, name: 'Holiday Discount', code: 'HOLIDAY2024' };
      const discountID = 1;

      prisma.discount.delete.mockResolvedValue(mockDeletedDiscount);

      const result = await DiscountRepository.delete(discountID);

      expect(prisma.discount.delete).toHaveBeenCalledWith({ where: { id: discountID } });
      expect(result).toEqual(mockDeletedDiscount);
    });
  });

  describe('findMany', () => {
    it('should return a list of discounts with pagination, filtering, and sorting', async () => {
      const mockDiscounts = [
        { id: 1, name: 'Holiday Discount', code: 'HOLIDAY2024' },
        { id: 2, name: 'Black Friday Discount', code: 'BLACKFRIDAY2024' },
      ];
      const pagination = { offset: 0, limit: 10 };
      const filter = { isActive: true };
      const sorter = { startDate: 'asc' };

      prisma.discount.findMany.mockResolvedValue(mockDiscounts);

      const result = await DiscountRepository.findMany(pagination, filter, sorter);

      expect(prisma.discount.findMany).toHaveBeenCalledWith({
        skip: pagination.offset,
        take: pagination.limit,
        where: filter,
        orderBy: sorter,
        select: expect.objectContaining({
          id: true,
          name: true,
          code: true,
          description: true,
          type: true,
          value: true,
          startDate: true,
          endDate: true,
          minPurchase: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        }),
      });
      expect(result).toEqual(mockDiscounts);
    });
  });

  describe('findByID', () => {
    it('should return a discount by its ID', async () => {
      const mockDiscount = { id: 1, name: 'Holiday Discount', code: 'HOLIDAY2024' };
      const discountID = 1;

      prisma.discount.findUnique.mockResolvedValue(mockDiscount);

      const result = await DiscountRepository.findByID(discountID);

      expect(prisma.discount.findUnique).toHaveBeenCalledWith({
        where: { id: discountID },
        select: expect.objectContaining({
          id: true,
          name: true,
          code: true,
          description: true,
          type: true,
          value: true,
          startDate: true,
          endDate: true,
          minPurchase: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        }),
      });
      expect(result).toEqual(mockDiscount);
    });
  });

  describe('count', () => {
    it('should return the count of discounts based on the filter', async () => {
      const mockCount = 5;
      const filter = { isActive: true };

      prisma.discount.count.mockResolvedValue(mockCount);

      const result = await DiscountRepository.count(filter);

      expect(prisma.discount.count).toHaveBeenCalledWith({ where: filter });
      expect(result).toBe(mockCount);
    });
  });

  describe('findByCode', () => {
    it('should return a discount by its code', async () => {
      const mockDiscount = { id: 1, name: 'Holiday Discount', code: 'HOLIDAY2024' };
      const code = 'HOLIDAY2024';

      prisma.discount.findFirst.mockResolvedValue(mockDiscount);

      const result = await DiscountRepository.findByCode(code);

      expect(prisma.discount.findFirst).toHaveBeenCalledWith({
        where: { code },
        select: expect.objectContaining({
          id: true,
          name: true,
          code: true,
          description: true,
          type: true,
          value: true,
          startDate: true,
          endDate: true,
          minPurchase: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        }),
      });
      expect(result).toEqual(mockDiscount);
    });
  });
});
