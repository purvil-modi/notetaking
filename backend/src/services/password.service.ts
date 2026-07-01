import { hash, compare } from "bcryptjs";

const BCRYPT_ROUNDS = 12;

export const passwordService = {
  async hashPassword(password: string): Promise<string> {
    return hash(password, BCRYPT_ROUNDS);
  },

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  },
};
