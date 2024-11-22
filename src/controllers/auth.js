import { AuthService } from '../services/auth.js';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export class AuthController {
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
}
