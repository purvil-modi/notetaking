import Cookies from "js-cookie";
import { api } from "@/services/api";
import type { LoginInput, RegisterInput } from "@/schemas/auth";

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export const authService = {
  async register(data: RegisterInput): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/register", data);
    const result = response.data;
    
    Cookies.set("token", result.token, { expires: 1, secure: true, sameSite: "strict" });
    localStorage.setItem("user", JSON.stringify(result.user));
    
    return result;
  },

  async login(data: LoginInput): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/login", data);
    const result = response.data;

    Cookies.set("token", result.token, { expires: 1, secure: true, sameSite: "strict" });
    localStorage.setItem("user", JSON.stringify(result.user));

    return result;
  },

  logout(): void {
    Cookies.remove("token");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
