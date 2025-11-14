import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - attach auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = user?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - unauthorized/expired token
    if (error.response?.status === 401) {
      toast.error("Your session has expired. Please log in again.");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    // Handle 403 - forbidden
    if (error.response?.status === 403) {
      toast.error("You don't have permission to perform this action");
    }

    // Handle 404
    if (error.response?.status === 404) {
      toast.error("Resource not found");
    }

    // Handle 500
    if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
