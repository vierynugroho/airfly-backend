import { ErrorHandler } from '../middlewares/error.js';
import { UserRepository } from '../repositories/user.js';

export class UserService {
  static async getAll(pagination, filter) {
    const users = await UserRepository.findMany(pagination, filter);
    const totalUsers = await UserRepository.count(filter);

    users.map((user) => {
      delete user.password;
      delete user.otpToken;
      delete user.secretKey;
    });

    return { users, totalUsers };
  }

  static async getByID(userID) {
    const user = await UserRepository.findByID(userID);

    if (!user) {
      throw new ErrorHandler(404, 'user is not found');
    }

    delete user.password;
    delete user.otpToken;
    delete user.secretKey;

    return user;
  }

  static async update(userID, data) {
    const user = await UserRepository.findByID(userID);

    if (!user) {
      throw new ErrorHandler(404, 'user is not found');
    }

    const updatedUser = await UserRepository.update(userID, data);
    delete updatedUser.password;
    delete updatedUser.otpToken;
    delete updatedUser.secretKey;

    return updatedUser;
  }

  static async delete(userID) {
    const user = await UserRepository.findByID(userID);

    if (!user) {
      throw new ErrorHandler(404, 'user is not found');
    }

    const deleteduser = await UserRepository.delete(userID);

    return deleteduser;
  }
}
