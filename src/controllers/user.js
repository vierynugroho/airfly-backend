import { ErrorHandler } from '../middlewares/error.js';
import { UserService } from '../services/user.js';

export class UserController {
  static async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || null;
      const userStatus = req.query.userStatus;

      if (userStatus) {
        let userStatusValid = ['VERIFIED', 'UNVERIFIED'];

        if (isNaN(userStatus)) {
          userStatus.toUpperCase();
        }

        if (!userStatusValid.includes(userStatus)) {
          throw new ErrorHandler(
            422,
            `invalid user status value. allowed status: ${userStatusValid.join(', ')}`
          );
        }
      }

      let condition = {};
      const pagination = {};

      if (page && limit) {
        pagination.offset = (page - 1) * limit;
        pagination.limit = limit;
      }

      if (userStatus) {
        condition.status = userStatus;
      }

      const { users, totalUsers } = await UserService.getAll(
        pagination,
        condition
      );

      res.json({
        meta: {
          statusCode: 200,
          message: 'users data retrieved successfully',
          pagination:
            page && limit
              ? {
                  totalPage: Math.ceil(totalUsers / limit),
                  currentPage: page,
                  pageItems: users.length,
                  nextPage:
                    page < Math.ceil(totalUsers / limit) ? page + 1 : null,
                  prevPage: page > 1 ? page - 1 : null,
                }
              : null,
        },
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByID(req, res, next) {
    try {
      const userID = parseInt(req.params.id);

      if (isNaN(userID)) {
        throw new ErrorHandler(422, 'user ID is not a number');
      }

      const user = await UserService.getByID(userID);

      res.json({
        meta: {
          statusCode: 200,
          message: 'user data retrieved successfully',
        },
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const data = req.body;
      const userID = parseInt(req.params.id);

      if (isNaN(userID)) {
        throw new ErrorHandler(422, 'user ID is not a number');
      }

      const user = await UserService.update(userID, data);

      res.json({
        meta: {
          statusCode: 200,
          message: 'user data updated successfully',
        },
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const userID = parseInt(req.params.id);

      if (isNaN(userID)) {
        throw new ErrorHandler(422, 'user ID is not a number');
      }

      const user = await UserService.delete(userID);

      return res.json({
        meta: {
          statusCode: 200,
          message: 'user deleted successfully',
        },
        data: user,
      });
    } catch (e) {
      next(e);
    }
  }

  static async profileUpdate(req, res, next) {
    try {
      const data = req.body;
      const userID = parseInt(req.user.id);

      const user = await UserService.update(userID, data);

      res.json({
        meta: {
          statusCode: 200,
          message: 'user profile updated successfully',
        },
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async accountDelete(req, res, next) {
    try {
      const userID = parseInt(req.user.id);

      const user = await UserService.delete(userID);

      return res.json({
        meta: {
          statusCode: 200,
          message: 'user account deleted successfully',
        },
        data: user,
      });
    } catch (e) {
      next(e);
    }
  }
}
