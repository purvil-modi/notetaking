import { Hono } from "hono";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { authController } from "../controllers/auth.controller.js";

export const authRoutes = new Hono();

authRoutes.post("/register", validate(registerSchema, "json"), authController.register);
authRoutes.post("/login", validate(loginSchema, "json"), authController.login);
