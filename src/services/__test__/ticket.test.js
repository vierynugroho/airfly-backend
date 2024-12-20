import { TicketService } from '../ticket.js';
import { TicketRepository } from '../../repositories/ticket.js';
import * as QRCode from 'qrcode';

jest.mock('../../repositories/ticket.js');
jest.mock('qrcode');

describe('TicketService', () => {
  describe('generateQR', () => {
    it('should generate a QR code successfully', async () => {
      const mockTicketData = { id: 1, name: 'Test Ticket' };
      const mockQRCodeImage = 'data:image/png;base64,mockQRCode';

      QRCode.toDataURL.mockResolvedValue(mockQRCodeImage);

      const result = await TicketService.generateQR(mockTicketData);

      expect(QRCode.toDataURL).toHaveBeenCalledWith(
        JSON.stringify(mockTicketData)
      );
      expect(result).toBe(mockQRCodeImage);
    });

    it('should throw an error if QR code generation fails', async () => {
      const mockTicketData = { id: 1, name: 'Test Ticket' };
      const mockError = new Error('QR code generation error');

      QRCode.toDataURL.mockRejectedValue(mockError);

      await expect(TicketService.generateQR(mockTicketData)).rejects.toThrow(
        'Failed to generate QR Code: QR code generation error'
      );
    });
  });

  describe('create', () => {
    it('should create QR codes for booking details', async () => {
      const mockBookingID = '12345';
      const mockBooking = {
        id: mockBookingID,
        flightId: 'FL001',
        returnFlightId: 'FL002',
        bookingDate: '2024-12-01',
        code: 'ABC123',
        bookingDetail: [{ id: 'BD001', passengerId: 'P001', seatId: 'S001' }],
      };

      const mockQRCodeImage = 'data:image/png;base64,mockQRCode';

      TicketRepository.findBoking.mockResolvedValue(mockBooking);
      QRCode.toDataURL.mockResolvedValue(mockQRCodeImage);
      TicketRepository.updateQRCode.mockResolvedValue({ success: true });

      const result = await TicketService.create(mockBookingID);

      expect(TicketRepository.findBoking).toHaveBeenCalledWith(mockBookingID);
      expect(QRCode.toDataURL).toHaveBeenCalled();
      expect(TicketRepository.updateQRCode).toHaveBeenCalledWith(
        mockBookingID,
        'BD001',
        mockQRCodeImage,
        expect.any(String)
      );
      expect(result).toEqual([{ success: true }]);
    });

    it('should throw an error if booking is not found', async () => {
      const mockBookingID = '12345';

      TicketRepository.findBoking.mockResolvedValue(null);

      await expect(TicketService.create(mockBookingID)).rejects.toThrow(
        'flight ticket data not found or payment not yet paid'
      );
    });
  });

  describe('validate', () => {
    it('should validate a ticket successfully', async () => {
      const mockQRCodeData = {
        QRCodeData: {
          bookingDetailID: 'BD001',
          bookingID: '12345',
          uniqueToken: 'mockToken123',
        },
      };

      const mockTicket = { id: 'T001', valid: true };

      TicketRepository.validateQRCode.mockResolvedValue(mockTicket);

      const result = await TicketService.validate(mockQRCodeData);

      expect(TicketRepository.validateQRCode).toHaveBeenCalledWith(
        '12345',
        'BD001',
        'mockToken123'
      );
      expect(result).toBe(mockTicket);
    });

    it('should throw an error if ticket validation fails', async () => {
      const mockQRCodeData = {
        QRCodeData: {
          bookingDetailID: 'BD001',
          bookingID: '12345',
          uniqueToken: 'mockToken123',
        },
      };

      TicketRepository.validateQRCode.mockResolvedValue(null);

      await expect(TicketService.validate(mockQRCodeData)).rejects.toThrow(
        'invalid ticket'
      );
    });
  });
});
