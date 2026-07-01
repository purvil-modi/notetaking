import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 5000,

  DATABASE_URL: process.env.DATABASE_URL ?? "",

  JWT_SECRET:
    process.env.JWT_SECRET ??
    "dev-jwt-secret-key-must-be-long-and-secure",

  CORS_ORIGIN:
    process.env.CORS_ORIGIN ??
    "http://localhost:3000",

  NODE_ENV:
    process.env.NODE_ENV ??
    "development",
};

// Validate required environment variables
const requiredEnv = ["DATABASE_URL"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}