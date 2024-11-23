import { AuthService } from "../services/auth.js";
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
          message: "login successfully",
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
        password,
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
          message: "OTP sent",
        },
      });
    } catch (e) {
      next(e);
    }
  }
}
