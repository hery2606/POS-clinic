import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { DashboardLayout } from "@/features/kasir/layout/dashboard-layout";
import { AnalitikLayout } from "@/features/analitik/layout/Analitik-layout";
import { LoginPage } from "@/features/auth/page/login";
import { AuthProvider } from "@/features/auth/context/auth-context";
import { KasirPage } from "@/features/kasir/pages/Kasir";
import { AnalitikDashboard } from "@/features/analitik/pages/AnalitikDashboard";
import { RiwayatTransaksi } from "./features/kasir/pages/RiwayatTransaksi";
import { DataPasien } from "./features/kasir/pages/DataPasien";
import { Stok } from "./features/kasir/pages/Stok";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { ROUTES } from "@/routes/routeConfig";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ROOT - Redirect ke login */}
          <Route path="/" element={<Navigate to={ROUTES.AUTH.LOGIN} replace />} />

          {/* AUTH ROUTES */}
          <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />

          {/* ADMIN ROUTES */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AnalitikLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.ADMIN.ANALYTICS} element={<AnalitikDashboard />} />
          </Route>

          {/* KASIR ROUTES */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["kasir", "admin"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.KASIR.DASHBOARD} element={<KasirPage />} />
            <Route path={ROUTES.KASIR.RIWAYAT} element={<RiwayatTransaksi />} />
            <Route path={ROUTES.KASIR.PASIEN} element={<DataPasien />} />
            <Route path={ROUTES.KASIR.STOK} element={<Stok />} />
            <Route
              path={ROUTES.KASIR.PENGATURAN}
              element={
                <div className="p-6">
                  <p>Halaman Pengaturan</p>
                </div>
              }
            />
          </Route>

          {/* FALLBACK - Route tidak ditemukan */}
          <Route path="*" element={<Navigate to={ROUTES.AUTH.LOGIN} replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
