import { prisma } from '../database/db.js';

export class UserRepository {
  static async findMany(pagination, filter) {
    const users = await prisma.user.findMany({
      skip: pagination.offset,
      take: pagination.limit,
      where: filter,
      include: {
        _count: true,
        booking: {
          include: {
            _count: true,
          },
        },
        Notification: true,
      },
    });

    return users;
  }

  static async getUsersID() {
    const usersID = await prisma.user.findMany({
      select: {
        id: true,
      },
    });

    return usersID;
  }

  static async findByID(userID) {
    const user = await prisma.user.findUnique({
      where: {
        id: userID,
      },
    });

    return user;
  }

  static async count(filter) {
    const totalUsers = await prisma.user.count({
      where: filter,
    });

    return totalUsers;
  }

  static async update(userID, data) {
    const updatedUser = await prisma.user.update({
      where: {
        id: userID,
      },
      data,
    });

    return updatedUser;
  }

  static async delete(userID) {
    const deletedUser = await prisma.user.delete({
      where: {
        id: userID,
      },
    });

    return deletedUser;
  }
}
