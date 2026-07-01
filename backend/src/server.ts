import { serve } from "@hono/node-server";
import app from "./app.js";
import { env } from "./config/env.js";

const port = env.PORT;

console.log(`Starting Hono.js server on port ${port}...`);

serve({
  fetch: app.fetch,
  port: port,
}, (info) => {
  console.log(`Server is running at http://localhost:${info.port}`);
});
