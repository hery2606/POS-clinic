import axios from "axios";

// Menggunakan proxy Vercel/Vite untuk menghindari kebocoran URL backend asli
export const chatbotClient = axios.create({
  baseURL: "/proxy/chatbot",
  headers: {
    "Content-Type": "application/json",
  },
});

export const askChatbot = async (question: string, history: any[] = []) => {
  const response = await chatbotClient.post("/api/v1/chatbot/ask", {
    question,
    history,
    frontend_routes: [
      { name: "Dashboard Utama", path: "/admin/dashboard" },
      { name: "Pasien", path: "/admin/Pasien" },
      { name: "Transaksi", path: "/admin/Transaksi" },
      { name: "Laporan", path: "/admin/Laporan" },
      { name: "Pengaturan", path: "/admin/settings" }
    ]
  });
  return response.data;
};
