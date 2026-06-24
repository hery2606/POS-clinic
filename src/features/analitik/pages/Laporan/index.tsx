"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FinancialReportHeader, periodOptions } from "@/features/analitik/components/laporan/FinancialReportHeader";
import { FinancialSummaryCards } from "@/features/analitik/components/laporan/pendapatan/FinancialSummaryCards";
import { RevenueTrendChart } from "@/features/analitik/components/laporan/chart/RevenueTrendChart";
import { FinancialBreakdownCard } from "@/features/analitik/components/laporan/pendapatan/FinancialBreakdownCard";
import { FinancialDetailTable } from "@/features/analitik/components/laporan/pendapatan/FinancialDetailTable";
import { PiutangReportSection } from "@/features/analitik/components/laporan/PiutangReportSection";
import { PrintFormalReportTemplate } from "@/features/analitik/components/print/print-formal-report-template";
import { analitikService } from "../../services/analitik.service";
import { billingPosService } from "@/features/kasir/services/billing.pos.service";
import { cn } from "@/lib/utils";

interface LocalDaftarTransaksiBelumLunas {
  no_invoice: string;
  pasien: string;
  total_tagihan: number;
  hari_belum_lunas: number;
  status_reminder: string;
  wa_number: string;
  insurance_type?: string;
}

const tabs = ["Pendapatan", "Piutang"];

