import * as OTPAuth from 'otpauth';
import dotenv from 'dotenv';

dotenv.config();

const totp = new OTPAuth.TOTP({
  issuer: 'ACME',
  label: 'Alice',
  algorithm: 'SHA256',
  digits: 6,
  period: 60 * 5,
  secret: process.env.JWT_SECRET,
});

export function generate() {
  return totp.generate();
}

export function validate(otp_token) {
  return totp.validate({ otp_token, window: 1 });
}
