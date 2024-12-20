import { AdminController } from './../admin.js';
import { AdminService } from './../../services/admin.js';

jest.mock('./../../services/admin.js'); // Mock the service

describe('AdminController', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {}; // Mock request object
    res = {
      json: jest.fn(), // Mock json response method
    };
    next = jest.fn(); // Mock next middleware function
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('count', () => {
    it('should return count data with status 200', async () => {
      const mockCountData = { users: 10, products: 20 }; // Example data
      AdminService.count.mockResolvedValue(mockCountData);

      await AdminController.count(req, res, next);

      expect(AdminService.count).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'Count fetch success',
        },
        data: mockCountData,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if service throws error', async () => {
      const mockError = new Error('Service error');
      AdminService.count.mockRejectedValue(mockError);

      await AdminController.count(req, res, next);

      expect(AdminService.count).toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });

    it('should handle empty count data gracefully', async () => {
      AdminService.count.mockResolvedValue({}); // Empty object

      await AdminController.count(req, res, next);

      expect(AdminService.count).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'Count fetch success',
        },
        data: {}, // Expect empty object in response
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
