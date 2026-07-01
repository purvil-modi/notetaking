import { prisma } from "../config/database.js";

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.user.findFirst({
      where: {
        email,
        isDelete: false,
      },
    });
  },

  async findById(id: string) {
    return prisma.user.findFirst({
      where: {
        id,
        isDelete: false,
      },
    });
  },

  async create(data: { name: string; email: string; passwordHash: string }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
      },
    });
  },
};
