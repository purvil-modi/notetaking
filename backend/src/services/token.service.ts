import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

interface TokenPayload {
  userId: string;
  email: string;
}

export const tokenService = {
  generateToken(payload: TokenPayload): string {
    // Generate token expiring in 24 hours
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "24h" });
  },

  verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    } catch (err) {
      return null;
    }
  },
};
