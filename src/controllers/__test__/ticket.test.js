import { TicketController } from './../ticket.js';
import { ErrorHandler } from './../../middlewares/error.js';
import { TicketService } from './../../services/ticket.js';
// Mock the TicketService
jest.mock('./../../services/ticket.js');

describe('TicketController', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    // Reset mocks before each test
    mockReq = {
      params: {},
      body: {},
    };
    mockRes = {
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('create', () => {
    const mockQRTickets = [
      {
        passenger: {
          name: 'Anak',
          familyName: 'Jago',
          type: 'ADULT',
        },
        qrCodeImage: 'data:image/png;base64,...',
        booking: {
          id: 10,
          code: '2411030282',
          flight: {
            // flight details
          },
        },
      },
    ];

    it('should successfully create QR tickets', async () => {
      // Arrange
      mockReq.params.bookingID = '10';
      TicketService.create.mockResolvedValue(mockQRTickets);

      // Act
      await TicketController.create(mockReq, mockRes, mockNext);

      // Assert
      expect(TicketService.create).toHaveBeenCalledWith(10);
      expect(mockRes.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'QR Ticket generated successfully',
        },
        data: mockQRTickets,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle invalid booking ID', async () => {
      // Arrange
      mockReq.params.bookingID = 'invalid';

      // Act
      await TicketController.create(mockReq, mockRes, mockNext);

      // Assert
      expect(TicketService.create).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(ErrorHandler));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
      expect(mockNext.mock.calls[0][0].message).toBe(
        'invalid booking ID value'
      );
    });

    it('should handle service errors', async () => {
      // Arrange
      mockReq.params.bookingID = '10';
      const error = new Error('Service error');
      TicketService.create.mockRejectedValue(error);

      // Act
      await TicketController.create(mockReq, mockRes, mockNext);

      // Assert
      expect(TicketService.create).toHaveBeenCalledWith(10);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('validate', () => {
    const mockQRCodeData = {
      bookingCode: '2411030282',
      passengerName: 'Anak Jago',
    };

    const mockValidationResult = {
      isValid: true,
      ticketDetails: {
        booking: {
          code: '2411030282',
          passenger: {
            name: 'Anak',
            familyName: 'Jago',
          },
        },
      },
    };

    it('should successfully validate QR tickets', async () => {
      // Arrange
      mockReq.body = mockQRCodeData;
      TicketService.validate.mockResolvedValue(mockValidationResult);

      // Act
      await TicketController.validate(mockReq, mockRes, mockNext);

      // Assert
      expect(TicketService.validate).toHaveBeenCalledWith(mockQRCodeData);
      expect(mockRes.json).toHaveBeenCalledWith({
        meta: {
          statusCode: 200,
          message: 'QR Ticket validate successfully',
        },
        data: mockValidationResult,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle validation service errors', async () => {
      // Arrange
      mockReq.body = mockQRCodeData;
      const error = new Error('Validation error');
      TicketService.validate.mockRejectedValue(error);

      // Act
      await TicketController.validate(mockReq, mockRes, mockNext);

      // Assert
      expect(TicketService.validate).toHaveBeenCalledWith(mockQRCodeData);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
