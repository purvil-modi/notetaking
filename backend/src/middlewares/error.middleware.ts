import type { ErrorHandler } from "hono";

export const errorHandler: ErrorHandler = async (err, c) => {
  const status = (err as any).status || 500;
  const message = err.message || "Internal Server Error";

  if (status === 500) {
    console.error("Unhandled Server Error:", err);
    return c.json({ error: "Internal Server Error" }, 500);
  }

  return c.json({ error: message }, status);
};
