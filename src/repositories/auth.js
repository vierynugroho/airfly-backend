import { prisma } from '../database/db.js';

export class AuthRepository {
	static async findByEmail(email) {
		const user = await prisma.user.findFirst({
			where: {
				email,
			},
		});

		return user;
	}
}
