import { AuthService } from '../services/auth.js';
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

      const token = await AuthService.register(
        firstName,
        lastName,
        phone,
        email,
        password
      );

      return res.json({
        meta: {
          statusCode: 201,
          message: "user has created, let's verify",
        },
        data: {
          redirect: `/api/v1/auth/verify?token=${token}`,
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

  static async OTP(req, res, next) {
    try {
      await AuthService.otp(req.body.token);
      res.json({
        meta: {
          statusCode: 200,
          message: 'OTP sent',
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
      const { otp, token } = req.body;
      await AuthService.verify(otp, token);
      res.json({
        meta: {
          statusCode: 200,
          message: 'User has been verified',
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
}
