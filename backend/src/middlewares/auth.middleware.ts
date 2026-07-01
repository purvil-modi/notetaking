import type { MiddlewareHandler } from "hono";
import { tokenService } from "../services/token.service.js";

export type AuthVariables = {
  userId: string;
  email: string;
};

export const authMiddleware: MiddlewareHandler<{ Variables: AuthVariables }> = async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized: Missing token" }, 401);
  }

  const token = authHeader.substring(7);
  const decoded = tokenService.verifyToken(token);

  if (!decoded) {
    return c.json({ error: "Unauthorized: Invalid or expired token" }, 401);
  }

  c.set("userId", decoded.userId);
  c.set("email", decoded.email);

  await next();
};
