import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { DashboardLayout } from "@/features/kasir/layout/dashboard-layout";
import { LoginPage } from "@/features/auth/page/login";
import { AuthProvider } from "@/features/auth/context/auth-context";
import { KasirPage } from "@/features/kasir/pages/Kasir";
import { RiwayatTransaksi } from "./features/kasir/pages/RiwayatTransaksi";
import { DataPasien } from "./features/kasir/pages/DataPasien";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/kasir" element={<KasirPage />} />
            <Route path="/riwayat" element={<RiwayatTransaksi />} />
            <Route path="/pasien" element={<DataPasien />} />
            <Route
              path="/stok"
              element={
                <div className="p-6">
                  <p>Halaman Stok Obat</p>
                </div>
              }
            />
            <Route
              path="/pengaturan"
              element={
                <div className="p-6">
                  <p>Halaman Pengaturan</p>
                </div>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
