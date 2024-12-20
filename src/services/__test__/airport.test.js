import { AirportService } from '../airport.js';
import { AirportRepository } from '../../repositories/airport';
import { UploadService } from '../upload';
import { ErrorHandler } from '../../middlewares/error';

jest.mock('../../repositories/airport');
jest.mock('../upload');

describe('AirportService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an airport successfully', async () => {
      const mockFiles = {
        image: { name: 'airport.jpg', mimetype: 'image/jpeg' },
      };
      const mockData = { code: 'AP123', name: 'Test Airport' };
      const mockUploadResponse = {
        image: { url: 'https://image.url', fileId: '123' },
      };
      const mockCreatedAirport = {
        ...mockData,
        imageUrl: mockUploadResponse.image.url,
        imageId: mockUploadResponse.image.fileId,
      };

      AirportRepository.findByCode.mockResolvedValue(null);
      UploadService.upload.mockResolvedValue(mockUploadResponse);
      AirportRepository.create.mockResolvedValue(mockCreatedAirport);

      const result = await AirportService.create(mockFiles, mockData);

      expect(AirportRepository.findByCode).toHaveBeenCalledWith(mockData.code);
      expect(UploadService.upload).toHaveBeenCalledWith(mockFiles, 'airports', [
        'airport',
      ]);
      expect(AirportRepository.create).toHaveBeenCalledWith({
        ...mockData,
        imageUrl: mockUploadResponse.image.url,
        imageId: mockUploadResponse.image.fileId,
      });
      expect(result).toEqual(mockCreatedAirport);
    });

    it('should throw an error if no file is provided', async () => {
      const mockData = { code: 'AP123', name: 'Test Airport' };

      await expect(AirportService.create({}, mockData)).rejects.toThrowError(
        new ErrorHandler(400, 'no file selected')
      );
    });

    it('should throw an error if airport code already exists', async () => {
      const mockFiles = {
        image: { name: 'airport.jpg', mimetype: 'image/jpeg' },
      };
      const mockData = { code: 'AP123', name: 'Test Airport' };

      AirportRepository.findByCode.mockResolvedValue({ id: 1, ...mockData });

      await expect(
        AirportService.create(mockFiles, mockData)
      ).rejects.toThrowError(
        new ErrorHandler(409, 'Airport code already exists')
      );
    });
  });

  describe('update', () => {
    it('should update an airport successfully and upload a new image', async () => {
      const mockAirport = {
        id: 1,
        code: 'AP123',
        name: 'Test Airport',
        imageId: '123',
      };
      const mockFiles = {
        image: { name: 'updated.jpg', mimetype: 'image/jpeg' },
      };
      const mockData = { name: 'Updated Airport' };
      const mockUploadResponse = {
        image: { url: 'https://updated.url', fileId: '456' },
      };
      const mockUpdatedAirport = {
        ...mockAirport,
        ...mockData,
        imageUrl: mockUploadResponse.image.url,
        imageId: mockUploadResponse.image.fileId,
      };

      AirportRepository.findByID.mockResolvedValue(mockAirport);
      UploadService.delete.mockResolvedValue(true);
      UploadService.upload.mockResolvedValue(mockUploadResponse);
      AirportRepository.update.mockResolvedValue(mockUpdatedAirport);

      const result = await AirportService.update(
        mockAirport.id,
        mockFiles,
        mockData
      );

      expect(UploadService.delete).toHaveBeenCalledWith(mockAirport.imageId);
      expect(UploadService.upload).toHaveBeenCalledWith(mockFiles, 'airports', [
        'airport',
      ]);
      expect(AirportRepository.update).toHaveBeenCalledWith(mockAirport.id, {
        ...mockData,
        imageUrl: mockUploadResponse.image.url,
        imageId: mockUploadResponse.image.fileId,
      });
      expect(result).toEqual(mockUpdatedAirport);
    });

    it('should update an airport successfully without uploading a new image', async () => {
      const mockAirport = {
        id: 1,
        code: 'AP123',
        name: 'Test Airport',
        imageId: '123',
      };
      const mockData = { name: 'Updated Airport' };

      AirportRepository.findByID.mockResolvedValue(mockAirport);
      AirportRepository.update.mockResolvedValue({
        ...mockAirport,
        ...mockData,
      });

      const result = await AirportService.update(mockAirport.id, {}, mockData);

      expect(UploadService.delete).not.toHaveBeenCalled();
      expect(UploadService.upload).not.toHaveBeenCalled();
      expect(AirportRepository.update).toHaveBeenCalledWith(
        mockAirport.id,
        mockData
      );
      expect(result).toEqual({ ...mockAirport, ...mockData });
    });

    it('should throw an error if airport not found', async () => {
      const mockAirportID = 1;
      const mockFiles = {
        image: { name: 'updated.jpg', mimetype: 'image/jpeg' },
      };
      const mockData = { name: 'Updated Airport' };

      AirportRepository.findByID.mockResolvedValue(null);

      await expect(
        AirportService.update(mockAirportID, mockFiles, mockData)
      ).rejects.toThrowError(new ErrorHandler(404, 'Airport not found'));
    });
  });

  describe('delete', () => {
    it('should delete an airport successfully', async () => {
      const mockAirport = { id: 1, name: 'Test Airport', imageId: '123' };

      AirportRepository.findByID.mockResolvedValue(mockAirport);
      AirportRepository.delete.mockResolvedValue(mockAirport);

      const result = await AirportService.delete(mockAirport.id);

      expect(AirportRepository.findByID).toHaveBeenCalledWith(mockAirport.id);
      expect(AirportRepository.delete).toHaveBeenCalledWith(mockAirport.id);
      expect(result).toEqual(mockAirport);
    });

    it('should throw an error if airport not found', async () => {
      const mockAirportID = 1;

      AirportRepository.findByID.mockResolvedValue(null);

      await expect(AirportService.delete(mockAirportID)).rejects.toThrowError(
        new ErrorHandler(404, 'Airport not found')
      );
    });
  });

  describe('findMany', () => {
    it('should retrieve airports with pagination', async () => {
      const mockPagination = { offset: 0, limit: 5 };
      const mockFilter = {};
      const mockSorter = { createdAt: 'desc' };
      const mockAirports = [{ id: 1, name: 'Airport A' }];
      const mockTotalAirports = 10;

      AirportRepository.findMany.mockResolvedValue(mockAirports);
      AirportRepository.count.mockResolvedValue(mockTotalAirports);

      const result = await AirportService.findMany(
        mockPagination,
        mockFilter,
        mockSorter
      );

      expect(AirportRepository.findMany).toHaveBeenCalledWith(
        mockPagination,
        mockFilter,
        mockSorter
      );
      expect(AirportRepository.count).toHaveBeenCalledWith(mockFilter);
      expect(result).toEqual({
        airports: mockAirports,
        totalAirports: mockTotalAirports,
      });
    });
  });

  describe('findByID', () => {
    it('should retrieve an airport by ID', async () => {
      const mockAirport = { id: 1, name: 'Test Airport' };

      AirportRepository.findByID.mockResolvedValue(mockAirport);

      const result = await AirportService.findByID(mockAirport.id);

      expect(AirportRepository.findByID).toHaveBeenCalledWith(mockAirport.id);
      expect(result).toEqual(mockAirport);
    });

    it('should throw an error if airport not found', async () => {
      const mockAirportID = 1;

      AirportRepository.findByID.mockResolvedValue(null);

      await expect(AirportService.findByID(mockAirportID)).rejects.toThrowError(
        new ErrorHandler(404, 'Airport not found')
      );
    });
  });

  describe('findByCode', () => {
    it('should retrieve an airport by code', async () => {
      const mockAirport = { id: 1, code: 'AP123', name: 'Test Airport' };

      AirportRepository.findByCode.mockResolvedValue(mockAirport);

      const result = await AirportService.findByCode(mockAirport.code);

      expect(AirportRepository.findByCode).toHaveBeenCalledWith(
        mockAirport.code
      );
      expect(result).toEqual(mockAirport);
    });

    it('should throw an error if airport not found', async () => {
      const mockAirportCode = 'AP123';

      AirportRepository.findByCode.mockResolvedValue(null);

      await expect(
        AirportService.findByCode(mockAirportCode)
      ).rejects.toThrowError(new ErrorHandler(404, 'Airport not found'));
    });
  });
});
