import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "dev-jwt-secret-key-must-be-long-and-secure",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
};

// Validate critical environment variables
if (!env.DATABASE_URL) {
  console.warn("WARNING: DATABASE_URL environment variable is not defined!");
}
