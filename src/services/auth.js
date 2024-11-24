import { ErrorHandler } from '../middlewares/error.js';
import { JWT } from '../utils/jwt.js';
import { AuthRepository } from '../repositories/auth.js';
import { Bcrypt } from '../utils/bcrypt.js';
import { sendOTP } from '../utils/email.js';
import { generate, validate } from '../utils/otp.js';

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

    const comparePassword = Bcrypt.compare(password, user.password);

    if (!comparePassword) {
      throw new ErrorHandler(401, 'wrong credential');
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
    const token = JWT.sign(id);

    await AuthRepository.setSecretKey(token, id);

    return token;
  }

  static async otp(token) {
    const jwtVerify = JWT.verify(token);
    const user = await AuthRepository.findUserById(jwtVerify.id);

    if (user.secretKey != token) {
      throw new ErrorHandler(400, 'invalid token');
    }

    const otp_token = generate(
      Buffer.from(user.id.toString()).toString('base64')
    );

    AuthRepository.setOtp(otp_token, user.id);
    console.log(otp_token);
    await sendOTP(otp_token, user.email, `${user.firstName} ${user.lastName}`);
  }

  static async verify(otp, token) {
    const jwtVerify = JWT.verify(token);
    const isValid = validate(
      otp,
      Buffer.from(jwtVerify.id.toString()).toString('base64')
    );

    console.log(isValid);

    if (isValid === null) {
      throw new ErrorHandler(400, 'Invalid OTP');
    }

    const user = await AuthRepository.getUserBySecret(token);

    if (!user) {
      throw new ErrorHandler(404, 'User not registered');
    }

    await AuthRepository.setUserVerified(parseInt(jwtVerify.id));
  }
}
