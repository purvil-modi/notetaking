import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to parse unified error formats
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = "An unexpected error occurred.";
    let status = 500;

    if (error.response) {
      status = error.response.status;
      errorMessage = error.response.data?.error || errorMessage;
    } else if (error.request) {
      errorMessage = "No response received from server. Check your connection.";
    }

    const customError = new Error(errorMessage);
    (customError as any).status = status;
    (customError as any).details = error.response?.data?.details;

    return Promise.reject(customError);
  }
);
