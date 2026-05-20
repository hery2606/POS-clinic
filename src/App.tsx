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
{/* KASIR*/}
import { KasirPage } from "@/features/kasir/pages/Kasir";
import { RiwayatTransaksi } from "./features/kasir/pages/RiwayatTransaksi";
import { Stok } from "./features/kasir/pages/Stok";
import { SettingsPage } from "./features/kasir/pages/Pengaturan";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
{/* ANALITIK*/}
import { DashboardPage } from "@/features/analitik/pages/Dashboard";
import { TransaksiPage } from "@/features/analitik/pages/Transaksi";
import { LaporanPage } from "@/features/analitik/pages/Laporan";
import { PasienPage } from "@/features/analitik/pages/Pasien";
import { ROUTES } from "@/routes/routeConfig";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ROOT - Redirect ke login */}
          <Route path="/" element={<Navigate to={ROUTES.AUTH.LOGIN} replace />} />
          <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />

          {/* ADMIN ROUTES */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AnalitikLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.ADMIN.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.ADMIN.TRANSAKSI} element={<TransaksiPage />} />
            <Route path={ROUTES.ADMIN.LAPORAN} element={<LaporanPage />} />
            <Route path={ROUTES.ADMIN.PASIEN} element={<PasienPage />} />
            <Route path={ROUTES.ADMIN.SETTINGS} element={<div className="p-6"><p>Halaman Pengaturan</p></div>} />
            <Route path={ROUTES.ADMIN.SETTINGS} element={<div className="p-6"><p>Halaman Pengaturan</p></div>} />
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
            <Route path={ROUTES.KASIR.STOK} element={<Stok />} />
            <Route path={ROUTES.KASIR.PENGATURAN} element={<SettingsPage/>} />
          </Route>
          <Route path="*" element={<Navigate to={ROUTES.AUTH.LOGIN} replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
