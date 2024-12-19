import { AirportController } from '../airport.js';
import { AirportService } from '../../services/airport.js';

jest.mock('../../services/airport.js');

describe('AirportController', () => {
  let mockReq, mockRes, mockNext;

  const setupMocks = (body = {}, params = {}, query = {}, files = {}) => {
    mockReq = { body, params, query, files };
    mockRes = {
      json: jest.fn(),
    };
    mockNext = jest.fn();
  };

  beforeEach(() => {
    setupMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const testErrorHandling = async (methodName, error) => {
    jest.spyOn(AirportService, methodName).mockRejectedValue(error);

    await AirportController[methodName](mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  };

  describe('create', () => {
    it('should create an airport successfully', async () => {
      const mockAirport = { id: 1, name: 'Test Airport' };
      jest.spyOn(AirportService, 'create').mockResolvedValue(mockAirport);

      await AirportController.create(mockReq, mockRes, mockNext);

      expect(AirportService.create).toHaveBeenCalledWith(mockReq.files, mockReq.body);
      expect(mockRes.json).toHaveBeenCalledWith({
        meta: { statusCode: 200, message: 'Airport created successfully' },
        data: mockAirport,
      });
    });

    it('should handle errors when creating an airport', async () => {
      const error = new Error('Service error');
      await testErrorHandling('create', error);
    });
  });

  describe('update', () => {
    it('should update an airport successfully', async () => {
      const mockAirport = { id: 1, name: 'Updated Airport' };
      mockReq.params.id = '1';
      jest.spyOn(AirportService, 'update').mockResolvedValue(mockAirport);

      await AirportController.update(mockReq, mockRes, mockNext);

      expect(AirportService.update).toHaveBeenCalledWith(1, mockReq.files, mockReq.body);
      expect(mockRes.json).toHaveBeenCalledWith({
        meta: { statusCode: 200, message: 'Airport updated successfully' },
        data: mockAirport,
      });
    });

    it.each(['invalid', null, undefined])(
      'should handle invalid airport ID in update',
      async (invalidID) => {
        mockReq.params.id = invalidID;

        await AirportController.update(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
          expect.objectContaining({ statusCode: 422, message: 'Airport ID is not a number' })
        );
      }
    );

    it('should handle errors when updating an airport', async () => {
      const error = new Error('Service error');
      mockReq.params.id = '1';
      await testErrorHandling('update', error);
    });
  });

  describe('delete', () => {
    it('should delete an airport successfully', async () => {
      const mockAirport = { id: 1, name: 'Deleted Airport' };
      mockReq.params.id = '1';
      jest.spyOn(AirportService, 'delete').mockResolvedValue(mockAirport);

      await AirportController.delete(mockReq, mockRes, mockNext);

      expect(AirportService.delete).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith({
        meta: { statusCode: 200, message: 'Airport deleted successfully' },
        data: mockAirport,
      });
    });

    it('should handle invalid airport ID in delete', async () => {
      mockReq.params.id = 'invalid';
      await AirportController.delete(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 422, message: 'Airport ID is not a number' })
      );
    });

    it('should handle errors when deleting an airport', async () => {
      const error = new Error('Service error');
      mockReq.params.id = '1';
      await testErrorHandling('delete', error);
    });
  });

  describe('getAll', () => {
    it('should handle filter queries for name, city, state, and country', async () => {
        mockReq.query = {
          name: 'Airport',
          city: 'CityName',
          state: 'StateName',
          country: 'CountryName',
        };
    
        const mockAirports = [{ id: 1, name: 'Sample Airport' }];
        jest.spyOn(AirportService, 'findMany').mockResolvedValue({ airports: mockAirports, totalAirports: 1 });
    
        await AirportController.getAll(mockReq, mockRes, mockNext);
    
        expect(AirportService.findMany).toHaveBeenCalledWith(
          expect.any(Object), // Pagination
          {
            name: { contains: 'Airport', mode: 'insensitive' },
            city: { contains: 'CityName', mode: 'insensitive' },
            state: { contains: 'StateName', mode: 'insensitive' },
            country: { contains: 'CountryName', mode: 'insensitive' },
          },
          expect.any(Object)
        );
      });
    
      it('should apply sorting based on valid sortBy and order', async () => {
        mockReq.query = {
          sortBy: 'name',
          order: 'desc',
        };
    
        const mockAirports = [{ id: 1, name: 'Sample Airport' }];
        jest.spyOn(AirportService, 'findMany').mockResolvedValue({ airports: mockAirports, totalAirports: 1 });
    
        await AirportController.getAll(mockReq, mockRes, mockNext);
    
        expect(AirportService.findMany).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { name: 'desc' } 
        );
      });
    
      it('should apply default sorting if sortBy is invalid', async () => {
        mockReq.query = {
          sortBy: 'invalidField',  
          order: 'asc',
        };
    
        const mockAirports = [{ id: 1, name: 'Sample Airport' }];
        jest.spyOn(AirportService, 'findMany').mockResolvedValue({ airports: mockAirports, totalAirports: 1 });
    
        await AirportController.getAll(mockReq, mockRes, mockNext);
    
        expect(AirportService.findMany).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { createdAt: 'desc' }
        );
      });
    
      it('should apply default sorting if order is invalid', async () => {
        mockReq.query = {
          sortBy: 'name',
          order: 'invalid',
        };
    
        const mockAirports = [{ id: 1, name: 'Sample Airport' }];
        jest.spyOn(AirportService, 'findMany').mockResolvedValue({ airports: mockAirports, totalAirports: 1 });
    
        await AirportController.getAll(mockReq, mockRes, mockNext);
    
        expect(AirportService.findMany).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          { name: 'asc' } 
        );
      });
    
      it('should return paginated results in response', async () => {
        mockReq.query = { page: '2', limit: '5' };
    
        const mockAirports = [{ id: 1, name: 'Sample Airport' }];
        const totalAirports = 10;
        jest.spyOn(AirportService, 'findMany').mockResolvedValue({ airports: mockAirports, totalAirports });
    
        await AirportController.getAll(mockReq, mockRes, mockNext);
    
        expect(mockRes.json).toHaveBeenCalledWith({
          meta: {
            statusCode: 200,
            message: 'Airports data retrieved successfully',
            pagination: {
              totalPage: Math.ceil(totalAirports / 5),
              currentPage: 2,
              pageItems: mockAirports.length,
              nextPage: null,
              prevPage: 1,
            },
          },
          data: mockAirports,
        });
      });
    
      it('should return nextPage as null when on last page', async () => {
        mockReq.query = { page: '2', limit: '5' };
    
        const mockAirports = [{ id: 1, name: 'Sample Airport' }];
        const totalAirports = 10;
        jest.spyOn(AirportService, 'findMany').mockResolvedValue({ airports: mockAirports, totalAirports });
    
        await AirportController.getAll(mockReq, mockRes, mockNext);
    
        expect(mockRes.json).toHaveBeenCalledWith({
          meta: {
            statusCode: 200,
            message: 'Airports data retrieved successfully',
            pagination: {
              totalPage: Math.ceil(totalAirports / 5),
              currentPage: 2,
              pageItems: mockAirports.length,
              nextPage: null,                        
              prevPage: 1,                     
            },
          },
          data: mockAirports,
        });
      });
    
      it('should return prevPage correctly when not on first page', async () => {
        mockReq.query = { page: '2', limit: '5' };
    
        const mockAirports = [{ id: 1, name: 'Sample Airport' }];
        const totalAirports = 10;
        jest.spyOn(AirportService, 'findMany').mockResolvedValue({ airports: mockAirports, totalAirports });
    
        await AirportController.getAll(mockReq, mockRes, mockNext);
    
        expect(mockRes.json).toHaveBeenCalledWith({
          meta: {
            statusCode: 200,
            message: 'Airports data retrieved successfully',
            pagination: {
              totalPage: Math.ceil(totalAirports / 5),  
              currentPage: 2,                          
              pageItems: mockAirports.length,       
              nextPage: null,              
              prevPage: 1,  
            },
          },
          data: mockAirports,
        });
      });
    
      it('should return prevPage as null when on first page', async () => {
        mockReq.query = { page: '1', limit: '5' };  
    
        const mockAirports = [{ id: 1, name: 'Sample Airport' }];
        const totalAirports = 10;
        jest.spyOn(AirportService, 'findMany').mockResolvedValue({ airports: mockAirports, totalAirports });
    
        await AirportController.getAll(mockReq, mockRes, mockNext);
    
        expect(mockRes.json).toHaveBeenCalledWith({
          meta: {
            statusCode: 200,
            message: 'Airports data retrieved successfully',
            pagination: {
              totalPage: Math.ceil(totalAirports / 5), 
              currentPage: 1,   
              pageItems: mockAirports.length, 
              nextPage: 2,  
              prevPage: null,
            },
          },
          data: mockAirports,
        });
      });
    
      it('should handle errors when retrieving airports', async () => {
        const error = new Error('Database error');
        jest.spyOn(AirportService, 'findMany').mockRejectedValue(error);
    
        await AirportController.getAll(mockReq, mockRes, mockNext);
    
        expect(mockNext).toHaveBeenCalledWith(error);
      });
  });

  describe('getByID', () => {
    it('should retrieve an airport by ID successfully', async () => {
      const mockAirport = { id: 1, name: 'Sample Airport' };
      mockReq.params.id = 1;

      jest.spyOn(AirportService, 'findByID').mockResolvedValue(mockAirport);

      await AirportController.getByID(mockReq, mockRes, mockNext);

      expect(AirportService.findByID).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith({
        meta: { statusCode: 200, message: 'Airport data retrieved successfully' },
        data: mockAirport,
      });
    });

    it('should handle invalid airport ID in getByID', async () => {
      mockReq.params.id = 999;

      jest.spyOn(AirportService, 'findByID').mockResolvedValue(null);

      await AirportController.getByID(mockReq, mockRes, mockNext);

      expect(AirportService.findByID).toHaveBeenCalledWith(999);
      expect(mockRes.json).toHaveBeenCalledWith({
        meta: { statusCode: 200, message: 'Airport data retrieved successfully' },
        data: null,
      });
    });

    it('should handle invalid airport ID in getByID', async () => {
      mockReq.params = { id: 'invalid' };
        
      await AirportController.getByID(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 422, message: 'Airport ID is not a number' })
      );
    });

    it('should handle errors when retrieving an airport by ID', async () => {
      const error = new Error('Database error');
      mockReq.params.id = 1;

      jest.spyOn(AirportService, 'findByID').mockRejectedValue(error);

      await AirportController.getByID(mockReq, mockRes, mockNext);

      expect(AirportService.findByID).toHaveBeenCalledWith(1);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
