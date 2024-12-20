import { AirlineService } from '../airline.js';
import { AirlineRepository } from '../../repositories/airline.js';
import { UploadService } from '../upload.js';

jest.mock('../../repositories/airline.js', () => ({
  AirlineRepository: {
    findMany: jest.fn(),
    findByName: jest.fn(),
    create: jest.fn(),
    findByID: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
}));

jest.mock('../upload.js', () => ({
  UploadService: {
    upload: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('AirlineService', () => {
  describe('findAll', () => {
    it('should return all airlines', async () => {
      const mockAirlines = [{ id: 1, name: 'Test Airline' }];
      AirlineRepository.findMany.mockResolvedValue(mockAirlines);

      const result = await AirlineService.findAll();

      expect(result).toEqual(mockAirlines);
      expect(AirlineRepository.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new airline', async () => {
      const mockFiles = { image: {} };
      const mockData = { name: 'New Airline' };
      const mockUploadResponse = {
        image: { url: 'http://example.com/image.jpg', fileId: '12345' },
      };
      const mockCreatedAirline = {
        id: 1,
        name: 'New Airline',
        imageUrl: 'http://example.com/image.jpg',
      };

      AirlineRepository.findByName.mockResolvedValue(null);
      UploadService.upload.mockResolvedValue(mockUploadResponse);
      AirlineRepository.create.mockResolvedValue(mockCreatedAirline);

      const result = await AirlineService.create(mockFiles, mockData);

      expect(result).toEqual(mockCreatedAirline);
      expect(AirlineRepository.findByName).toHaveBeenCalledWith('New Airline');
      expect(UploadService.upload).toHaveBeenCalledWith(mockFiles, 'airlines', [
        'airline',
      ]);
      expect(AirlineRepository.create).toHaveBeenCalledWith({
        ...mockData,
        imageUrl: mockUploadResponse.image.url,
        imageId: mockUploadResponse.image.fileId,
      });
    });

    it('should throw an error if no image is provided', async () => {
      const mockFiles = {};
      const mockData = { name: 'New Airline' };

      await expect(AirlineService.create(mockFiles, mockData)).rejects.toThrow(
        'no file selected'
      );
    });

    it('should throw an error if airline name already exists', async () => {
      const mockFiles = { image: {} };
      const mockData = { name: 'Existing Airline' };

      AirlineRepository.findByName.mockResolvedValue({
        id: 1,
        name: 'Existing Airline',
      });

      await expect(AirlineService.create(mockFiles, mockData)).rejects.toThrow(
        'Airline name already exists'
      );
      expect(AirlineRepository.findByName).toHaveBeenCalledWith(
        'Existing Airline'
      );
    });
  });

  describe('update', () => {
    it('should update an airline', async () => {
      const mockAirlineID = 1;
      const mockFiles = { image: {} };
      const mockData = { name: 'Updated Airline' };
      const mockAirline = { id: 1, name: 'Test Airline', imageId: '12345' };
      const mockUploadResponse = {
        image: { url: 'http://example.com/new-image.jpg', fileId: '67890' },
      };
      const mockUpdatedAirline = {
        id: 1,
        name: 'Updated Airline',
        imageUrl: 'http://example.com/new-image.jpg',
      };

      AirlineRepository.findByID.mockResolvedValue(mockAirline);
      AirlineRepository.findByName.mockResolvedValue(null);
      UploadService.upload.mockResolvedValue(mockUploadResponse);
      AirlineRepository.update.mockResolvedValue(mockUpdatedAirline);

      const result = await AirlineService.update(
        mockAirlineID,
        mockFiles,
        mockData
      );

      expect(result).toEqual(mockUpdatedAirline);
      expect(AirlineRepository.findByID).toHaveBeenCalledWith(mockAirlineID);
      expect(AirlineRepository.findByName).toHaveBeenCalledWith(mockData.name);
      expect(UploadService.upload).toHaveBeenCalledWith(mockFiles, 'airlines', [
        'airline',
      ]);
      expect(AirlineRepository.update).toHaveBeenCalledWith(mockAirlineID, {
        ...mockData,
        imageUrl: mockUploadResponse.image.url,
        imageId: mockUploadResponse.image.fileId,
      });
    });

    it('should throw an error if airline is not found', async () => {
      const mockAirlineID = 999;
      const mockFiles = { image: {} };
      const mockData = { name: 'Nonexistent Airline' };

      AirlineRepository.findByID.mockResolvedValue(null);

      await expect(
        AirlineService.update(mockAirlineID, mockFiles, mockData)
      ).rejects.toThrow('Airline not found');
    });

    it('should throw an error if airline name already exists', async () => {
      const mockAirlineID = 1;
      const mockFiles = { image: {} };
      const mockData = { name: 'Duplicate Airline' };
      const mockAirline = { id: 1, name: 'Original Airline' };
      const mockExistingAirline = { id: 2, name: 'Duplicate Airline' };

      AirlineRepository.findByID.mockResolvedValue(mockAirline);
      AirlineRepository.findByName.mockResolvedValue(mockExistingAirline);

      await expect(
        AirlineService.update(mockAirlineID, mockFiles, mockData)
      ).rejects.toThrow('Airline name already exists');
      expect(AirlineRepository.findByName).toHaveBeenCalledWith(mockData.name);
    });
  });

  describe('delete', () => {
    it('should delete an airline', async () => {
      const mockAirlineID = 1;
      const mockAirline = { id: 1, imageId: '12345' };

      AirlineRepository.findByID.mockResolvedValue(mockAirline);
      AirlineRepository.delete.mockResolvedValue(mockAirline);

      const result = await AirlineService.delete(mockAirlineID);

      expect(result).toEqual(mockAirline);
      expect(AirlineRepository.findByID).toHaveBeenCalledWith(mockAirlineID);
      expect(UploadService.delete).toHaveBeenCalledWith('12345');
      expect(AirlineRepository.delete).toHaveBeenCalledWith(mockAirlineID);
    });

    it('should throw an error if airline is not found', async () => {
      const mockAirlineID = 999;

      AirlineRepository.findByID.mockResolvedValue(null);

      await expect(AirlineService.delete(mockAirlineID)).rejects.toThrow(
        'Airline not found'
      );
    });
  });

  describe('findByID', () => {
    it('should return an airline by ID', async () => {
      const mockAirlineID = 1;
      const mockAirline = { id: 1, name: 'Test Airline' };

      AirlineRepository.findByID.mockResolvedValue(mockAirline);

      const result = await AirlineService.findByID(mockAirlineID);

      expect(result).toEqual(mockAirline);
      expect(AirlineRepository.findByID).toHaveBeenCalledWith(mockAirlineID);
    });

    it('should throw an error if airline is not found', async () => {
      const mockAirlineID = 999;

      AirlineRepository.findByID.mockResolvedValue(null);

      await expect(AirlineService.findByID(mockAirlineID)).rejects.toThrow(
        'Airline not found'
      );
    });

    it('should throw an error if ID format is invalid', async () => {
      const mockInvalidID = 'invalid';

      await expect(AirlineService.findByID(mockInvalidID)).rejects.toThrow(
        'Invalid ID format'
      );
    });
  });

  describe('findByName', () => {
    it('should return an airline by name', async () => {
      const mockName = 'Test Airline';
      const mockAirline = { id: 1, name: 'Test Airline' };

      AirlineRepository.findByName.mockResolvedValue(mockAirline);

      const result = await AirlineService.findByName(mockName);

      expect(result).toEqual(mockAirline);
      expect(AirlineRepository.findByName).toHaveBeenCalledWith(mockName);
    });

    it('should throw an error if airline is not found', async () => {
      const mockName = 'Nonexistent Airline';

      AirlineRepository.findByName.mockResolvedValue(null);

      await expect(AirlineService.findByName(mockName)).rejects.toThrow(
        'Airline not found'
      );
    });
  });

  describe('findMany', () => {
    it('should return paginated airlines with total count', async () => {
      const mockPagination = { limit: 10, offset: 0 };
      const mockFilter = { name: 'Test' };
      const mockSorter = { createdAt: 'desc' };
      const mockAirlines = [{ id: 1, name: 'Test Airline' }];
      const mockTotalCount = 1;

      AirlineRepository.findMany.mockResolvedValue(mockAirlines);
      AirlineRepository.count.mockResolvedValue(mockTotalCount);

      const result = await AirlineService.findMany(
        mockPagination,
        mockFilter,
        mockSorter
      );

      expect(result).toEqual({
        airlines: mockAirlines,
        totalAirlines: mockTotalCount,
      });
      expect(AirlineRepository.findMany).toHaveBeenCalledWith(
        mockPagination,
        mockFilter,
        mockSorter
      );
      expect(AirlineRepository.count).toHaveBeenCalledWith(mockFilter);
    });
  });
});
