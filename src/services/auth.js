import { ErrorHandler } from '../middlewares/error.js';
import { JWT } from '../utils/jwt.js';
import { AuthRepository } from '../repositories/auth.js';
import { Bcrypt } from '../utils/bcrypt.js';
import { sendOTP } from '../utils/email.js';
import { generate, validate } from '../utils/otp.js';
import { UserStatus } from '@prisma/client';

export class AuthService {
  /**
   *
   * @param {string} email
   * @param {string} password
   *
   * @returns {Promise<string|null>}
   */
  static async auth(email, password) {
    const user = await AuthRepository.findByEmail(email);

    if (!user) {
      throw new ErrorHandler(404, 'user is not registered');
    }

    const comparePassword = await Bcrypt.compare(password, user.password);

    if (!comparePassword) {
      throw new ErrorHandler(401, 'wrong credential');
    }

    if (user.status != (await AuthRepository.getUserStatusEnum()).VERIFIED) {
      throw new ErrorHandler(403, 'user not verified');
    }

    const token = JWT.sign(user.id);

    return token;
  }

  /**
   *
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} phone
   * @param {string} email
   * @param {string} password
   */

  static async register(firstName, lastName, phone, email, password) {
    const user = await AuthRepository.findByEmail(email);
    const userStatus = await AuthRepository.getUserStatusEnum();

    let newUser;

    if (user && user.status == userStatus.VERIFIED) {
      throw new ErrorHandler(409, 'email has registered');
    }

    if (user) {
      await AuthRepository.update(
        firstName,
        lastName,
        phone,
        password,
        user.id
      );
    } else {
      newUser = await AuthRepository.newUser(
        firstName,
        lastName,
        phone,
        email,
        password
      );
    }

    const id = newUser?.id || user?.id;
    const otp = generate(Buffer.from(id.toString()).toString('base64'));

    await sendOTP(otp, email, `${firstName} ${lastName}`);
  }

  static async verify(otp, email) {
    const user = await AuthRepository.findByEmail(email);
    if (!user) {
      throw new ErrorHandler(404, 'User not registered');
    }

    const isValid = validate(
      otp,
      Buffer.from(user.id.toString()).toString('base64')
    );

    if (isValid === null) {
      throw new ErrorHandler(400, 'Invalid OTP');
    }

    if (user.status == UserStatus.UNVERIFIED) {
      await AuthRepository.setUserVerified(parseInt(user.id));
      return 'VERIFIED';
    }
    return 'VALIDATE';
  }

  static async sendResetOtp(email) {
    const user = await AuthRepository.findByEmail(email);
    if (!user) {
      throw new ErrorHandler(404, 'User not found');
    }
    const otp_token = generate(
      Buffer.from(user.id.toString()).toString('base64')
    );

    await AuthRepository.setOtp(otp_token, user.id);
    await sendOTP(otp_token, user.email, `${user.firstName} ${user.lastName}`);
  }

  static async resetPassword(email, otp, password) {
    const user = await AuthRepository.findByEmail(email);
    const isValid = validate(
      otp,
      Buffer.from(user.id.toString()).toString('base64')
    );

    if (isValid == null) {
      throw new ErrorHandler(400, 'Invalid OTP Code 1');
    }

    if (user.otpToken != otp) {
      throw new ErrorHandler(400, 'Invalid OTP Code');
    }

    await AuthRepository.setNewPassword(user.id, password);
  }

  static async googleLogin(access_token) {
    const { email, given_name, family_name } =
      await AuthRepository.googleLogin(access_token);

    let user = await AuthRepository.findByEmail(email);
    if (!user) {
      user = await AuthRepository.newGoogleUser(
        given_name,
        family_name,
        '',
        email,
        '',
      );
    }

    const token = JWT.sign(user.id);
    delete user.password;
    delete user.secretKey;
    delete user.otpToken;
    delete user.phone;

    return { user, token };
  }
}
