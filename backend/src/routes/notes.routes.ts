import { Hono } from "hono";
import { authMiddleware, type AuthVariables } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createNoteSchema } from "../validators/note.validator.js";
import { notesController } from "../controllers/notes.controller.js";

export const notesRoutes = new Hono<{ Variables: AuthVariables }>();

// All notes endpoints are protected
notesRoutes.use("*", authMiddleware);

notesRoutes.post("/notes", validate(createNoteSchema, "json"), notesController.createNote);
notesRoutes.get("/notes", notesController.getOwnerNotes);
notesRoutes.get("/notes/:id", notesController.getNote);
