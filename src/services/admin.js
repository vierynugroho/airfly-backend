import { AdminRepository } from '../repositories/admin.js';

export class AdminService {
  static async count() {
    return await AdminRepository.count();
  }
}