export const LaporanPage = () => {
  const [selectedTab, setSelectedTab] = useState<string>("Pendapatan");
  const [selectedPeriod, setSelectedPeriod] = useState<string>(periodOptions[0]?.value || "2026-06");

  // Fetch pending invoices & revenue trend
  const { data: pendingResponse } = useQuery({
    queryKey: ["pendingInvoices"],
    queryFn: () => analitikService.getPendingInvoices(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: revenueResponse } = useQuery({
    queryKey: ["revenueTrendData"],
    queryFn: () => analitikService.getRevenueTrend(),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch outstanding invoices from POS for piutang data
  const outstandingInvoicesQuery = useQuery({
    queryKey: ["outstandingInvoices"],
    queryFn: () => billingPosService.getOutstandingInvoices(),
    staleTime: 5 * 60 * 1000,
    enabled: selectedTab === "Piutang",
  });

  const trendData = revenueResponse?.data;

  // Determine if selected period is current month
  const todayDate = new Date();
  const currentPeriodStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, "0")}`;
  const isCurrentPeriod = selectedPeriod === currentPeriodStr;

  // Period-aware KPI data computation
  const { totalRevenue, weeklyRevenue, dailyAvg, percentageUp } = useMemo(() => {
    const rincianHarian = trendData?.tabel_rincian_harian || [];
    const matchedDays = rincianHarian.filter(
      (item: any) => item.tanggal && item.tanggal.startsWith(selectedPeriod)
    );

    const tempSum = matchedDays.reduce((sum: number, d: any) => sum + (d.total_pendapatan || 0), 0);

    if (matchedDays.length > 0 && tempSum > 0) {
      // Has data for this period
      const total = tempSum;
      const daily = total / matchedDays.length;
      const sortedDays = [...matchedDays].sort((a: any, b: any) => a.tanggal.localeCompare(b.tanggal));
      const last7 = sortedDays.slice(-7);
      const weekly = last7.reduce((sum: number, d: any) => sum + (d.total_pendapatan || 0), 0);
      const pctUp = trendData?.perbandingan_bulan_ini_vs_lalu?.persentase_kenaikan || 0;
      return { totalRevenue: total, weeklyRevenue: weekly, dailyAvg: daily, percentageUp: pctUp };
    } else if (isCurrentPeriod) {
      // Current month but no rincian harian → use summary fields
      const total = trendData?.total_pendapatan_bulan_ini || 0;
      const weekly = trendData?.total_pendapatan_minggu_ini || 0;
      const daily = total > 0 ? total / 30 : 0;
      const pctUp = trendData?.perbandingan_bulan_ini_vs_lalu?.persentase_kenaikan || 0;
      return { totalRevenue: total, weeklyRevenue: weekly, dailyAvg: daily, percentageUp: pctUp };
    } else {
      // Past/future period with no data → all zero
      return { totalRevenue: 0, weeklyRevenue: 0, dailyAvg: 0, percentageUp: 0 };
    }
  }, [trendData, selectedPeriod, isCurrentPeriod]);

  // ============================================================
  // Piutang data calculations (mirrors PiutangReportSection logic)
  // ============================================================
  const fallbackTransactions = useMemo<LocalDaftarTransaksiBelumLunas[]>(() => [
    { no_invoice: "INV-2026-001", pasien: "Budi Santoso", total_tagihan: 120000, hari_belum_lunas: 1, status_reminder: "Belum Dikirim", wa_number: "081234567890", insurance_type: "BPJS" },
    { no_invoice: "INV-2026-002", pasien: "Siti Aminah", total_tagihan: 100000, hari_belum_lunas: 2, status_reminder: "Belum Dikirim", wa_number: "082345678901", insurance_type: "UMUM" },
    { no_invoice: "INV-2026-003", pasien: "Ahmad Dahlan", total_tagihan: 60000, hari_belum_lunas: 3, status_reminder: "Belum Dikirim", wa_number: "083456789012", insurance_type: "UMUM" },
    { no_invoice: "INV-2026-004", pasien: "Dewi Lestari", total_tagihan: 40000, hari_belum_lunas: 5, status_reminder: "Belum Dikirim", wa_number: "084567890123", insurance_type: "UMUM" },
    { no_invoice: "INV-2026-005", pasien: "Eko Prasetyo", total_tagihan: 50000, hari_belum_lunas: 8, status_reminder: "Belum Dikirim", wa_number: "085678901234", insurance_type: "BPJS" },
    { no_invoice: "INV-2026-006", pasien: "Farhan Hakim", total_tagihan: 40000, hari_belum_lunas: 9, status_reminder: "Belum Dikirim", wa_number: "086789012345", insurance_type: "UMUM" },
    { no_invoice: "INV-2026-007", pasien: "Gita Gutawa", total_tagihan: 20000, hari_belum_lunas: 10, status_reminder: "Belum Dikirim", wa_number: "087890123456", insurance_type: "UMUM" },
    { no_invoice: "INV-2026-008", pasien: "Hendra Wijaya", total_tagihan: 10000, hari_belum_lunas: 12, status_reminder: "Belum Dikirim", wa_number: "088901234567", insurance_type: "BPJS" },
  ], []);

  const piutangTransactions = useMemo<LocalDaftarTransaksiBelumLunas[]>(() => {
    const apiData = outstandingInvoicesQuery.data?.data;
    if (apiData && apiData.length > 0) {
      return apiData.map((item: any) => ({
        no_invoice: `INV-2026-${item.id.split("-")[0].toUpperCase()}`,
        pasien: item.patient?.name || "Pasien",
        total_tagihan: item.remainingAmount || item.total || 0,
        hari_belum_lunas: item.daysPending || 1,
        status_reminder: "Belum Dikirim",
        wa_number: item.patient?.phone || "0812XXXXXXXX",
        insurance_type: item.patient?.insuranceType || "UMUM",
      }));
    }
    return fallbackTransactions;
  }, [outstandingInvoicesQuery.data, fallbackTransactions]);

  const piutangTotalPiutang = useMemo(() => {
    return piutangTransactions.reduce((sum, t) => sum + t.total_tagihan, 0) || 440000;
  }, [piutangTransactions]);

  const piutangAvgDelay = useMemo(() => {
    if (piutangTransactions.length === 0) return 2;
    return Math.round(piutangTransactions.reduce((sum, t) => sum + t.hari_belum_lunas, 0) / piutangTransactions.length) || 2;
  }, [piutangTransactions]);

  const piutangRatio = useMemo(() => {
    if (totalRevenue === 0) return 0.3;
    return Number(((piutangTotalPiutang / totalRevenue) * 100).toFixed(2));
  }, [piutangTotalPiutang, totalRevenue]);

  const piutangAgingSchedule = useMemo(() => {
    let range1 = 0, range2 = 0, range3 = 0;
    piutangTransactions.forEach(t => {
      if (t.hari_belum_lunas <= 2) range1 += t.total_tagihan;
      else if (t.hari_belum_lunas <= 5) range2 += t.total_tagihan;
      else range3 += t.total_tagihan;
    });
    if (range1 === 0 && range2 === 0 && range3 === 0) {
      return [{ name: "1-2 Hari", amount: 220000 }, { name: "3-5 Hari", amount: 100000 }, { name: "> 7 Hari", amount: 120000 }];
    }
    return [{ name: "1-2 Hari", amount: range1 }, { name: "3-5 Hari", amount: range2 }, { name: "> 7 Hari", amount: range3 }];
  }, [piutangTransactions]);

  const piutangBreakdownProportion = useMemo(() => {
    let umumAmount = 0, bpjsAmount = 0;
    piutangTransactions.forEach(t => {
      if ((t.insurance_type || "UMUM").toUpperCase() === "BPJS") bpjsAmount += t.total_tagihan;
      else umumAmount += t.total_tagihan;
    });
    const total = umumAmount + bpjsAmount;
    if (total === 0) return { umumPercent: 70, bpjsPercent: 30, umumVal: 308000, bpjsVal: 132000 };
    const umumPercent = Math.round((umumAmount / total) * 100);
    return { umumPercent, bpjsPercent: 100 - umumPercent, umumVal: umumAmount, bpjsVal: bpjsAmount };
  }, [piutangTransactions]);

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleExportExcel = async () => {
    const periodLabel = periodOptions.find(p => p.value === selectedPeriod)?.label || selectedPeriod;
    const todayStr = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const formatCurrencyExcel = (amount: number): string => {
      return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount || 0);
    };

    if (selectedTab === "Pendapatan") {
      // Fetch fresh trend data for export
      let trendExportData = null;
      try {
        const trendResponse = await analitikService.getRevenueTrend();
        trendExportData = trendResponse?.data;
      } catch (e) {
        console.warn("Gagal mengambil tren pendapatan dari server, menggunakan data fallback:", e);
      }

      const revTotal = trendExportData?.total_pendapatan_bulan_ini || 148500000;
      const comparison = trendExportData?.perbandingan_bulan_ini_vs_lalu || {
        persentase_kenaikan: 12.5,
        bulan_lalu: 132000000
      };
      const dailyAverage = revTotal / 30;
      const weeklyRevenueAmount = trendExportData?.total_pendapatan_minggu_ini || 34500000;

      // Build dynamic table rows from API data (tabel_rincian_harian)
      let tableRowsHtml = "";
      const rincianHarian = trendExportData?.tabel_rincian_harian || [];
      const matchedDays = rincianHarian.filter(
        (item: any) => item.tanggal && item.tanggal.startsWith(selectedPeriod)
      );

      if (matchedDays.length > 0) {
        // Sort descending by date
        const sortedDays = [...matchedDays].sort((a: any, b: any) => b.tanggal.localeCompare(a.tanggal));
        tableRowsHtml = sortedDays.map((item: any, index: number) => {
          const dateObj = new Date(item.tanggal);
          const formattedDate = dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
          const isHighlight = index === 0;
          return `
            <tr class="${isHighlight ? 'highlight' : ''}">
              <td>${formattedDate}</td>
              <td>${item.total_transaksi || 0}</td>
              <td>${formatCurrencyExcel(item.pendapatan_layanan || 0)}</td>
              <td>${formatCurrencyExcel(item.pendapatan_obat || 0)}</td>
              <td class="currency" style="font-weight: bold; color: #1B9C90;">${formatCurrencyExcel(item.total_pendapatan || 0)}</td>
            </tr>
          `;
        }).join("");
      } else {
        // Fallback to dummy data if no API data
        const { dummyTableData } = await import("@/features/analitik/components/laporan/pendapatan/FinancialDetailTable");
        tableRowsHtml = (dummyTableData.Pendapatan || []).map((row: any) => `
          <tr class="${row.isHighlight ? 'highlight' : ''}">
            <td>${row.col1}</td>
            <td>${row.col2}</td>
            <td>${row.col3}</td>
            <td>${row.col4}</td>
            <td class="currency" style="font-weight: bold; color: #1B9C90;">${row.col5}</td>
          </tr>
        `).join("");
      }

      let html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Laporan Finansial</x:Name>
                  <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
          <style>
            body { font-family: Arial, sans-serif; }
            .title { font-size: 16pt; font-weight: bold; color: #13222D; }
            .subtitle { font-size: 11pt; color: #67737C; margin-bottom: 20px; }
            .section-header { font-size: 12pt; font-weight: bold; background-color: #1B9C90; color: white; padding: 6px; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 30px; }
            th { background-color: #F4F7F9; color: #67737C; font-weight: bold; font-size: 10pt; border: 1px solid #DFE6EB; padding: 8px; text-align: left; }
            td { border: 1px solid #DFE6EB; padding: 8px; font-size: 10pt; color: #13222D; }
            .highlight { background-color: #F9FEFC; font-weight: bold; color: #1B9C90; }
            .currency { text-align: right; }
          </style>
        </head>
        <body>
          <div class="title">Klinik Utama Arda Medical Center</div>
          <div class="subtitle">Laporan Analisis Finansial Terpadu<br/>Periode: ${periodLabel}<br/>Tanggal Ekspor: ${todayStr} WIB</div>
          <br/>
          
          <table>
            <thead>
              <tr>
                <th colspan="3" class="section-header" style="text-align: center;">1. RINGKASAN EKSEKUTIF (FINANCIAL SUMMARY)</th>
              </tr>
              <tr>
                <th>METRIK FINANSIAL</th>
                <th style="text-align: right;">NILAI</th>
                <th>KETERANGAN / PERBANDINGAN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Pendapatan Bulan Ini</td>
                <td class="currency" style="font-weight: bold;">Rp ${revTotal.toLocaleString("id-ID")}</td>
                <td>Kenaikan ${(comparison?.persentase_kenaikan || 0).toFixed(1)}% vs Bulan Lalu (Rp ${(comparison?.bulan_lalu || 0).toLocaleString("id-ID")})</td>
              </tr>
              <tr>
                <td>Rata-rata Pendapatan Harian</td>
                <td class="currency">Rp ${Math.round(dailyAverage).toLocaleString("id-ID")}</td>
                <td>Rata-rata estimasi harian bulan ini</td>
              </tr>
              <tr>
                <td>Total Pendapatan Minggu Ini</td>
                <td class="currency">Rp ${weeklyRevenueAmount.toLocaleString("id-ID")}</td>
                <td>Pendapatan berjalan minggu ini</td>
              </tr>
            </tbody>
          </table>
          <br/>

          <table>
            <thead>
              <tr>
                <th colspan="5" class="section-header" style="text-align: center;">2. RINCIAN PENDAPATAN HARIAN</th>
              </tr>
              <tr>
                <th>TANGGAL</th>
                <th>TOTAL TRANSAKSI</th>
                <th>PENDAPATAN LAYANAN</th>
                <th>PENDAPATAN OBAT</th>
                <th style="text-align: right;">TOTAL PENDAPATAN</th>
              </tr>
            </thead>
            <tbody>
              ${tableRowsHtml}
            </tbody>
          </table>
          <br/>
        </body>
        </html>
      `;

      try {
        const element = document.createElement("a");
        const file = new Blob([html], { type: "application/vnd.ms-excel" });
        element.href = URL.createObjectURL(file);
        element.download = `Laporan_Keuangan_Klinik_${selectedPeriod}.xls`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      } catch (err) {
        console.error("Gagal melakukan export excel:", err);
        alert("Gagal melakukan export excel. Silakan periksa koneksi Anda.");
      }

    } else {
      // export for Piutang — using calculated piutang data
      const transactionsToExport = piutangTransactions;
      const exportTotalPiutang = piutangTotalPiutang;
      const exportAvgDelay = piutangAvgDelay;
      const exportRatio = piutangRatio;

      const getFormattedDate = (daysAgo: number) => {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
      };

      let age1_2 = 0;
      let age3_5 = 0;
      let ageMore7 = 0;
      transactionsToExport.forEach(t => {
        if (t.hari_belum_lunas <= 2) age1_2 += t.total_tagihan;
        else if (t.hari_belum_lunas <= 5) age3_5 += t.total_tagihan;
        else ageMore7 += t.total_tagihan;
      });

      let html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Analisis Piutang Klinik</x:Name>
                  <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
            <![endif]-->
          <style>
            body { font-family: Arial, sans-serif; }
            .title { font-size: 16pt; font-weight: bold; color: #13222D; }
            .subtitle { font-size: 11pt; color: #67737C; margin-bottom: 20px; }
            .section-header { font-size: 12pt; font-weight: bold; background-color: #1B9C90; color: white; padding: 6px; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 30px; }
            th { background-color: #F4F7F9; color: #67737C; font-weight: bold; font-size: 10pt; border: 1px solid #DFE6EB; padding: 8px; text-align: left; }
            td { border: 1px solid #DFE6EB; padding: 8px; font-size: 10pt; color: #13222D; }
            .highlight { background-color: #F9FEFC; font-weight: bold; color: #1B9C90; }
            .currency { text-align: right; }
            .warning-text { color: #E62C2C; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="title">Klinik Utama Arda Medical Center</div>
          <div class="subtitle">Laporan Analisis Piutang Klinik Terpadu<br/>Periode: ${periodLabel}<br/>Tanggal Ekspor: ${todayStr} WIB</div>
          <br/>
          
          <table>
            <thead>
              <tr>
                <th colspan="3" class="section-header" style="text-align: center;">1. RINGKASAN EKSEKUTIF PIUTANG TERTAHAN</th>
              </tr>
              <tr>
                <th>METRIK ANALISIS</th>
                <th style="text-align: right;">NILAI</th>
                <th>STATUS / KETERANGAN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Piutang (Bulan Ini)</td>
                <td class="currency" style="font-weight: bold;">Rp ${exportTotalPiutang.toLocaleString("id-ID")}</td>
                <td>Porsi: ${exportRatio}% dari Pendapatan Bulanan (Rp ${totalRevenue.toLocaleString("id-ID")})</td>
              </tr>
              <tr>
                <td>Transaksi Pending Belum Lunas</td>
                <td class="currency" style="font-weight: bold;">${transactionsToExport.length} Transaksi</td>
                <td>Menunggu tindakan penagihan/WA Reminder</td>
              </tr>
              <tr>
                <td>Rata-rata Keterlambatan</td>
                <td class="currency" style="font-weight: bold;">${exportAvgDelay} Hari</td>
                <td class="highlight">Batas toleransi: 3 Hari (Status: ${exportAvgDelay <= 3 ? "AMAN" : "KRITIS"})</td>
              </tr>
            </tbody>
          </table>
          <br/>

          <table>
            <thead>
              <tr>
                <th colspan="3" class="section-header" style="text-align: center;">2. AGING SCHEDULE (DISTRIBUSI UMUR PIUTANG)</th>
              </tr>
              <tr>
                <th>KELOMPOK UMUR TUNGGAKAN</th>
                <th style="text-align: right;">NOMINAL TERTAHAN</th>
                <th>PROPORSI ESTIMASI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1-2 Hari (Keterlambatan Awal)</td>
                <td class="currency">Rp ${age1_2.toLocaleString("id-ID")}</td>
                <td>${exportTotalPiutang > 0 ? ((age1_2 / exportTotalPiutang) * 100).toFixed(0) : 0}% dari total piutang</td>
              </tr>
              <tr>
                <td>3-5 Hari (Perhatian Khusus)</td>
                <td class="currency">Rp ${age3_5.toLocaleString("id-ID")}</td>
                <td>${exportTotalPiutang > 0 ? ((age3_5 / exportTotalPiutang) * 100).toFixed(0) : 0}% dari total piutang</td>
              </tr>
              <tr>
                <td>&gt; 7 Hari (Tindakan Kritis)</td>
                <td class="currency" style="color: #E62C2C;">Rp ${ageMore7.toLocaleString("id-ID")}</td>
                <td class="warning-text">${exportTotalPiutang > 0 ? ((ageMore7 / exportTotalPiutang) * 100).toFixed(0) : 0}% - Prioritas WhatsApp CRM</td>
              </tr>
            </tbody>
          </table>
          <br/>

          <table>
            <thead>
              <tr>
                <th colspan="7" class="section-header" style="text-align: center;">3. DAFTAR INVOICE & PIUTANG TERTAHAN DETAIL</th>
              </tr>
              <tr>
                <th>TANGGAL INVOICE</th>
                <th>NO. INVOICE</th>
                <th>NAMA PASIEN</th>
                <th>NOMOR WHATSAPP</th>
                <th style="text-align: right;">SISA TAGIHAN</th>
                <th>LAMA TERTUNDA</th>
                <th>STATUS REMINDER</th>
              </tr>
            </thead>
            <tbody>
              ${transactionsToExport.map(row => `
                <tr>
                  <td>${getFormattedDate(row.hari_belum_lunas)}</td>
                  <td style="font-family: monospace;">${row.no_invoice}</td>
                  <td>${row.pasien}</td>
                  <td>${row.wa_number}</td>
                  <td class="currency" style="font-weight: bold; color: #1B9C90;">Rp ${row.total_tagihan.toLocaleString("id-ID")}</td>
                  <td>${row.hari_belum_lunas} Hari</td>
                  <td>${row.status_reminder}</td>
                </tr>
              `).join('')}
          </tbody>
          </table>
        </body>
        </html>
      `;

      try {
        const element = document.createElement("a");
        const file = new Blob([html], { type: "application/vnd.ms-excel" });
        element.href = URL.createObjectURL(file);
        element.download = `Laporan_Analisis_Piutang_Klinik_${selectedPeriod}.xls`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      } catch (err) {
        console.error("Gagal melakukan export excel:", err);
        alert("Gagal melakukan export excel. Silakan periksa koneksi Anda.");
      }
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-300">

      {/* Print styles are now handled by PrintFormalReportTemplate for both tabs */}

      <FinancialReportHeader
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        onExportExcel={handleExportExcel}
        onDownloadPDF={handleDownloadPDF}
      />

      {/* TABS SELECTION BAR */}
      <div className="flex items-center gap-6 border-b border-[#DFE6EB] pb-px overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={cn(
              "text-sm font-semibold pb-3 transition-all relative whitespace-nowrap",
              selectedTab === tab
                ? "text-[#1B9C90]"
                : "text-[#67737C] hover:text-[#13222D]",
            )}
          >
            {tab}
            {selectedTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B9C90]" />
            )}
          </button>
        ))}
      </div>

      {/* CONDITIONAL CONTENT RENDERING */}
      {selectedTab === "Pendapatan" ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <FinancialSummaryCards period={selectedPeriod} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Column: Active Chart */}
            <div className="lg:col-span-8 flex w-full">
              <div className="w-full flex *:w-full *:h-full">
                <RevenueTrendChart />
              </div>
            </div>

            {/* Right Column: Breakdown Card */}
            <div className="lg:col-span-4 flex w-full">
              <div className="w-full flex *:w-full *:h-full *:max-w-none">
                <FinancialBreakdownCard activeTab="Pendapatan" period={selectedPeriod} />
              </div>
            </div>
          </div>

          <div className="w-full pt-2">
            <FinancialDetailTable activeTab="Pendapatan" period={selectedPeriod} />
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          <PiutangReportSection />
        </div>
      )}

      {/* Printable template for both Pendapatan & Piutang tabs */}
      <PrintFormalReportTemplate
        periodLabel={periodOptions.find(p => p.value === selectedPeriod)?.label || selectedPeriod}
        isLaporanPage={true}
        activeTab={selectedTab as any}
        period={selectedPeriod}
        kpiData={{
          totalRevenue,
          weeklyRevenue,
          dailyAvg,
          percentageUp
        }}
        piutangData={selectedTab === "Piutang" ? {
          totalPiutang: piutangTotalPiutang,
          totalPendingTransactions: piutangTransactions.length,
          averageDelayDays: piutangAvgDelay,
          piutangRatioPercentage: piutangRatio,
          agingSchedule: piutangAgingSchedule,
          breakdownProportion: piutangBreakdownProportion,
          transactions: piutangTransactions.map(t => ({
            no_invoice: t.no_invoice,
            pasien: t.pasien,
            total_tagihan: t.total_tagihan,
            hari_belum_lunas: t.hari_belum_lunas,
            status_reminder: t.status_reminder,
          })),
        } : undefined}
      />

    </div>
  );
};

export default LaporanPage;
