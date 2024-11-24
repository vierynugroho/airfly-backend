import * as OTPAuth from 'otpauth';
import dotenv from 'dotenv';

dotenv.config();

const OTP_CONFIG = {
  algorithm: 'SHA-256',
  digits: 6,
  period: 60 * 5,
  issuer: 'TIKETKU',
  label: 'otp-user',
};

export function generate(secret) {
  const totp = new OTPAuth.TOTP({
    ...OTP_CONFIG,
    secret,
  });
  return totp.generate();
}

export function validate(token, secret) {
  const totp = new OTPAuth.TOTP({
    ...OTP_CONFIG,
    secret,
  });
  return totp.validate({ token });
}
