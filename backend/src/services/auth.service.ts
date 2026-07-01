import { userRepository } from "../repositories/user.repository.js";
import { passwordService } from "./password.service.js";
import { tokenService } from "./token.service.js";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      const error = new Error("Email is already registered");
      (error as any).status = 409;
      throw error;
    }

    const passwordHash = await passwordService.hashPassword(input.password);
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    const token = tokenService.generateToken({ userId: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      const error = new Error("Invalid email or password");
      (error as any).status = 401;
      throw error;
    }

    const isMatch = await passwordService.verifyPassword(input.password, user.passwordHash);
    if (!isMatch) {
      const error = new Error("Invalid email or password");
      (error as any).status = 401;
      throw error;
    }

    const token = tokenService.generateToken({ userId: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  },
};
