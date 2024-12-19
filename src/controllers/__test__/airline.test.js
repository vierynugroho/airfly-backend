import { AirlineController } from '../airline.js';
import { AirlineService } from '../../services/airline.js';

jest.mock('./../../services/airline.js'); // Mock AirlineService

describe('AirlineController', () => {
  let res;
  let next;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all airlines successfully', async () => {
      const req = { query: { page: '1', limit: '2' } };
      const mockAirlines = [
        { id: 1, name: 'Airline A' },
        { id: 2, name: 'Airline B' },
      ];

      AirlineService.findMany.mockResolvedValue({
        airlines: mockAirlines,
        totalAirlines: 10,
      });

      await AirlineController.getAll(req, res, next);

      expect(AirlineService.findMany).toHaveBeenCalledWith({
        offset: 0,
        limit: 2,
      });
      expect(res.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'Airlines fetched successfully',
          pagination: {
            totalPage: 5,
            currentPage: 1,
            pageItems: 2,
            nextPage: 2,
            prevPage: null,
          },
        },
        data: mockAirlines,
      });
    });

    it('should handle errors properly', async () => {
      const req = { query: {} };
      const error = new Error('Database error');

      AirlineService.findMany.mockRejectedValue(error);

      await AirlineController.getAll(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('create', () => {
    it('should create an airline successfully', async () => {
      const req = { body: { name: 'Airline A' }, files: {} };
      const mockAirline = { id: 1, name: 'Airline A' };

      AirlineService.create.mockResolvedValue(mockAirline);

      await AirlineController.create(req, res, next);

      expect(AirlineService.create).toHaveBeenCalledWith(req.files, req.body);
      expect(res.json).toHaveBeenCalledWith({
        meta: { statusCode: 201, message: 'Airline created successfully' },
        data: mockAirline,
      });
    });

    it('should handle errors properly', async () => {
      const req = { body: {}, files: {} };
      const error = new Error('Validation error');

      AirlineService.create.mockRejectedValue(error);

      await AirlineController.create(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getByID', () => {
    it('should fetch an airline by ID', async () => {
      const req = { params: { id: '1' } };
      const mockAirline = { id: 1, name: 'Airline A' };

      AirlineService.findByID.mockResolvedValue(mockAirline);

      await AirlineController.getByID(req, res, next);

      expect(AirlineService.findByID).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith({
        meta: { statusCode: 200, message: 'Airline fetched successfully' },
        data: mockAirline,
      });
    });

    it('should return 404 if airline is not found', async () => {
      const req = { params: { id: '999' } };

      AirlineService.findByID.mockResolvedValue(null);

      await AirlineController.getByID(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        meta: { statusCode: 404, message: 'Airline not found' },
      });
    });

    it('should handle errors properly', async () => {
      const req = { params: { id: 'invalid' } };
      const error = new Error('Database error');

      AirlineService.findByID.mockRejectedValue(error);

      await AirlineController.getByID(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('update', () => {
    it('should update an airline successfully', async () => {
      const req = {
        params: { id: '1' },
        body: { name: 'Airline B' },
        files: {},
      };
      const mockAirline = { id: 1, name: 'Airline B' };

      AirlineService.update.mockResolvedValue(mockAirline);

      await AirlineController.update(req, res, next);

      expect(AirlineService.update).toHaveBeenCalledWith(
        1,
        req.files,
        req.body
      );
      expect(res.json).toHaveBeenCalledWith({
        meta: { statusCode: 200, message: 'Airline updated successfully' },
        data: mockAirline,
      });
    });

    it('should handle invalid airline ID', async () => {
      const req = { params: { id: 'invalid' }, body: {}, files: {} };

      await AirlineController.update(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 422,
          message: 'airline ID is not a number',
        })
      );
    });

    it('should handle errors properly', async () => {
      const req = { params: { id: '1' }, body: {}, files: {} };
      const error = new Error('Database error');

      AirlineService.update.mockRejectedValue(error);

      await AirlineController.update(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('delete', () => {
    it('should delete an airline successfully', async () => {
      const req = { params: { id: '1' } };
      const mockAirline = { id: 1, name: 'Airline A' };

      AirlineService.delete.mockResolvedValue(mockAirline);

      await AirlineController.delete(req, res, next);

      expect(AirlineService.delete).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({
        meta: { statusCode: 200, message: 'Airline deleted successfully' },
        data: mockAirline,
      });
    });

    it('should handle invalid airline ID', async () => {
      const req = { params: { id: 'invalid' } };

      await AirlineController.delete(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 422,
          message: 'airline ID is not a number',
        })
      );
    });

    it('should handle errors properly', async () => {
      const req = { params: { id: '1' } };
      const error = new Error('Database error');

      AirlineService.delete.mockRejectedValue(error);

      await AirlineController.delete(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
