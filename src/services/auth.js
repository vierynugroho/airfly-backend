import { ErrorHandler } from "../middlewares/error.js";
import { JWT } from "../utils/jwt.js";
import { AuthRepository } from "../repositories/auth.js";
import { Bcrypt } from "../utils/bcrypt.js";

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
      throw new ErrorHandler(404, "user is not registered");
    }

    const comparePassword = Bcrypt.compare(password, user.password);

    if (!comparePassword) {
      throw new ErrorHandler(401, "wrong credential");
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
      throw new ErrorHandler(409, "email has registered");
    }

    if (user) {
      await AuthRepository.update(
        firstName,
        lastName,
        phone,
        password,
        user.id,
      );
    } else {
      newUser = await AuthRepository.newUser(
        firstName,
        lastName,
        phone,
        email,
        password,
      );
    }

    const id = newUser?.id || user?.id;
    const token = JWT.sign(id);

    await AuthRepository.setSecretKey(token, id);

    return token;
  }
}
