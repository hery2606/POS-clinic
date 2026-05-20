import axios from "axios";

export const aiClient = axios.create({
  baseURL: import.meta.env.VITE_API_AI_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Jika suatu saat server AI butuh interceptor / API Key, tambahkan di sini:
// aiClient.interceptors.request.use(...)