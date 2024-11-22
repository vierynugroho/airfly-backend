import bcrypt from 'bcrypt';

export class Bcrypt {
	static compare(password, encryptedPassword) {
		return bcrypt.compare(password, encryptedPassword);
	}

	static hash(plainTextPassword) {
		const hashed = bcrypt.hash(plainTextPassword, 10);
		return hashed;
	}
}
