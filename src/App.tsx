import "./App.css";
import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "@/features/auth/context/auth-context";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { ROUTES } from "@/routes/routeConfig";

// Lazy loaded Layouts
const DashboardLayout = lazy(() => import("@/features/kasir/layout/dashboard-layout").then(m => ({ default: m.DashboardLayout })));
const AnalitikLayout = lazy(() => import("@/features/analitik/layout/Analitik-layout").then(m => ({ default: m.AnalitikLayout })));

// Lazy loaded Pages
const LoginPage = lazy(() => import("@/features/auth/page/login").then(m => ({ default: m.LoginPage })));

// KASIR Pages
const KasirPage = lazy(() => import("@/features/kasir/pages/Kasir").then(m => ({ default: m.KasirPage })));
const RiwayatTransaksi = lazy(() => import("./features/kasir/pages/RiwayatTransaksi").then(m => ({ default: m.RiwayatTransaksi })));
const Stok = lazy(() => import("./features/kasir/pages/Stok").then(m => ({ default: m.Stok })));
const SettingsPage = lazy(() => import("./features/kasir/pages/Pengaturan").then(m => ({ default: m.SettingsPage })));

// ANALITIK Pages
const DashboardPage = lazy(() => import("@/features/analitik/pages/Dashboard").then(m => ({ default: m.DashboardPage })));
const TransaksiPage = lazy(() => import("@/features/analitik/pages/Transaksi").then(m => ({ default: m.TransaksiPage })));
const LaporanPage = lazy(() => import("@/features/analitik/pages/Laporan").then(m => ({ default: m.LaporanPage })));
const PasienPage = lazy(() => import("@/features/analitik/pages/Pasien").then(m => ({ default: m.PasienPage })));
const PengaturanPage = lazy(() => import("@/features/analitik/pages/pengaturan").then(m => ({ default: m.PengaturanPage })));

const LoadingFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-[#F9FEFC]">
    <div className="flex flex-col items-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1B9C90]/20 border-t-[#1B9C90]" />
      <p className="text-xs font-bold text-[#1B9C90] tracking-wide animate-pulse">MEMUAT HALAMAN...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* ROOT - Redirect ke login */}
            <Route path="/" element={<Navigate to={ROUTES.AUTH.LOGIN} replace />} />
            <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />

            {/* ADMIN & SUPER_ADMIN ROUTES - Analitik Dashboard */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["admin", "SUPER_ADMIN"]}>
                  <AnalitikLayout />
                </ProtectedRoute>
              }
            >
              <Route path={ROUTES.ADMIN.DASHBOARD} element={<DashboardPage />} />
              <Route path={ROUTES.ADMIN.TRANSAKSI} element={<TransaksiPage />} />
              <Route path={ROUTES.ADMIN.LAPORAN} element={<LaporanPage />} />
              <Route path={ROUTES.ADMIN.PASIEN} element={<PasienPage />} />
              <Route path={ROUTES.ADMIN.SETTINGS} element={<PengaturanPage />} />
            </Route>

            {/* KASIR ROUTES */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["kasir", "KASIR"]}>
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
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
