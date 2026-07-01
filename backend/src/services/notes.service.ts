import { randomBytes } from "crypto";
import { noteRepository } from "../repositories/note.repository.js";
import { passwordService } from "./password.service.js";
import { ShareType, AccessType } from "@prisma/client";

interface CreateNoteInput {
  title: string;
  content: string;
  shareType: ShareType;
  accessType: AccessType;
  expiryAt?: string | null;
}

export const notesService = {
  async createNote(input: CreateNoteInput, ownerId: string) {
    const shareToken = randomBytes(32).toString("hex");

    let hashedPassword: string | null = null;
    let plainPassword: string | undefined;

    if (input.accessType === "PASSWORD_PROTECTED") {
      plainPassword = randomBytes(9).toString("base64url").slice(0, 12);
      hashedPassword = await passwordService.hashPassword(plainPassword);
    }

    const note = await noteRepository.create({
      title: input.title,
      content: input.content,
      shareToken,
      shareType: input.shareType,
      accessType: input.accessType,
      hashedPassword,
      expiryAt: input.expiryAt ? new Date(input.expiryAt) : null,
      ownerId,
    });

    return {
      note: {
        id: note.id,
        title: note.title,
        shareToken: note.shareToken,
        shareType: note.shareType,
        accessType: note.accessType,
        expiryAt: note.expiryAt,
        viewCount: note.viewCount,
        isRevoked: note.isRevoked,
        isUsed: note.isUsed,
        createdAt: note.createdAt,
      },
      password: plainPassword,
    };
  },

  async getNoteForOwner(noteId: string, ownerId: string) {
    const note = await noteRepository.findById(noteId, ownerId);
    if (!note) {
      const error = new Error("Note not found");
      (error as any).status = 404;
      throw error;
    }
    return note;
  },

  async revokeNote(noteId: string, ownerId: string) {
    const note = await noteRepository.findById(noteId, ownerId);
    if (!note) {
      const error = new Error("Note not found");
      (error as any).status = 404;
      throw error;
    }

    await noteRepository.revokeNote(noteId, ownerId);
    return { message: "Share link revoked successfully" };
  },
};
