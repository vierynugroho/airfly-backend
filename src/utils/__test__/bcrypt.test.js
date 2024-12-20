import bcrypt from 'bcrypt';

jest.mock('bcrypt');

import { Bcrypt } from '../bcrypt';

describe('Bcrypt', () => {
  describe('compare', () => {
    it('seharusnya mengembalikan true untuk password dan hash yang cocok', async () => {
      const password = 'secret123';
      const encryptedPassword = '$2y$10$...hashedValue...';

      bcrypt.compare.mockResolvedValueOnce(true);

      const result = await Bcrypt.compare(password, encryptedPassword);

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, encryptedPassword);
    });

    it('seharusnya mengembalikan false untuk password dan hash yang tidak cocok', async () => {
      const password = 'wrongPassword';
      const encryptedPassword = '$2y$10$...hashedValue...';

      bcrypt.compare.mockResolvedValueOnce(false);

      const result = await Bcrypt.compare(password, encryptedPassword);

      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, encryptedPassword);
    });

    it('seharusnya melempar error jika bcrypt mengalami masalah', async () => {
      const password = 'secret123';
      const encryptedPassword = '$2y$10$...hashedValue...';

      bcrypt.compare.mockRejectedValueOnce(
        new Error('Unexpected bcrypt error')
      );

      await expect(
        Bcrypt.compare(password, encryptedPassword)
      ).rejects.toThrowError('Unexpected bcrypt error');
    });
  });

  describe('hash', () => {
    it('seharusnya mengembalikan string hash', async () => {
      const plainTextPassword = 'secret123';

      bcrypt.hash.mockResolvedValueOnce('hashedValue');

      const hashedPassword = await Bcrypt.hash(plainTextPassword);

      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword).not.toBe(plainTextPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(plainTextPassword, 10);
    });

    it('seharusnya melempar error jika bcrypt mengalami masalah', async () => {
      const plainTextPassword = 'secret123';

      bcrypt.hash.mockRejectedValueOnce(new Error('Unexpected bcrypt error'));

      await expect(Bcrypt.hash(plainTextPassword)).rejects.toThrowError(
        'Unexpected bcrypt error'
      );
    });
  });
});
