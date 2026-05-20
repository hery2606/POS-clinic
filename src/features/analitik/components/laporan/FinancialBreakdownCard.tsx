"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { analitikService } from "../../services/analitik.service";

export type BreakdownTabType = "Pendapatan" | "Pengeluaran" | "Laba Rugi" | "Neraca" | "Arus Kas";

interface FinancialBreakdownCardProps {
  activeTab: BreakdownTabType;
}

interface BreakdownData {
  title: string;
  subtitle: string;
  categories: { name: string; percentage: number; color: string }[];
  contributorsTitle: string;
  contributors: { name: string; amount: string }[];
}

const staticBreakdownConfigs: Record<BreakdownTabType, BreakdownData> = {
  Pendapatan: {
    title: "Breakdown Pendapatan",
    subtitle: "Berdasarkan Kategori",
    categories: [
      { name: "Layanan Medis", percentage: 65, color: "#1B9C90" },
      { name: "Farmasi & Obat", percentage: 35, color: "#84DFD4" },
    ],
    contributorsTitle: "Top 3 Kontributor",
    contributors: [
      { name: "Konsultasi Dokter Umum", amount: "Rp 45.2M" },
      { name: "Paracetamol 500mg", amount: "Rp 18.5M" },
      { name: "Cek Darah Lengkap", amount: "Rp 15.3M" },
    ],
  },
  Pengeluaran: {
    title: "Breakdown Pengeluaran",
    subtitle: "Alokasi Dana Keluar",
    categories: [
      { name: "Alkes & Obat", percentage: 58, color: "#4F46E5" },
      { name: "Operasional", percentage: 42, color: "#C7D2FE" },
    ],
    contributorsTitle: "Pengeluaran Terbesar",
    contributors: [
      { name: "Restock Obat & Vaksin", amount: "Rp 22.1M" },
      { name: "Gaji Staf & Dokter", amount: "Rp 18.0M" },
      { name: "Utilitas & Logistik", amount: "Rp 3.2M" },
    ],
  },
  "Laba Rugi": {
    title: "Breakdown Margin",
    subtitle: "Efisiensi Pendapatan",
    categories: [
      { name: "Margin Bersih", percentage: 22, color: "#1B9C90" },
      { name: "Beban Usaha", percentage: 78, color: "#EFF4F8" },
    ],
    contributorsTitle: "Periode Paling Profit",
    contributors: [
      { name: "Minggu Ke-4 (M4)", amount: "Rp 26.5M" },
      { name: "Minggu Ke-2 (M2)", amount: "Rp 25.0M" },
      { name: "Minggu Ke-3 (M3)", amount: "Rp 21.0M" },
    ],
  },
  Neraca: {
    title: "Breakdown Komposisi",
    subtitle: "Struktur Aset Klinik",
    categories: [
      { name: "Aset Lancar", percentage: 75, color: "#1B9C90" },
      { name: "Aset Tetap", percentage: 25, color: "#F2A618" },
    ],
    contributorsTitle: "Komponen Utama",
    contributors: [
      { name: "Kas & Rekening Bank", amount: "Rp 320.0M" },
      { name: "Alat Medis & USG", amount: "Rp 150.0M" },
      { name: "Piutang Penjaminan", amount: "Rp 70.0M" },
    ],
  },
  "Arus Kas": {
    title: "Breakdown Arus Kas",
    subtitle: "Rasio Aliran Dana",
    categories: [
      { name: "Kas Masuk", percentage: 62, color: "#1B9C90" },
      { name: "Kas Keluar", percentage: 38, color: "#E62C2C" },
    ],
    contributorsTitle: "Sumber Aliran Terbesar",
    contributors: [
      { name: "Pelunasan Klaim BPJS", amount: "Rp 51.0M" },
      { name: "Pembayaran Obat Tunai", amount: "Rp 31.0M" },
      { name: "Biaya Operasional Rutin", amount: "Rp 5.5M" },
    ],
  },
};

const formatCurrency = (amount: number): string => {
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)}M`;
  } else if (amount >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(1)}K`;
  }
  return `Rp ${amount}`;
};

