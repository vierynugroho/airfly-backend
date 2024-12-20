import { AdminService } from '../services/admin.js';

export class AdminController {
  static async count(req, res, next) {
    try {
      res.json({
        meta: {
          statusCode: 200,
          message: 'Count fetch success',
        },
        data: await AdminService.count(),
      });
    } catch (err) {
      next(err);
    }
  }
}
