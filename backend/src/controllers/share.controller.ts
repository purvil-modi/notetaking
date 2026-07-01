import type { Context } from "hono";
import { shareService } from "../services/share.service.js";
import { notesService } from "../services/notes.service.js";

export const shareController = {
  async getSharedNote(c: Context) {
    const token = c.req.param("token") as string;
    const result = await shareService.getSharedNote(token);
    return c.json(result, 200);
  },

  async unlockNote(c: Context) {
    const token = c.req.param("token") as string;
    const data = c.get("validatedData");
    const result = await shareService.unlockNote(token, data.password);
    return c.json(result, 200);
  },

  async revokeNote(c: Context) {
    const id = c.req.param("id") as string;
    const userId = c.get("userId") as string;
    const result = await notesService.revokeNote(id, userId);
    return c.json(result, 200);
  },
};
