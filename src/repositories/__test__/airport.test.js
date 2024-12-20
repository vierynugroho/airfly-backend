import { jest } from '@jest/globals';
import { prisma } from '../../database/db.js';
import { AirportRepository } from '../airport.js';

jest.mock('../../database/db.js', () => ({
  prisma: {
    airport: {
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

describe('AirportRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an airport', async () => {
      const mockAirport = { id: 1, name: 'Airport 1', code: 'A1' };
      const data = { name: 'Airport 1', code: 'A1' };
      prisma.airport.create.mockResolvedValue(mockAirport);

      const airport = await AirportRepository.create(data);

      expect(prisma.airport.create).toHaveBeenCalledWith({
        data,
      });
      expect(airport).toEqual(mockAirport);
    });
  });

  describe('update', () => {
    it('should update an airport', async () => {
      const mockAirport = { id: 1, name: 'Updated Airport', code: 'A1' };
      const data = { name: 'Updated Airport', code: 'A1' };
      prisma.airport.update.mockResolvedValue(mockAirport);

      const updatedAirport = await AirportRepository.update(1, data);

      expect(prisma.airport.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data,
      });
      expect(updatedAirport).toEqual(mockAirport);
    });
  });

  describe('delete', () => {
    it('should delete an airport', async () => {
      const mockAirport = { id: 1, name: 'Airport 1', code: 'A1' };
      prisma.airport.delete.mockResolvedValue(mockAirport);

      const deletedAirport = await AirportRepository.delete(1);

      expect(prisma.airport.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(deletedAirport).toEqual(mockAirport);
    });
  });

  describe('findMany', () => {
    it('should find many airports with pagination, filter, and sorter as an array', async () => {
      const mockAirports = [
        { id: 1, name: 'Airport 1', code: 'A1' },
        { id: 2, name: 'Airport 2', code: 'A2' },
      ];
      const pagination = { offset: 0, limit: 10 };
      const filter = { name: 'Airport' };
      const sorter = [{ name: 'asc' }];
      prisma.airport.findMany.mockResolvedValue(mockAirports);
  
      const airports = await AirportRepository.findMany(pagination, filter, sorter);
  
      expect(prisma.airport.findMany).toHaveBeenCalledWith({
        skip: pagination.offset,
        take: pagination.limit,
        where: filter,
        orderBy: sorter,
        include: {
          departure: true,
          arrival: true,
        },
      });
      expect(airports).toEqual(mockAirports);
    });
  
    it('should find many airports with pagination, filter, and sorter as a single object', async () => {
      const mockAirports = [
        { id: 1, name: 'Airport 1', code: 'A1' },
        { id: 2, name: 'Airport 2', code: 'A2' },
      ];
      const pagination = { offset: 0, limit: 10 };
      const filter = { name: 'Airport' };
      const sorter = { name: 'asc' };
      prisma.airport.findMany.mockResolvedValue(mockAirports);
  
      const airports = await AirportRepository.findMany(pagination, filter, sorter);
  
      expect(prisma.airport.findMany).toHaveBeenCalledWith({
        skip: pagination.offset,
        take: pagination.limit,
        where: filter,
        orderBy: [sorter],
        include: {
          departure: true,
          arrival: true,
        },
      });
      expect(airports).toEqual(mockAirports);
    });
  });
  

  describe('findByID', () => {
    it('should find an airport by ID', async () => {
      const mockAirport = { id: 1, name: 'Airport 1', code: 'A1' };
      prisma.airport.findUnique.mockResolvedValue(mockAirport);

      const airport = await AirportRepository.findByID(1);

      expect(prisma.airport.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          departure: true,
          arrival: true,
        },
      });
      expect(airport).toEqual(mockAirport);
    });
  });

  describe('count', () => {
    it('should return the count of airports', async () => {
      const mockCount = 5;
      const filter = { name: 'Airport' };
      prisma.airport.count.mockResolvedValue(mockCount);

      const count = await AirportRepository.count(filter);

      expect(prisma.airport.count).toHaveBeenCalledWith({
        where: filter,
      });
      expect(count).toEqual(mockCount);
    });
  });

  describe('findByCode', () => {
    it('should find an airport by code', async () => {
      const mockAirport = { id: 1, name: 'Airport 1', code: 'A1' };
      const code = 'A1';
      prisma.airport.findFirst.mockResolvedValue(mockAirport);

      const airport = await AirportRepository.findByCode(code);

      expect(prisma.airport.findFirst).toHaveBeenCalledWith({
        where: { code },
        include: {
          departure: true,
          arrival: true,
        },
      });
      expect(airport).toEqual(mockAirport);
    });
  });
});
