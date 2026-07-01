import { Hono } from "hono";
import { authMiddleware, type AuthVariables } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createRateLimiter } from "../middlewares/rateLimit.middleware.js";
import { unlockNoteSchema } from "../validators/note.validator.js";
import { shareController } from "../controllers/share.controller.js";

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const unlockRateLimiter = createRateLimiter(5, FIFTEEN_MINUTES);

export const shareRoutes = new Hono();


// Public share read
shareRoutes.get("/share/:token", shareController.getSharedNote);

// Password protected unlock with rate limit
shareRoutes.post(
  "/share/:token/unlock",
  unlockRateLimiter,
  validate(unlockNoteSchema, "json"),
  shareController.unlockNote
);

// Revocation by owner
shareRoutes.delete("/share/revoke/:id", authMiddleware, shareController.revokeNote);
