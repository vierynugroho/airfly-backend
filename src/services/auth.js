import { ErrorHandler } from '../middlewares/error.js';
import { JWT } from '../utils/jwt.js';
import { AuthRepository } from '../repositories/auth.js';
import { Bcrypt } from '../utils/bcrypt.js';

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
}
