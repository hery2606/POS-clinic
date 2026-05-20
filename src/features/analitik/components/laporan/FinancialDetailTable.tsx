"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BreakdownTabType } from "./FinancialBreakdownCard";
import { analitikService } from "../../services/analitik.service";

interface FinancialDetailTableProps {
  activeTab: BreakdownTabType;
  onViewAllClick?: () => void;
}

const tableConfigs: Record<BreakdownTabType, { title: string; headers: string[]; widths: string[] }> = {
  Pendapatan: {
    title: "Rincian Pendapatan Harian",
    headers: ["TANGGAL", "TOTAL TRANSAKSI", "PENDAPATAN LAYANAN", "PENDAPATAN OBAT", "TOTAL PENDAPATAN"],
    widths: ["w-[20%]", "w-[15%]", "w-[22%]", "w-[22%]", "w-[21%]"]
  },
  Pengeluaran: {
    title: "Rincian Pengeluaran Klinis",
    headers: ["TANGGAL", "KATEGORI", "KETERANGAN", "METODE", "TOTAL PENGELUARAN"],
    widths: ["w-[20%]", "w-[20%]", "w-[25%]", "w-[15%]", "w-[20%]"]
  },
  "Laba Rugi": {
    title: "Ikhtisar Performa Laba Rugi",
    headers: ["PERIODE", "TOTAL PENDAPATAN", "TOTAL PENGELUARAN", "LABA BERSIH", "MARGIN"],
    widths: ["w-[20%]", "w-[22%]", "w-[22%]", "w-[21%]", "w-[15%]"]
  },
  Neraca: {
    title: "Daftar Saldo Akun Neraca",
    headers: ["KODE AKUN", "NAMA AKUN", "KATEGORI", "SALDO AWAL", "SALDO AKHIR"],
    widths: ["w-[15%]", "w-[25%]", "w-[20%]", "w-[20%]", "w-[20%]"]
  },
  "Arus Kas": {
    title: "Buku Jurnal Arus Kas (Cash Flow)",
    headers: ["TANGGAL", "KETERANGAN", "KAS MASUK", "KAS KELUAR", "SALDO AKHIR"],
    widths: ["w-[20%]", "w-[25%]", "w-[18%]", "w-[18%]", "w-[19%]"]
  }
};

const dummyTableData: Record<BreakdownTabType, any[]> = {
  Pendapatan: [
    { col1: "15 Nov 2023", col2: 42, col3: "Rp 2.800.000", col4: "Rp 1.450.000", col5: "Rp 4.250.000", isHighlight: true },
    { col1: "14 Nov 2023", col2: 38, col3: "Rp 2.500.000", col4: "Rp 1.200.000", col5: "Rp 3.700.000" },
    { col1: "13 Nov 2023", col2: 45, col3: "Rp 3.100.000", col4: "Rp 1.800.000", col5: "Rp 4.900.000" },
  ],
  Pengeluaran: [
    { col1: "14 Nov 2023", col2: "Alkes & Obat", col3: "Restock Paracetamol & Amoxicillin", col4: "Transfer", col5: "Rp 12.400.000" },
    { col1: "12 Nov 2023", col2: "Operasional", col3: "Biaya Listrik & Air Klinik", col4: "Auto-debet", col5: "Rp 3.200.000" },
    { col1: "10 Nov 2023", col2: "Alkes & Obat", col3: "Pembelian Alat Suntik & Kasa", col4: "Tunai", col5: "Rp 1.500.000" },
  ],
  "Laba Rugi": [
    { col1: "Minggu Ke-4 (M4)", col2: "Rp 42.500.000", col3: "Rp 16.000.000", col4: "Rp 26.500.000", col5: "62.3%", isBadge: true },
    { col1: "Minggu Ke-3 (M3)", col2: "Rp 32.000.000", col3: "Rp 11.000.000", col4: "Rp 21.000.000", col5: "65.6%", isBadge: true },
    { col1: "Minggu Ke-2 (M2)", col2: "Rp 39.000.000", col3: "Rp 14.000.000", col4: "Rp 25.000.000", col5: "64.1%", isBadge: true },
  ],
  Neraca: [
    { col1: "1-10100", col2: "Kas & Bank Klinik", col3: "Aset Lancar", col4: "Rp 280.000.000", col5: "Rp 320.000.000" },
    { col1: "1-10200", col2: "Persediaan Obat", col3: "Aset Lancar", col4: "Rp 45.000.000", col5: "Rp 58.000.000" },
    { col1: "1-20100", col2: "Alat Medis & USG", col3: "Aset Tetap", col4: "Rp 150.000.000", col5: "Rp 150.000.000" },
  ],
  "Arus Kas": [
    { col1: "15 Nov 2023", col2: "Pelunasan Klaim BPJS", col3: "Rp 51.000.000", col4: "Rp 0", col5: "Rp 320.000.000" },
    { col1: "14 Nov 2023", col2: "Pembayaran Supplier Obat", col3: "Rp 0", col4: "Rp 12.400.000", col5: "Rp 269.000.000" },
    { col1: "13 Nov 2023", col2: "Pendapatan Tunai Harian", col3: "Rp 4.900.000", col4: "Rp 0", col5: "Rp 281.400.000" },
  ],
};

const formatCurrency = (amount: number): string => {
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)}M`;
  } else if (amount >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(1)}K`;
  }
  return `Rp ${amount}`;
};

const getTodayDate = (): string => {
  const today = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
};

