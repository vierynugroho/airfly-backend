import * as OTPAuth from 'otpauth';
import { generate, validate } from '../otp.js'; // Adjust the path if needed

jest.mock('otpauth');

describe('OTP Functions', () => {
  const mockSecret = 'mocksecret';
  const mockToken = '123456';
  const mockTOTP = {
    generate: jest.fn(),
    validate: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('generate', () => {
    it('should generate an OTP using the provided secret', () => {
      const spy = jest
        .spyOn(OTPAuth, 'TOTP')
        .mockImplementation(() => mockTOTP);
      mockTOTP.generate.mockReturnValue(mockToken);

      const result = generate(mockSecret);

      expect(result).toBe(mockToken);
      spy.mockRestore();
    });
  });

  describe('validate', () => {
    it('should validate the OTP using the provided token and secret', () => {
      const spy = jest
        .spyOn(OTPAuth, 'TOTP')
        .mockImplementation(() => mockTOTP);
      mockTOTP.validate.mockReturnValue(0);

      const result = validate(mockToken, mockSecret);

      expect(result).toBe(0);
      spy.mockRestore();
    });
  });
});
