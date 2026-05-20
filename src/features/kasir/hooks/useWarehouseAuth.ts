import { useQuery } from "@tanstack/react-query";
import { loginWarehouseAdmin } from "@/api";

export const useWarehouseAuth = () => {
  const tokenInStorage = localStorage.getItem("warehouse_auth_token");

  const { data: token, isLoading, error } = useQuery({
    queryKey: ["warehouseToken"],
    queryFn: async () => {
      const accessToken = await loginWarehouseAdmin();
      if (accessToken) {
        localStorage.setItem("warehouse_auth_token", accessToken);
      }
      return accessToken;
    },
    // KUNCI UTAMA: Hanya jalan login jika token DI LOCALSTORAGE KOSONG
    enabled: !tokenInStorage, 
    staleTime: Infinity, // Token dianggap segar selama aplikasi tidak di-refresh (F5)
  });

  return {
    token: tokenInStorage || token,
    isAuthenticated: !!(tokenInStorage || token),
    isLoadingAuth: isLoading,
    authError: error,
  };
};