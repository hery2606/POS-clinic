"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { analitikService } from "../../services/analitik.service";
import { dummyTableData, tableConfigs } from "../laporan/pendapatan/FinancialDetailTable";
import { staticBreakdownConfigs, type BreakdownData, type BreakdownTabType } from "../laporan/pendapatan/FinancialBreakdownCard";

// ============================================================
// INTERFACES
// ============================================================

interface PiutangPrintData {
  totalPiutang: number;
  totalPendingTransactions: number;
  averageDelayDays: number;
  piutangRatioPercentage: number;
  agingSchedule: { name: string; amount: number }[];
  breakdownProportion: {
    umumPercent: number;
    bpjsPercent: number;
    umumVal: number;
    bpjsVal: number;
  };
  transactions: {
    no_invoice: string;
    pasien: string;
    total_tagihan: number;
    hari_belum_lunas: number;
    status_reminder: string;
  }[];
}

interface PrintFormalReportTemplateProps {
  periodLabel: string;
  isLaporanPage: boolean;
  activeTab?: BreakdownTabType | "Piutang";
  kpiData?: {
    totalRevenue?: number;
    weeklyRevenue?: number;
    dailyAvg?: number;
    percentageUp?: number;
  };
  piutangData?: PiutangPrintData;
  period?: string;
}

// ============================================================
// COMPONENT
// ============================================================

