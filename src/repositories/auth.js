import { prisma } from "../database/db.js";
import { UserStatus, UserRole } from "@prisma/client";
import { Bcrypt } from "../utils/bcrypt.js";

export class AuthRepository {
  /**
   * @param {string} email
   */
  static async findByEmail(email) {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    return user;
  }

  static async getUserStatusEnum() {
    return UserStatus;
  }

  /**
   *
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} phone
   * @param {string} password
   * @param {number} id
   */
  static async update(firstName, lastName, phone, password, id) {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        firstName,
        lastName,
        phone,
        password: await Bcrypt.hash(password),
      },
    });
  }

  static async newUser(firstName, lastName, phone, email, password) {
    return await prisma.user.create({
      data: {
        firstName,
        lastName,
        phone,
        email,
        password: await Bcrypt.hash(password),
        status: UserStatus.UNVERIFIED,
        role: UserRole.BUYER,
      },
    });
  }

  static async setSecretKey(token, id) {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        secretKey: token,
      },
    });
  }
}
