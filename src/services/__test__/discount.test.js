import { DiscountService } from '../discount.js';
import { DiscountRepository } from '../../repositories/discount.js';
import { ErrorHandler } from '../../middlewares/error.js';

jest.mock('../../repositories/discount.js');

describe('DiscountService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const mockData = {
      code: 'TEST123',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      discount: 10,
    };

    it('should create a discount successfully', async () => {
      DiscountRepository.findByCode.mockResolvedValue(null);
      DiscountRepository.create.mockResolvedValue({ id: 1, ...mockData });

      const result = await DiscountService.create(mockData);

      expect(DiscountRepository.findByCode).toHaveBeenCalledWith(mockData.code);
      expect(DiscountRepository.create).toHaveBeenCalledWith({
        ...mockData,
        startDate: new Date(mockData.startDate),
        endDate: new Date(mockData.endDate),
      });
      expect(result).toEqual({ id: 1, ...mockData });
    });

    it('should throw error if discount code already exists', async () => {
      DiscountRepository.findByCode.mockResolvedValue({ id: 1, ...mockData });

      await expect(DiscountService.create(mockData)).rejects.toThrow(
        new ErrorHandler(409, 'Discount code already exists')
      );
    });

    it('should throw error for invalid date format', async () => {
      const invalidData = {
        ...mockData,
        startDate: 'invalid-date',
      };

      await expect(DiscountService.create(invalidData)).rejects.toThrow(
        new ErrorHandler(400, 'Invalid date format')
      );
    });
  });

  describe('update', () => {
    const mockData = {
      code: 'TEST123',
      discount: 15,
    };

    it('should update a discount successfully', async () => {
      DiscountRepository.findByID.mockResolvedValue({ id: 1 });
      DiscountRepository.update.mockResolvedValue({ id: 1, ...mockData });

      const result = await DiscountService.update(1, mockData);

      expect(DiscountRepository.findByID).toHaveBeenCalledWith(1);
      expect(DiscountRepository.update).toHaveBeenCalledWith(1, mockData);
      expect(result).toEqual({ id: 1, ...mockData });
    });

    it('should throw error if discount not found', async () => {
      DiscountRepository.findByID.mockResolvedValue(null);

      await expect(DiscountService.update(1, mockData)).rejects.toThrow(
        new ErrorHandler(404, 'Discount not found')
      );
    });
  });

  describe('delete', () => {
    it('should delete a discount successfully', async () => {
      DiscountRepository.findByID.mockResolvedValue({ id: 1 });
      DiscountRepository.delete.mockResolvedValue({ success: true });

      const result = await DiscountService.delete(1);

      expect(DiscountRepository.findByID).toHaveBeenCalledWith(1);
      expect(DiscountRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ success: true });
    });

    it('should throw error if discount not found', async () => {
      DiscountRepository.findByID.mockResolvedValue(null);

      await expect(DiscountService.delete(1)).rejects.toThrow(
        new ErrorHandler(404, 'Discount not found')
      );
    });
  });

  describe('findMany', () => {
    const mockPagination = { page: 1, limit: 10 };
    const mockFilter = { isActive: true };
    const mockSorter = { field: 'createdAt', order: 'desc' };

    it('should return discounts and total count', async () => {
      const mockDiscounts = [{ id: 1 }, { id: 2 }];
      DiscountRepository.findMany.mockResolvedValue(mockDiscounts);
      DiscountRepository.count.mockResolvedValue(2);

      const result = await DiscountService.findMany(
        mockPagination,
        mockFilter,
        mockSorter
      );

      expect(DiscountRepository.findMany).toHaveBeenCalledWith(
        mockPagination,
        mockFilter,
        mockSorter
      );
      expect(DiscountRepository.count).toHaveBeenCalledWith(mockFilter);
      expect(result).toEqual({
        discounts: mockDiscounts,
        totalDiscounts: 2,
      });
    });
  });

  describe('findByID', () => {
    it('should return discount by ID', async () => {
      const mockDiscount = { id: 1, code: 'TEST123' };
      DiscountRepository.findByID.mockResolvedValue(mockDiscount);

      const result = await DiscountService.findByID(1);

      expect(DiscountRepository.findByID).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockDiscount);
    });

    it('should throw error if discount not found', async () => {
      DiscountRepository.findByID.mockResolvedValue(null);

      await expect(DiscountService.findByID(1)).rejects.toThrow(
        new ErrorHandler(404, 'Discount not found')
      );
    });
  });

  describe('findByCode', () => {
    it('should return discount by code', async () => {
      const mockDiscount = { id: 1, code: 'TEST123' };
      DiscountRepository.findByCode.mockResolvedValue(mockDiscount);

      const result = await DiscountService.findByCode('TEST123');

      expect(DiscountRepository.findByCode).toHaveBeenCalledWith('TEST123');
      expect(result).toEqual(mockDiscount);
    });

    it('should throw error if discount not found', async () => {
      DiscountRepository.findByCode.mockResolvedValue(null);

      await expect(DiscountService.findByCode('TEST123')).rejects.toThrow(
        new ErrorHandler(404, 'Discount not found')
      );
    });
  });
});
