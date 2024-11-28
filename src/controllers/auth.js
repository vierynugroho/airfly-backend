import { AuthService } from '../services/auth.js';
import { UserService } from '../services/user.js';

export class AuthController {
  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const token = await AuthService.auth(email, password);

      return res.json({
        meta: {
          statusCode: 200,
          message: 'login successfully',
        },
        data: {
          token,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async register(req, res, next) {
    try {
      const { firstName, lastName, phone, email, password } = req.body;

      await AuthService.register(firstName, lastName, phone, email, password);

      return res.json({
        meta: {
          statusCode: 201,
          message: "user has created, let's verify",
        },
      });
    } catch (e) {
      next(e);
    }
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */

  static async verify(req, res, next) {
    try {
      const { otp, email } = req.body;
      const verify = await AuthService.verify(otp, email);
      res.json({
        meta: {
          statusCode: 200,
          message:
            verify == 'VERIFIED' ? 'user has been verified' : 'OTP is valid',
        },
      });
    } catch (e) {
      next(e);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const { email, otp, password } = req.body;

      await AuthService.resetPassword(email, otp, password);

      res.json({
        meta: {
          statusCode: 200,
          message: 'Password has been reset',
        },
      });
    } catch (e) {
      next(e);
    }
  }

  static async sendResetOtp(req, res, next) {
    try {
      const { email } = req.body;
      await AuthService.sendResetOtp(email);
      res.json({
        meta: {
          statusCode: 200,
          message: 'OTP has been sent',
        },
      });
    } catch (e) {
      next(e);
    }
  }

  static async getUserLoggedIn(req, res, next) {
    try {
      const userID = parseInt(req.user.id);

      if (isNaN(userID)) {
        throw new ErrorHandler(422, 'user ID is not a number');
      }

      const user = await UserService.getByID(userID);

      res.json({
        meta: {
          statusCode: 200,
          message: 'user logged in data retrieved successfully',
        },
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}
