import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRoutes } from "./routes/auth.routes.js";
import { notesRoutes } from "./routes/notes.routes.js";
import { shareRoutes } from "./routes/share.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { env } from "./config/env.js";

const app = new Hono().basePath("/api");

// CORS config
app.use(
  "*",
  cors({
    origin: ["*"],
    credentials: true,
    allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// Security headers middleware
app.use("*", async (c, next) => {
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("X-XSS-Protection", "1; mode=block");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header(
    "Content-Security-Policy",
    "default-src 'self'; frame-ancestors 'none'; object-src 'none';"
  );
  await next();
});

// Route registrations
app.route("/", authRoutes);
app.route("/", notesRoutes);
app.route("/", shareRoutes);

// Fallbacks
app.notFound((c) => c.json({ error: "API Endpoint not found" }, 404));
app.onError(errorHandler);

export default app;
