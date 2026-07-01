import type { Context } from "hono";
import { notesService } from "../services/notes.service.js";

export const notesController = {
  async createNote(c: Context) {
    const data = c.get("validatedData");
    const userId = c.get("userId") as string;
    const result = await notesService.createNote(data, userId);
    return c.json(result, 201);
  },

  async getNote(c: Context) {
    const noteId = c.req.param("id") as string;
    const userId = c.get("userId") as string;
    const result = await notesService.getNoteForOwner(noteId, userId);
    return c.json(result, 200);
  },

  async getOwnerNotes(c: Context) {
    const userId = c.get("userId") as string;
    const { noteRepository } = await import("../repositories/note.repository.js");
    const notes = await noteRepository.findByOwner(userId);
    return c.json(notes, 200);
  },
};
