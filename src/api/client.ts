import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menyisipkan Token JWT otomatis dari Auth Feature jika ada
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token"); // Sesuaikan dengan mekanisme storage auth-context kamu
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);