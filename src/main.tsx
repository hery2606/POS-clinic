import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TooltipProvider } from "@/components/ui/tooltip";
import { initializeRmeAuth } from "@/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Eksekusi fungsi login otomatis ke server RME sebelum React merender UI aplikasi

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data dianggap "segar" selama 5 menit. Selama 5 menit ini, pindah halaman gak bakal loading ulang.
      refetchOnWindowFocus: false, // Mematikan fitur auto-fetch ulang setiap kali user pindah tab browser
    },
  },
});

initializeRmeAuth().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
});
