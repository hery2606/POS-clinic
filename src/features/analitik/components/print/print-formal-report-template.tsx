"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { analitikService } from "../../services/analitik.service";
import { dummyTableData, tableConfigs } from "../laporan/pendapatan/FinancialDetailTable";
import { staticBreakdownConfigs, type BreakdownData, type BreakdownTabType } from "../laporan/pendapatan/FinancialBreakdownCard";

interface PrintFormalReportTemplateProps {
  periodLabel: string;
  isLaporanPage: boolean;
  activeTab?: BreakdownTabType;
  kpiData?: {
    totalRevenue?: number;
    weeklyRevenue?: number;
    dailyAvg?: number;
    percentageUp?: number;
  };
}

export const PrintFormalReportTemplate = ({
  periodLabel,
  isLaporanPage,
  activeTab = "Pendapatan",
  kpiData
}: PrintFormalReportTemplateProps) => {
  // Fetch cashflow and product data
  const cashflowQuery = useQuery({
    queryKey: ["cashflowSummary"],
    queryFn: () => analitikService.getCashflowSummary(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: isLaporanPage,
  });

  const productsQuery = useQuery({
    queryKey: ["productsAnalytics"],
    queryFn: () => analitikService.getProductAnalytics(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: isLaporanPage && activeTab === "Pendapatan",
  });

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

  // Generate dynamic data for Arus Kas tab (Breakdown)
  const dynamicArusKasBreakdown = useMemo(() => {
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

  // Generate dynamic data for Pendapatan tab (Breakdown)
  const dynamicPendapatanBreakdown = useMemo(() => {
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

  // Map active tab to breakdown data source
  const breakdownData: BreakdownData = useMemo(() => {
    switch (activeTab) {
      case "Arus Kas":
        return dynamicArusKasBreakdown;
      case "Pendapatan":
        return dynamicPendapatanBreakdown;
      default:
        return staticBreakdownConfigs[activeTab];
    }
  }, [activeTab, dynamicArusKasBreakdown, dynamicPendapatanBreakdown]);

  // Generate dynamic data for Arus Kas tab (Table Rows)
  const dynamicArusKasTableData = useMemo(() => {
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

  const tableConfig = tableConfigs[activeTab] || tableConfigs.Pendapatan;
  const tableRows = activeTab === "Arus Kas" ? dynamicArusKasTableData : dummyTableData[activeTab] || dummyTableData.Pendapatan;

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
            {isLaporanPage ? `LAPORAN KEUANGAN - ${activeTab.toUpperCase()}` : "LAPORAN EKSEKUTIF ANALITIK & PENDAPATAN"}
          </h2>
          <p className="text-xs text-slate-500 font-bold mt-1 m-0">
            Periode Frekuensi Analisis: {isLaporanPage ? "Keuangan" : "Dashboard Analitik"} ({periodLabel})
          </p>
        </div>

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
              {tableRows.map((row, idx) => (
                <tr key={idx} className={`border-b border-slate-100 ${row.isHighlight ? 'bg-[#F9FEFC] text-[#1B9C90]' : ''}`}>
                  <td className="p-2.5 pl-3 font-bold text-slate-800">{row.col1}</td>
                  <td className="p-2.5 text-slate-600 truncate">{row.col2}</td>
                  <td className="p-2.5 text-slate-600">{row.col3}</td>
                  <td className="p-2.5 text-slate-600">{row.col4}</td>
                  <td className={`p-2.5 pr-3 text-right font-bold ${row.isHighlight || activeTab === "Pendapatan" || activeTab === "Laba Rugi" ? 'text-[#1B9C90]' : 'text-slate-800'}`}>
                    {row.col5}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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