export const PrintFormalReportTemplate = ({
  periodLabel,
  isLaporanPage,
  activeTab = "Pendapatan",
  kpiData,
  piutangData,
  period,
}: PrintFormalReportTemplateProps) => {
  // -----------------------------------------------------------
  // Queries (only for non-Piutang tabs when on laporan page)
  // -----------------------------------------------------------
  const isPiutangTab = activeTab === "Piutang";

  const cashflowQuery = useQuery({
    queryKey: ["cashflowSummary"],
    queryFn: () => analitikService.getCashflowSummary(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: isLaporanPage && !isPiutangTab,
  });

  const productsQuery = useQuery({
    queryKey: ["productsAnalytics"],
    queryFn: () => analitikService.getProductAnalytics(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: isLaporanPage && activeTab === "Pendapatan",
  });

  const revenueQuery = useQuery({
    queryKey: ["revenueTrendData"],
    queryFn: () => analitikService.getRevenueTrend(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: isLaporanPage && activeTab === "Pendapatan",
  });

  // -----------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------
  const formatCurrency = (amount: number): string => {
    if (amount >= 1_000_000) {
      return `Rp ${(amount / 1_000_000).toFixed(1)}M`;
    } else if (amount >= 1_000) {
      return `Rp ${(amount / 1_000).toFixed(1)}K`;
    }
    return `Rp ${amount}`;
  };

  const formatCurrencyFull = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getTodayDate = (): string => {
    const today = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    return `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
  };

  const getFormattedDate = (daysAgo: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // -----------------------------------------------------------
  // Period calculation
  // -----------------------------------------------------------
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const activePeriod = period || todayStr;

  // -----------------------------------------------------------
  // Dynamic data for Arus Kas tab (Breakdown)
  // -----------------------------------------------------------
  const dynamicArusKasBreakdown = useMemo(() => {
    if (!cashflowQuery.data?.data) return staticBreakdownConfigs["Arus Kas"];

    const cashflow = cashflowQuery.data.data;
    const kasMasuk = cashflow.kas_masuk_harian || 0;
    const kasKeluar = kasMasuk * 0.4;

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

  // -----------------------------------------------------------
  // Dynamic data for Pendapatan tab (Breakdown)
  // -----------------------------------------------------------
  const dynamicPendapatanBreakdown = useMemo(() => {
    if (!productsQuery.data?.data) return staticBreakdownConfigs.Pendapatan;

    const products = productsQuery.data.data;
    const topProducts = products.produk_terlaris_top_10 || [];
    const topServices = products.pemeriksaan_layanan_terlaris || [];

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

  // -----------------------------------------------------------
  // Map active tab to breakdown data source (non-Piutang)
  // -----------------------------------------------------------
  const breakdownData: BreakdownData = useMemo(() => {
    if (isPiutangTab) return staticBreakdownConfigs.Pendapatan; // unused for piutang
    switch (activeTab) {
      case "Arus Kas":
        return dynamicArusKasBreakdown;
      case "Pendapatan":
        return dynamicPendapatanBreakdown;
      default:
        return staticBreakdownConfigs[activeTab as BreakdownTabType];
    }
  }, [activeTab, dynamicArusKasBreakdown, dynamicPendapatanBreakdown, isPiutangTab]);

  // -----------------------------------------------------------
  // Dynamic data for Arus Kas tab (Table Rows)
  // -----------------------------------------------------------
  const dynamicArusKasTableData = useMemo(() => {
    if (!cashflowQuery.data?.data) return dummyTableData["Arus Kas"];

    const cashflow = cashflowQuery.data.data;
    const todayDate = getTodayDate();
    const kasKeluar = Math.max(0, cashflow.kas_masuk_harian * 0.4);

    return [
      {
        col1: todayDate,
        col2: `${cashflow.total_transaksi_lunas_hari_ini || 0} Transaksi Lunas`,
        col3: formatCurrency(cashflow.kas_masuk_harian),
        col4: formatCurrency(kasKeluar),
        col5: formatCurrency(cashflow.kas_masuk_harian + (cashflow.nilai_total_invoice_belum_lunas || 0)),
        isHighlight: true,
      },
      {
        col1: todayDate,
        col2: `${cashflow.total_transaksi_pending_hari_ini || 0} Transaksi Pending`,
        col3: "Rp 0",
        col4: formatCurrency(cashflow.nilai_total_invoice_belum_lunas || 0),
        col5: formatCurrency(cashflow.nilai_total_invoice_belum_lunas || 0),
      },
      ...dummyTableData["Arus Kas"].slice(1),
    ];
  }, [cashflowQuery.data]);

  // -----------------------------------------------------------
  // Dynamic data for Pendapatan tab (Table Rows from API)
  // -----------------------------------------------------------
  const dynamicPendapatanTableData = useMemo(() => {
    if (!revenueQuery.data?.data?.tabel_rincian_harian) {
      return dummyTableData.Pendapatan;
    }

    const rincianHarian = revenueQuery.data.data.tabel_rincian_harian;
    const matchedDays = rincianHarian.filter(
      (item: any) => item.tanggal && item.tanggal.startsWith(activePeriod)
    );

    if (matchedDays.length === 0) {
      if (activePeriod === todayStr) {
        return dummyTableData.Pendapatan;
      }
      return [];
    }

    const sortedMatchedDays = [...matchedDays].sort((a: any, b: any) => b.tanggal.localeCompare(a.tanggal));

    return sortedMatchedDays.map((item: any, index: number) => {
      const dateObj = new Date(item.tanggal);
      const formattedDate = dateObj.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      return {
        col1: formattedDate,
        col2: item.total_transaksi || 0,
        col3: formatCurrencyFull(item.pendapatan_layanan || 0),
        col4: formatCurrencyFull(item.pendapatan_obat || 0),
        col5: formatCurrencyFull(item.total_pendapatan || 0),
        isHighlight: index === 0,
      };
    });
  }, [revenueQuery.data, activePeriod]);

  // -----------------------------------------------------------
  // Resolve table config and rows for non-Piutang tabs
  // -----------------------------------------------------------
  const tableConfig = !isPiutangTab
    ? tableConfigs[(activeTab as BreakdownTabType)] || tableConfigs.Pendapatan
    : tableConfigs.Pendapatan;

  const tableRows = !isPiutangTab
    ? activeTab === "Arus Kas"
      ? dynamicArusKasTableData
      : activeTab === "Pendapatan"
        ? dynamicPendapatanTableData
        : dummyTableData[(activeTab as BreakdownTabType)] || dummyTableData.Pendapatan
    : [];

  // -----------------------------------------------------------
  // RENDER
  // -----------------------------------------------------------
  return (
    <>
      {/* 🔒 INJEKSI STYLE MEDIA PRINT SAKTI (HANYA AKTIF SAAT WINDOW.PRINT() DIPICU) */}
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Sembunyikan elemen pada layar monitor normal */
        @media screen {
          #print-formal-report-template {
            display: none !important;
          }
        }

        @media print {
          /* 1. Sembunyikan semua elemen monitor (Sidebar, Navbar, Header, Tombol) */
          body * {
            visibility: hidden;
          }
          aside, nav, header, .no-print, button, .fixed, .absolute-dropdown {
            display: none !important;
          }
          
          /* 2. Tampilkan HANYA kontainer template laporan formal ini */
          #print-formal-report-template, #print-formal-report-template * {
            visibility: visible;
          }
          #print-formal-report-template {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0px !important;
            margin: 0px !important;
            background: white !important;
          }

          /* 3. Bersihkan sisa teks URL footer otomatis bawaan browser */
          @page {
            size: portrait;
            margin: 15mm;
          }

          /* 4. Page break control untuk tabel panjang */
          .print-page-break-before {
            page-break-before: always;
          }
          tr {
            page-break-inside: avoid !important;
          }
        }
      ` }} />

      {/* ELEMENT TERSEMBUNYI PADA MODE LAYAR MONITOR NORMAL */}
      <div id="print-formal-report-template" className="w-full bg-white text-slate-800 p-2">

        {/* KOP SURAT RESMI KLINIK */}
        <div className="flex items-center justify-between border-b-4 border-[#1B9C90] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#1B9C90] text-white flex items-center justify-center font-black text-2xl">S</div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none m-0">SMARTCLINIK INDONESIA</h1>
              <p className="text-xs text-slate-500 font-medium mt-1 m-0">Jl. Prof. DR. Soepomo SH No.23, Warungboto, Umbulharjo, Yogyakarta</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-black text-[#1B9C90] bg-[#E8F7F5] px-2.5 py-1 rounded-md uppercase tracking-wider">DOKUMEN EKSEKUTIF</span>
            <p className="text-xs text-slate-400 font-semibold mt-1.5 m-0">
              Dicetak: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* JUDUL DOKUMEN */}
        <div className="text-center mb-6">
          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide m-0">
            {isLaporanPage
              ? isPiutangTab
                ? "LAPORAN ANALISIS PIUTANG KLINIK"
                : `LAPORAN KEUANGAN - ${(activeTab as string).toUpperCase()}`
              : "LAPORAN EKSEKUTIF ANALITIK & PENDAPATAN"}
          </h2>
          <p className="text-xs text-slate-500 font-bold mt-1 m-0">
            Periode Frekuensi Analisis: {isLaporanPage ? (isPiutangTab ? "Piutang" : "Keuangan") : "Dashboard Analitik"} ({periodLabel})
          </p>
        </div>

        {/* ================================================================ */}
        {/* KONTEN PIUTANG (hanya render jika activeTab === "Piutang")       */}
        {/* ================================================================ */}
        {isPiutangTab && piutangData && (
          <>
            {/* SECTION I: RINGKASAN EKSEKUTIF PIUTANG */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Total Piutang Keseluruhan</span>
                <h3 className="text-lg font-black text-slate-900 mt-1.5 mb-0">
                  {formatCurrencyFull(piutangData.totalPiutang)}
                </h3>
                <p className="text-[10px] text-[#1B9C90] font-black mt-1 m-0">
                  {piutangData.piutangRatioPercentage}% dari total pendapatan klinik
                </p>
              </div>
              <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Transaksi Pending</span>
                <h3 className="text-lg font-black text-slate-900 mt-1.5 mb-0">
                  {piutangData.totalPendingTransactions} Transaksi
                </h3>
                <p className="text-[10px] text-[#F2A618] font-black mt-1 m-0">
                  Menunggu tindakan penagihan
                </p>
              </div>
              <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Rata-rata Keterlambatan</span>
                <h3 className="text-lg font-black text-slate-900 mt-1.5 mb-0">
                  {piutangData.averageDelayDays} Hari
                </h3>
                <p className={`text-[10px] font-black mt-1 m-0 ${piutangData.averageDelayDays <= 3 ? "text-[#1B9C90]" : "text-[#E62C2C]"}`}>
                  Batas toleransi: 3 Hari — Status: {piutangData.averageDelayDays <= 3 ? "AMAN" : "KRITIS"}
                </p>
              </div>
            </div>

            {/* SECTION II: AGING SCHEDULE */}
            <div className="mb-6">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3 border-l-4 border-[#1B9C90] pl-2 m-0">
                I. Aging Schedule — Distribusi Umur Piutang
              </h3>
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-[#1B9C90] text-white font-black text-[9px] uppercase tracking-wider">
                    <th className="p-2.5 rounded-l-lg pl-3">Kelompok Umur Tunggakan</th>
                    <th className="p-2.5 text-right">Nominal Tertahan</th>
                    <th className="p-2.5 text-right rounded-r-lg pr-3">Proporsi</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-slate-600">
                  {piutangData.agingSchedule.map((aging, idx) => {
                    const totalAging = piutangData.agingSchedule.reduce((s, a) => s + a.amount, 0);
                    const proportion = totalAging > 0 ? ((aging.amount / totalAging) * 100).toFixed(0) : "0";
                    const isKritis = aging.name.includes("7");
                    return (
                      <tr key={idx} className={`border-b border-slate-100 ${isKritis ? "bg-red-50/50" : ""}`}>
                        <td className="p-2.5 pl-3 font-bold text-slate-800">{aging.name}</td>
                        <td className={`p-2.5 text-right font-bold ${isKritis ? "text-[#E62C2C]" : "text-slate-800"}`}>
                          {formatCurrencyFull(aging.amount)}
                        </td>
                        <td className={`p-2.5 pr-3 text-right font-bold ${isKritis ? "text-[#E62C2C]" : "text-[#1B9C90]"}`}>
                          {proportion}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* SECTION III: BREAKDOWN PENJAMIN */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/30">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-2">Breakdown Penjamin Piutang</span>
                <p className="text-[10px] text-slate-500 font-medium mb-3">Proporsi penanggung piutang klinik</p>
                <div className="space-y-2">
                  {/* UMUM */}
                  <div className="space-y-0.5">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>Pasien UMUM (Mandiri)</span>
                      <span>{piutangData.breakdownProportion.umumPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${piutangData.breakdownProportion.umumPercent}%`, backgroundColor: "#1B9C90" }} />
                    </div>
                    <p className="text-[9px] text-slate-500 text-right">Est: {formatCurrencyFull(piutangData.breakdownProportion.umumVal)}</p>
                  </div>
                  {/* BPJS */}
                  <div className="space-y-0.5">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>Klaim BPJS / Asuransi</span>
                      <span>{piutangData.breakdownProportion.bpjsPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${piutangData.breakdownProportion.bpjsPercent}%`, backgroundColor: "#84DFD4" }} />
                    </div>
                    <p className="text-[9px] text-slate-500 text-right">Est: {formatCurrencyFull(piutangData.breakdownProportion.bpjsVal)}</p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/30">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-2">Top 3 Prioritas Penagihan</span>
                <div className="space-y-1.5">
                  {[...piutangData.transactions]
                    .sort((a, b) => b.total_tagihan - a.total_tagihan)
                    .slice(0, 3)
                    .map((debtor, idx) => (
                      <div key={idx} className="flex justify-between items-center px-3 py-1.5 rounded-lg bg-white border border-slate-100 text-xs font-semibold">
                        <span className="text-slate-800 truncate pr-2">#{idx + 1} {debtor.pasien}</span>
                        <span className="text-[#E62C2C] shrink-0 font-bold">{formatCurrencyFull(debtor.total_tagihan)}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* SECTION IV: TABEL DETAIL INVOICE PIUTANG */}
            <div className="mb-6 print-page-break-before">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3 border-l-4 border-[#1B9C90] pl-2 m-0">
                II. Daftar Invoice & Piutang Tertahan Detail
              </h3>
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-[#1B9C90] text-white font-black text-[9px] uppercase tracking-wider">
                    <th className="p-2.5 rounded-l-lg pl-3">Tanggal</th>
                    <th className="p-2.5">No. Invoice</th>
                    <th className="p-2.5">Nama Pasien</th>
                    <th className="p-2.5 text-right">Sisa Tagihan</th>
                    <th className="p-2.5 text-center">Lama Tertunda</th>
                    <th className="p-2.5 text-center rounded-r-lg pr-3">Status Reminder</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-slate-600">
                  {piutangData.transactions.map((trx, idx) => (
                    <tr key={idx} className={`border-b border-slate-100 ${trx.hari_belum_lunas > 7 ? "bg-red-50/30" : ""}`}>
                      <td className="p-2.5 pl-3 font-bold text-slate-800">{getFormattedDate(trx.hari_belum_lunas)}</td>
                      <td className="p-2.5 text-slate-600 font-mono">{trx.no_invoice}</td>
                      <td className="p-2.5 text-slate-800 font-bold truncate">{trx.pasien}</td>
                      <td className="p-2.5 text-right font-bold text-[#1B9C90]">{formatCurrencyFull(trx.total_tagihan)}</td>
                      <td className={`p-2.5 text-center font-bold ${trx.hari_belum_lunas > 7 ? "text-[#E62C2C]" : trx.hari_belum_lunas > 3 ? "text-[#F2A618]" : "text-[#1B9C90]"}`}>
                        {trx.hari_belum_lunas} Hari
                      </td>
                      <td className="p-2.5 pr-3 text-center text-slate-500">{trx.status_reminder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ================================================================ */}
        {/* KONTEN PENDAPATAN / KEUANGAN (non-Piutang tabs)                  */}
        {/* ================================================================ */}
        {!isPiutangTab && (
          <>
            {/* RINGKASAN DATA KPI FINANSIAL */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                  {isLaporanPage ? "Rata-rata Pendapatan Harian" : "Pendapatan Hari Ini"}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1.5 mb-0">
                  {kpiData?.dailyAvg
                    ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(kpiData.dailyAvg)
                    : "Rp 4.950.000"}
                </h3>
                <p className="text-[10px] text-[#1B9C90] font-black mt-1 m-0">
                  ▲ +{kpiData?.percentageUp ? kpiData.percentageUp.toFixed(1) : "3.4"}% vs rata-rata harian
                </p>
              </div>
              <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Pendapatan Minggu Ini</span>
                <h3 className="text-lg font-black text-slate-900 mt-1.5 mb-0">
                  {kpiData?.weeklyRevenue
                    ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(kpiData.weeklyRevenue)
                    : "Rp 34.500.000"}
                </h3>
                <p className="text-[10px] text-[#1B9C90] font-black mt-1 m-0">▲ +4.13% vs target omzet</p>
              </div>
              <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Total Pendapatan Bulanan</span>
                <h3 className="text-lg font-black text-slate-900 mt-1.5 mb-0">
                  {kpiData?.totalRevenue
                    ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(kpiData.totalRevenue)
                    : "Rp 148.500.000"}
                </h3>
                <p className="text-[10px] text-slate-500 font-bold mt-1 m-0">Status Periode Berjalan Aktif</p>
              </div>
            </div>

            {/* SECTION I: BREAKDOWN ANALISIS */}
            {isLaporanPage && (
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/30">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-2">{breakdownData.title}</span>
                  <p className="text-[10px] text-slate-500 font-medium mb-3">{breakdownData.subtitle}</p>
                  <div className="space-y-2">
                    {breakdownData.categories.map((cat, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex justify-between text-xs font-bold text-slate-800">
                          <span>{cat.name}</span>
                          <span>{cat.percentage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/30">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-2">{breakdownData.contributorsTitle}</span>
                  <div className="space-y-1.5">
                    {breakdownData.contributors.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center px-3 py-1.5 rounded-lg bg-white border border-slate-100 text-xs font-semibold">
                        <span className="text-slate-800 truncate pr-2">{item.name}</span>
                        <span className="text-[#1B9C90] shrink-0 font-bold">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION II: TABEL RINCIAN DETIL */}
            <div className="mb-6">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3 border-l-4 border-[#1B9C90] pl-2 m-0">
                {isLaporanPage ? `I. ${tableConfig.title}` : "I. Rincian Laporan Ringkasan"}
              </h3>
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-[#1B9C90] text-white font-black text-[9px] uppercase tracking-wider">
                    {tableConfig.headers.map((header, idx) => (
                      <th key={idx} className={`p-2.5 ${idx === 0 ? 'rounded-l-lg pl-3' : ''} ${idx === tableConfig.headers.length - 1 ? 'text-right rounded-r-lg pr-3' : ''}`}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="font-semibold text-slate-600">
                  {tableRows.length === 0 ? (
                    <tr>
                      <td colSpan={tableConfig.headers.length} className="p-4 text-center text-slate-400 italic">
                        Tidak ada data untuk periode ini
                      </td>
                    </tr>
                  ) : (
                    tableRows.map((row: any, idx: number) => (
                      <tr key={idx} className={`border-b border-slate-100 ${row.isHighlight ? 'bg-[#F9FEFC] text-[#1B9C90]' : ''}`}>
                        <td className="p-2.5 pl-3 font-bold text-slate-800">{row.col1}</td>
                        <td className="p-2.5 text-slate-600 truncate">{row.col2}</td>
                        <td className="p-2.5 text-slate-600">{row.col3}</td>
                        <td className="p-2.5 text-slate-600">{row.col4}</td>
                        <td className={`p-2.5 pr-3 text-right font-bold ${row.isHighlight || activeTab === "Pendapatan" || activeTab === "Laba Rugi" ? 'text-[#1B9C90]' : 'text-slate-800'}`}>
                          {row.col5}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* NOTA OTORISASI TANDA TANGAN */}
        <div className="flex justify-between items-end border-t border-dashed border-slate-200 pt-4 mt-6">
          <p className="text-[9px] font-medium text-slate-400 italic m-0">Dokumen sah diterbitkan otomatis digital melalui sistem SmartClinic RME.</p>
          <div className="text-center w-48">
            <p className="text-xs font-bold text-slate-800 m-0 mb-10">Direktur Operasional,</p>
            <p className="text-xs font-black text-slate-900 border-b border-slate-900 inline-block pb-0.5 m-0">Super Admin, S.Kom</p>
            <p className="text-[9px] text-slate-400 font-bold mt-1 m-0">NIP. 17811099432</p>
          </div>
        </div>

      </div>
    </>
  );
};