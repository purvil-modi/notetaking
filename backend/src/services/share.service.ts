import { noteRepository } from "../repositories/note.repository.js";
import { passwordService } from "./password.service.js";

function createServiceError(message: string, status: number): never {
  const error = new Error(message);
  (error as any).status = status;
  throw error;
}

function validateNoteAccess(
  note: {
    isRevoked: boolean;
    expiryAt: Date | null;
    isUsed: boolean;
    shareType: string;
  } | null
) {
  if (!note) {
    createServiceError("Note not found", 404);
  }
  if (note.isRevoked) {
    createServiceError("This link has been revoked.", 410);
  }
  if (note.expiryAt && new Date(note.expiryAt) < new Date()) {
    createServiceError("This link has expired.", 410);
  }
  if (note.shareType === "ONE_TIME" && note.isUsed) {
    createServiceError("This link has already been used.", 410);
  }
}

export const shareService = {
  async getSharedNote(token: string) {
    const note = await noteRepository.findByToken(token);
    validateNoteAccess(note);

    const validNote = note!;

    if (validNote.accessType === "PASSWORD_PROTECTED") {
      return {
        requiresPassword: true as const,
        shareType: validNote.shareType,
        accessType: validNote.accessType,
      };
    }

    // PUBLIC access — handle view tracking
    if (validNote.shareType === "ONE_TIME") {
      const updated = await noteRepository.markUsedAndIncrement(token);
      return {
        title: updated.title,
        content: updated.content,
        shareType: updated.shareType,
        accessType: updated.accessType,
        viewCount: updated.viewCount,
        createdAt: updated.createdAt,
      };
    }

    // TIME_BASED public note
    const updated = await noteRepository.incrementViewCount(token);
    return {
      title: updated.title,
      content: updated.content,
      shareType: updated.shareType,
      accessType: updated.accessType,
      viewCount: updated.viewCount,
      createdAt: updated.createdAt,
    };
  },

  async unlockNote(token: string, password: string) {
    const note = await noteRepository.findByToken(token);

    validateNoteAccess(note);

    const validNote = note!;

    if (!validNote.hashedPassword) {
      createServiceError("This note is not password protected", 400);
    }

    const isCorrect = await passwordService.verifyPassword(password, validNote.hashedPassword!);
    if (!isCorrect) {
      createServiceError("Incorrect password", 401);
    }

    // Correct password — handle view tracking
    if (validNote.shareType === "ONE_TIME") {
      const updated = await noteRepository.markUsedAndIncrement(token);
      return {
        title: updated.title,
        content: updated.content,
        shareType: updated.shareType,
        accessType: updated.accessType,
        viewCount: updated.viewCount,
        createdAt: updated.createdAt,
      };
    }

    // TIME_BASED password-protected note
    const updated = await noteRepository.incrementViewCount(token);
    return {
      title: updated.title,
      content: updated.content,
      shareType: updated.shareType,
      accessType: updated.accessType,
      viewCount: updated.viewCount,
      createdAt: updated.createdAt,
    };
  },
};