export function FinancialBreakdownCard({ activeTab }: FinancialBreakdownCardProps) {
  // Fetch cashflow and product data
  const cashflowQuery = useQuery({
    queryKey: ["cashflowSummary"],
    queryFn: () => analitikService.getCashflowSummary(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const productsQuery = useQuery({
    queryKey: ["productsAnalytics"],
    queryFn: () => analitikService.getProductAnalytics(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Generate dynamic data for Arus Kas tab
  const dynamicArusKasData = useMemo(() => {
    if (!cashflowQuery.data?.data) return staticBreakdownConfigs["Arus Kas"];

    const cashflow = cashflowQuery.data.data;
    const kasMasuk = cashflow.kas_masuk_harian || 0;
    const kasKeluar = kasMasuk * 0.4; // Estimate 40% for cashOut

    const totalKas = kasMasuk + kasKeluar;
    const persenMasuk = totalKas > 0 ? Math.round((kasMasuk / totalKas) * 100) : 62;
    const persenKeluar = 100 - persenMasuk;

    return {
      title: "Breakdown Arus Kas",
      subtitle: "Rasio Aliran Dana",
      categories: [
        { name: "Kas Masuk", percentage: persenMasuk, color: "#1B9C90" },
        { name: "Kas Keluar", percentage: persenKeluar, color: "#E62C2C" },
      ],
      contributorsTitle: "Sumber Aliran Terbesar",
      contributors: [
        { name: "Kas Masuk Hari Ini", amount: formatCurrency(kasMasuk) },
        { name: `${cashflow.total_transaksi_lunas_hari_ini || 0} Transaksi Lunas`, amount: formatCurrency(kasMasuk / Math.max(1, cashflow.total_transaksi_lunas_hari_ini || 1)) },
        { name: "Invoice Belum Lunas", amount: formatCurrency(cashflow.nilai_total_invoice_belum_lunas || 0) },
      ],
    };
  }, [cashflowQuery.data]);

  // Generate dynamic data for Pendapatan tab using products
  const dynamicPendapatanData = useMemo(() => {
    if (!productsQuery.data?.data) return staticBreakdownConfigs.Pendapatan;

    const products = productsQuery.data.data;
    const topProducts = products.produk_terlaris_top_10 || [];
    const topServices = products.pemeriksaan_layanan_terlaris || [];

    // Calculate percentages
    const totalServiceRevenue = topServices.reduce((sum: number, s: any) => sum + (s.pendapatan_layanan || 0), 0);
    const totalProductRevenue = topProducts.reduce((sum: number, p: any) => sum + (p.pendapatan_produk || 0), 0);
    const total = totalServiceRevenue + totalProductRevenue;

    const persenLayanan = total > 0 ? Math.round((totalServiceRevenue / total) * 100) : 65;
    const persenFarmasi = 100 - persenLayanan;

    return {
      title: "Breakdown Pendapatan",
      subtitle: "Berdasarkan Kategori",
      categories: [
        { name: "Layanan Medis", percentage: persenLayanan, color: "#1B9C90" },
        { name: "Farmasi & Obat", percentage: persenFarmasi, color: "#84DFD4" },
      ],
      contributorsTitle: "Top 3 Kontributor",
      contributors: [
        ...(topServices.length > 0 ? [{ name: topServices[0].nama_layanan, amount: formatCurrency(topServices[0].pendapatan_layanan) }] : []),
        ...(topProducts.length > 0 ? [{ name: topProducts[0].nama_obat, amount: formatCurrency(topProducts[0].pendapatan_produk) }] : []),
        ...(topProducts.length > 1 ? [{ name: topProducts[1].nama_obat, amount: formatCurrency(topProducts[1].pendapatan_produk) }] : []),
      ].slice(0, 3),
    };
  }, [productsQuery.data]);

  // Map active tab to data source
  const getDataForTab = (): BreakdownData => {
    switch (activeTab) {
      case "Arus Kas":
        return dynamicArusKasData;
      case "Pendapatan":
        return dynamicPendapatanData;
      default:
        return staticBreakdownConfigs[activeTab];
    }
  };

  const data = getDataForTab();

  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm w-full max-w-md space-y-5 h-full flex flex-col justify-between">
      
      {/* HEADER SECTION */}
      <div>
        <CardTitle className="text-base font-bold text-[#13222D]">
          {data.title}
        </CardTitle>
        <p className="text-xs font-medium text-[#67737C] mt-1">
          {data.subtitle}
        </p>
      </div>

      {/* DYNAMIC PROGRESS BARS */}
      <div className="space-y-4 flex-1 flex flex-col justify-center">
        {data.categories.map((cat, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="font-bold text-[#13222D]">{cat.name}</span>
              </div>
              <span className="font-bold text-[#13222D]">{cat.percentage}%</span>
            </div>
            <div className="w-full h-2 bg-[#EFF4F8] rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} 
              />
            </div>
          </div>
        ))}
      </div>

      <Separator className="bg-[#DFE6EB]" />

      {/* DYNAMIC CONTRIBUTORS LIST */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#67737C] uppercase tracking-wide">
          {data.contributorsTitle}
        </h3>
        
        <div className="space-y-2">
          {data.contributors.map((item, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 rounded-xl bg-[#F4F7F9] border border-[#DFE6EB]/30"
            >
              <span className="text-xs sm:text-sm font-semibold text-[#13222D] truncate pr-4">
                {item.name}
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#1B9C90] shrink-0">
                {item.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

    </Card>
  );
}