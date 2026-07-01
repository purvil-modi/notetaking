import { prisma } from "../config/database.js";
import { Prisma, ShareType, AccessType } from "@prisma/client";

interface CreateNoteData {
  title: string;
  content: string;
  shareToken: string;
  shareType: ShareType;
  accessType: AccessType;
  hashedPassword?: string | null;
  expiryAt?: Date | null;
  ownerId: string;
}

export const noteRepository = {
  async create(data: CreateNoteData) {
    return prisma.note.create({
      data: {
        title: data.title,
        content: data.content,
        shareToken: data.shareToken,
        shareType: data.shareType,
        accessType: data.accessType,
        hashedPassword: data.hashedPassword ?? null,
        expiryAt: data.expiryAt ?? null,
        ownerId: data.ownerId,
      },
    });
  },

  async findById(id: string, ownerId: string) {
    return prisma.note.findFirst({
      where: {
        id,
        ownerId,
        isDelete: false,
      },
    });
  },

  async findByToken(token: string) {
    return prisma.note.findFirst({
      where: {
        shareToken: token,
        isDelete: false,
      },
    });
  },

  async findByOwner(ownerId: string) {
    return prisma.note.findMany({
      where: {
        ownerId,
        isDelete: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async revokeNote(id: string, ownerId: string) {
    return prisma.note.updateMany({
      where: {
        id,
        ownerId,
      },
      data: {
        isRevoked: true,
      },
    });
  },

  /**
   * Atomic operation for one-time links. Uses SELECT FOR UPDATE to prevent
   * race conditions where two concurrent requests could both consume the link.
   */
  async markUsedAndIncrement(token: string) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Lock the row for the duration of the transaction
      const rows = await tx.$queryRaw<
        Array<{
          id: string;
          is_used: boolean;
          is_revoked: boolean;
          expiry_at: Date | null;
          share_type: string;
        }>
      >`SELECT id, is_used, is_revoked, expiry_at, share_type FROM notes WHERE share_token = ${token} FOR UPDATE`;

      if (rows.length === 0) {
        const error = new Error("Note not found");
        (error as any).status = 404;
        throw error;
      }

      const note = rows[0];

      if (note.is_revoked) {
        const error = new Error("This link has been revoked.");
        (error as any).status = 410;
        throw error;
      }

      if (note.expiry_at && new Date(note.expiry_at) < new Date()) {
        const error = new Error("This link has expired.");
        (error as any).status = 410;
        throw error;
      }

      if (note.is_used) {
        const error = new Error("This link has already been used.");
        (error as any).status = 410;
        throw error;
      }

      return tx.note.update({
        where: { id: note.id },
        data: {
          isUsed: true,
          viewCount: { increment: 1 },
        },
      });
    });
  },

  async incrementViewCount(token: string) {
    return prisma.note.update({
      where: { shareToken: token },
      data: {
        viewCount: { increment: 1 },
      },
    });
  },
};