export function FinancialDetailTable({ activeTab, onViewAllClick }: FinancialDetailTableProps) {
  // Fetch cashflow data only for Arus Kas tab
  const cashflowQuery = useQuery({
    queryKey: ["cashflowSummary"],
    queryFn: () => analitikService.getCashflowSummary(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: activeTab === "Arus Kas",
  });

  // Generate dynamic data for Arus Kas tab
  const dynamicArusKasData = useMemo(() => {
    if (!cashflowQuery.data?.data) return dummyTableData["Arus Kas"];

    const cashflow = cashflowQuery.data.data;
    const today = getTodayDate();
    const kasKeluar = Math.max(0, cashflow.kas_masuk_harian * 0.4);
    
    return [
      {
        col1: today,
        col2: `${cashflow.total_transaksi_lunas_hari_ini || 0} Transaksi Lunas`,
        col3: formatCurrency(cashflow.kas_masuk_harian),
        col4: formatCurrency(kasKeluar),
        col5: formatCurrency(cashflow.kas_masuk_harian + (cashflow.nilai_total_invoice_belum_lunas || 0)),
        isHighlight: true,
      },
      {
        col1: today,
        col2: `${cashflow.total_transaksi_pending_hari_ini || 0} Transaksi Pending`,
        col3: "Rp 0",
        col4: formatCurrency(cashflow.nilai_total_invoice_belum_lunas || 0),
        col5: formatCurrency(cashflow.nilai_total_invoice_belum_lunas || 0),
      },
      ...dummyTableData["Arus Kas"].slice(1),
    ];
  }, [cashflowQuery.data]);

  const config = tableConfigs[activeTab] || tableConfigs.Pendapatan;
  const rows = activeTab === "Arus Kas" ? dynamicArusKasData : dummyTableData[activeTab] || dummyTableData.Pendapatan;

  return (
    <div className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full flex flex-col justify-between">
      
      {/* HEADER TABLE */}
      <div className="p-6 border-b border-[#DFE6EB] flex items-center justify-between">
        <h3 className="text-base font-bold text-[#13222D]">
          {config.title}
        </h3>
        <Button
          onClick={onViewAllClick}
          variant="ghost"
          className="text-xs font-bold text-[#1B9C90] hover:text-[#157A71] hover:bg-[#F9FEFC] px-3 h-8 rounded-lg transition-colors"
        >
          Lihat Selengkapnya
        </Button>
      </div>

      {/* TABLE WORKSPACE */}
      <div className="overflow-x-auto w-full">
        <Table className="w-full min-w-225 table-fixed">
          <TableHeader>
            <TableRow className="bg-[#F4F7F9] hover:bg-[#F4F7F9] border-none">
              {config.headers.map((header, idx) => (
                <TableHead 
                  key={idx} 
                  className={cn(
                    "text-xs font-bold text-[#67737C] h-12 text-left",
                    idx === 0 && "pl-6",
                    idx === config.headers.length - 1 && "pr-6",
                    config.widths[idx]
                  )}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow 
                key={index} 
                className="border-b border-[#DFE6EB] last:border-none transition-colors hover:bg-[#F9FEFC]"
              >
                <TableCell className="pl-6 py-4 text-xs font-bold text-[#13222D] text-left">
                  {row.col1}
                </TableCell>
                <TableCell className="py-4 text-sm font-medium text-[#67737C] text-left truncate">
                  {row.col2}
                </TableCell>
                <TableCell className="py-4 text-sm font-medium text-[#67737C] text-left">
                  {row.col3}
                </TableCell>
                <TableCell className="py-4 text-sm font-medium text-[#67737C] text-left">
                  {row.col4}
                </TableCell>
                <TableCell className={cn("py-4 text-sm text-left", index === 0 ? "pr-6" : "")}>
                  {row.isBadge ? (
                    <Badge className="bg-[#DFF6F2] text-[#1B9C90] hover:bg-[#DFF6F2] font-bold border-none shadow-none rounded-full px-2.5 py-0.5 text-xs">
                      {row.col5}
                    </Badge>
                  ) : (
                    <span className={cn(
                      "font-bold", 
                      row.isHighlight || activeTab === "Pendapatan" || activeTab === "Laba Rugi" ? "text-[#1B9C90]" : "text-[#13222D]"
                    )}>
                      {row.col5}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* FOOTER PAGINATION BLOCK */}
      <div className="px-6 py-4 border-t border-[#DFE6EB] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F9FEFC]/30">
        <span className="text-xs font-medium text-[#67737C]">
          Menampilkan <span className="text-[#13222D] font-bold">1 - 5</span> dari <span className="text-[#13222D] font-bold">48</span> data entri
        </span>
        
        <div className="flex items-center gap-1.5">
          <Button 
            variant="outline" 
            disabled 
            className="h-8 w-8 p-0 rounded-lg border-[#DFE6EB] text-[#67737C] disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            className="h-8 px-3 rounded-lg text-xs font-bold bg-[#13272F]/5 border-none text-[#1B9C90] shadow-none"
          >
            1
          </Button>
          <Button 
            variant="outline" 
            className="h-8 px-3 rounded-lg text-xs font-bold border-none text-[#67737C] hover:bg-[#F4F7F9] shadow-none"
          >
            2
          </Button>
          <Button 
            variant="outline" 
            className="h-8 px-3 rounded-lg text-xs font-bold border-none text-[#67737C] hover:bg-[#F4F7F9] shadow-none"
          >
            3
          </Button>
          <Button 
            variant="outline" 
            className="h-8 w-8 p-0 rounded-lg border-[#DFE6EB] text-[#67737C] hover:bg-[#F4F7F9]"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

    </div>
  );
}