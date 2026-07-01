import type { Context } from "hono";
import { authService } from "../services/auth.service.js";

export const authController = {
  async register(c: Context) {
    const data = c.get("validatedData");
    const result = await authService.register(data);
    return c.json(result, 201);
  },

  async login(c: Context) {
    const data = c.get("validatedData");
    const result = await authService.login(data);
    return c.json(result, 200);
  },
};
