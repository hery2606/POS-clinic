"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

const breakdownConfigs: Record<BreakdownTabType, BreakdownData> = {
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

export function FinancialBreakdownCard({ activeTab }: FinancialBreakdownCardProps) {
  const data = breakdownConfigs[activeTab] || breakdownConfigs.Pendapatan;

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