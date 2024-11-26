import { JWT } from '../utils/jwt.js';
import { ErrorHandler } from './error.js';
import { AuthRepository } from '../repositories/auth.js';

/**
 * https://github.com/vierynugroho/F-BEE24001186-km7-vn-banking_system-ch2/blob/main/src/middlewares/authentication.js
 * https://github.com/vierynugroho/F-BEE24001186-km7-vn-banking_system-ch2/blob/main/src/middlewares/checkRole.js
 * https://euphoric-world-440804-k1.et.r.appspot.com/api/v1/docs/#/users/get_users
 */

/**
 *
 * @param {string} role
 */

export function authorization(role) {
  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  return async (req, res, next) => {
    try {
      const authorization = req.headers.authorization;
      if (!authorization) {
        throw new ErrorHandler(401, 'unauthorized');
      }
      const bearer = authorization.replace('Bearer ', '');

      const jwtVerify = JWT.verify(bearer);

      if (!jwtVerify) {
        throw new ErrorHandler(403, 'invalid token');
      }

      const user = await AuthRepository.findUserById(parseInt(jwtVerify.id));

      if (user.role != role) {
        throw new ErrorHandler(403, 'forbidden, Go Back ! >:(');
      }

      req.user = {
        id: jwtVerify.id,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}
