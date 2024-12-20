import { AirlineRepository } from '../airline.js';
import { prisma } from '../../database/db.js';

jest.mock('../../database/db.js', () => ({
  prisma: {
    airline: {
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

describe('AirlineRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new airline', async () => {
      const mockData = { name: 'Airline Test', code: 'AT' };
      const mockResponse = { id: 1, ...mockData };

      prisma.airline.create.mockResolvedValue(mockResponse);

      const result = await AirlineRepository.create(mockData);

      expect(prisma.airline.create).toHaveBeenCalledWith({ data: mockData });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should update an airline by ID', async () => {
      const mockData = { name: 'Updated Airline' };
      const mockResponse = { id: 1, ...mockData };

      prisma.airline.update.mockResolvedValue(mockResponse);

      const result = await AirlineRepository.update(1, mockData);

      expect(prisma.airline.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: mockData,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('should delete an airline by ID', async () => {
      const mockResponse = { id: 1, name: 'Deleted Airline' };

      prisma.airline.delete.mockResolvedValue(mockResponse);

      const result = await AirlineRepository.delete(1);

      expect(prisma.airline.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findMany', () => {
    it('should return a list of airlines with pagination, filters, and sorting', async () => {
      const mockPagination = { offset: 0, limit: 10 };
      const mockFilter = { name: { contains: 'Air', mode: 'insensitive' } };
      const mockSorter = { name: 'asc' };
      const mockResponse = [
        { id: 1, name: 'Airline A' },
        { id: 2, name: 'Airline B' },
      ];

      prisma.airline.findMany.mockResolvedValue(mockResponse);

      const result = await AirlineRepository.findMany(
        mockPagination,
        mockFilter,
        mockSorter
      );

      expect(prisma.airline.findMany).toHaveBeenCalledWith({
        skip: mockPagination.offset,
        take: mockPagination.limit,
        where: mockFilter,
        orderBy: mockSorter,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findByID', () => {
    it('should return an airline by ID', async () => {
      const mockResponse = { id: 1, name: 'Airline A' };

      prisma.airline.findUnique.mockResolvedValue(mockResponse);

      const result = await AirlineRepository.findByID(1);

      expect(prisma.airline.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('count', () => {
    it('should return the total number of airlines with filters', async () => {
      const mockFilter = { name: { contains: 'Air', mode: 'insensitive' } };
      const mockResponse = 5;

      prisma.airline.count.mockResolvedValue(mockResponse);

      const result = await AirlineRepository.count(mockFilter);

      expect(prisma.airline.count).toHaveBeenCalledWith({ where: mockFilter });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findByName', () => {
    it('should return an airline by name (case insensitive)', async () => {
      const mockName = 'Airline Test';
      const mockResponse = { id: 1, name: mockName };

      prisma.airline.findFirst.mockResolvedValue(mockResponse);

      const result = await AirlineRepository.findByName(mockName);

      expect(prisma.airline.findFirst).toHaveBeenCalledWith({
        where: {
          name: {
            equals: mockName,
            mode: 'insensitive',
          },
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
