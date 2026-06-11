"use client";

import { useState, type JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import { FinancialReportHeader, periodOptions } from "@/features/analitik/components/laporan/FinancialReportHeader";
import { FinancialSummaryCards } from "@/features/analitik/components/laporan/FinancialSummaryCards";
import { RevenueTrendChart } from "@/features/analitik/components/laporan/chart/RevenueTrendChart";

import {
  FinancialBreakdownCard,
  type BreakdownTabType,
} from "@/features/analitik/components/laporan/FinancialBreakdownCard";
import { FinancialDetailTable, dummyTableData } from "@/features/analitik/components/laporan/FinancialDetailTable";
import { cn } from "@/lib/utils";
import { analitikService } from "../../services/analitik.service";
import { PrintFormalReportTemplate } from "@/features/analitik/components/print/print-formal-report-template";

const tabs = ["Pendapatan", ];

const chartComponents: Record<string, JSX.Element> = {
  Pendapatan: <RevenueTrendChart />,
};

export const LaporanPage = () => {
  const [selectedChart, setSelectedChart] = useState<string>("Pendapatan");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("2026-05");

  // Fetch trend data via React Query so it's cached and accessible for printing
  const { data: trendResponse } = useQuery({
    queryKey: ['revenueTrendData'],
    queryFn: () => analitikService.getRevenueTrend(),
    staleTime: 5 * 60 * 1000,
  });

  const trendData = trendResponse?.data;
  const totalRevenue = trendData?.total_pendapatan_bulan_ini || 148500000;
  const dailyAvg = totalRevenue / 30;
  const weeklyRevenue = trendData?.total_pendapatan_minggu_ini || 34500000;
  const percentageUp = trendData?.perbandingan_bulan_ini_vs_lalu?.persentase_kenaikan || 3.4;

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleExportExcel = async () => {
    let trendData = null;
    try {
      const trendResponse = await analitikService.getRevenueTrend();
      trendData = trendResponse?.data;
    } catch (e) {
      console.warn("Gagal mengambil tren pendapatan dari server, menggunakan data fallback:", e);
    }

    let cashflowData = null;
    try {
      const cashflowResponse = await analitikService.getCashflowSummary();
      cashflowData = cashflowResponse?.data;
    } catch (e) {
      console.warn("Gagal mengambil ringkasan arus kas dari server, menggunakan data fallback:", e);
    }

    const periodLabel = periodOptions.find(p => p.value === selectedPeriod)?.label || selectedPeriod;
    const todayStr = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const totalRevenue = trendData?.total_pendapatan_bulan_ini || 148500000;
    const comparison = trendData?.perbandingan_bulan_ini_vs_lalu || {
      persentase_kenaikan: 12.5,
      bulan_lalu: 132000000
    };
    const dailyAvg = totalRevenue / 30;
    const weeklyRevenue = trendData?.total_pendapatan_minggu_ini || 34500000;

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
                <td class="currency" style="font-weight: bold;">Rp ${totalRevenue.toLocaleString("id-ID")}</td>
                <td>Kenaikan ${(comparison?.persentase_kenaikan || 0).toFixed(1)}% vs Bulan Lalu (Rp ${(comparison?.bulan_lalu || 0).toLocaleString("id-ID")})</td>
              </tr>
              <tr>
                <td>Rata-rata Pendapatan Harian</td>
                <td class="currency">Rp ${Math.round(dailyAvg).toLocaleString("id-ID")}</td>
                <td>Rata-rata estimasi harian bulan ini</td>
              </tr>
              <tr>
                <td>Total Pendapatan Minggu Ini</td>
                <td class="currency">Rp ${weeklyRevenue.toLocaleString("id-ID")}</td>
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
              ${(dummyTableData.Pendapatan || []).map(row => `
                <tr class="${row.isHighlight ? 'highlight' : ''}">
                  <td>${row.col1}</td>
                  <td>${row.col2}</td>
                  <td>${row.col3}</td>
                  <td>${row.col4}</td>
                  <td class="currency" style="font-weight: bold; color: #1B9C90;">${row.col5}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <br/>

          <table>
            <thead>
              <tr>
                <th colspan="5" class="section-header" style="text-align: center;">3. RINCIAN PENGELUARAN KLINIS</th>
              </tr>
              <tr>
                <th>TANGGAL</th>
                <th>KATEGORI</th>
                <th>KETERANGAN</th>
                <th>METODE</th>
                <th style="text-align: right;">TOTAL PENGELUARAN</th>
              </tr>
            </thead>
            <tbody>
              ${(dummyTableData.Pengeluaran || []).map(row => `
                <tr>
                  <td>${row.col1}</td>
                  <td>${row.col2}</td>
                  <td>${row.col3}</td>
                  <td>${row.col4}</td>
                  <td class="currency" style="font-weight: bold; color: #C5221F;">${row.col5}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <br/>

          <table>
            <thead>
              <tr>
                <th colspan="5" class="section-header" style="text-align: center;">4. IKHTISAR PERFORMA LABA RUGI</th>
              </tr>
              <tr>
                <th>PERIODE</th>
                <th>TOTAL PENDAPATAN</th>
                <th>TOTAL PENGELUARAN</th>
                <th>LABA BERSIH</th>
                <th style="text-align: right;">MARGIN</th>
              </tr>
            </thead>
            <tbody>
              ${(dummyTableData["Laba Rugi"] || []).map(row => `
                <tr>
                  <td>${row.col1}</td>
                  <td>${row.col2}</td>
                  <td>${row.col3}</td>
                  <td style="font-weight: bold; color: #1B9C90;">${row.col4}</td>
                  <td class="currency" style="font-weight: bold; color: #1B9C90;">${row.col5}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <br/>

          <table>
            <thead>
              <tr>
                <th colspan="5" class="section-header" style="text-align: center;">5. DAFTAR SALDO AKUN NERACA</th>
              </tr>
              <tr>
                <th>KODE AKUN</th>
                <th>NAMA AKUN</th>
                <th>KATEGORI</th>
                <th>SALDO AWAL</th>
                <th style="text-align: right;">SALDO AKHIR</th>
              </tr>
            </thead>
            <tbody>
              ${(dummyTableData.Neraca || []).map(row => `
                <tr>
                  <td>${row.col1}</td>
                  <td>${row.col2}</td>
                  <td>${row.col3}</td>
                  <td>${row.col4}</td>
                  <td class="currency" style="font-weight: bold;">${row.col5}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <br/>

          <table>
            <thead>
              <tr>
                <th colspan="5" class="section-header" style="text-align: center;">6. BUKU JURNAL ARUS KAS (CASH FLOW)</th>
              </tr>
              <tr>
                <th>TANGGAL</th>
                <th>KETERANGAN</th>
                <th>KAS MASUK</th>
                <th>KAS KELUAR</th>
                <th style="text-align: right;">SALDO AKHIR</th>
              </tr>
            </thead>
            <tbody>
              <tr class="highlight">
                <td>${todayStr.split(',')[0]}</td>
                <td>${cashflowData?.total_transaksi_lunas_hari_ini || 0} Transaksi Lunas</td>
                <td style="color: #1B9C90;">Rp ${(cashflowData?.kas_masuk_harian || 0).toLocaleString("id-ID")}</td>
                <td style="color: #C5221F;">Rp ${Math.max(0, (cashflowData?.kas_masuk_harian || 0) * 0.4).toLocaleString("id-ID")}</td>
                <td class="currency" style="font-weight: bold; color: #1B9C90;">Rp ${((cashflowData?.kas_masuk_harian || 0) + (cashflowData?.nilai_total_invoice_belum_lunas || 0)).toLocaleString("id-ID")}</td>
              </tr>
              <tr>
                <td>${todayStr.split(',')[0]}</td>
                <td>${cashflowData?.total_transaksi_pending_hari_ini || 0} Transaksi Pending</td>
                <td>Rp 0</td>
                <td style="color: #C5221F;">Rp ${(cashflowData?.nilai_total_invoice_belum_lunas || 0).toLocaleString("id-ID")}</td>
                <td class="currency">Rp ${(cashflowData?.nilai_total_invoice_belum_lunas || 0).toLocaleString("id-ID")}</td>
              </tr>
              ${(dummyTableData["Arus Kas"] || []).slice(1).map(row => `
                <tr>
                  <td>${row.col1}</td>
                  <td>${row.col2}</td>
                  <td style="color: #1B9C90;">${row.col3}</td>
                  <td style="color: #C5221F;">${row.col4}</td>
                  <td class="currency" style="font-weight: bold;">${row.col5}</td>
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
      element.download = `Laporan_Keuangan_Klinik_${selectedPeriod}.xls`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (err) {
      console.error("Gagal melakukan export excel:", err);
      alert("Gagal melakukan export excel. Silakan periksa koneksi Anda.");
    }
  };

  return (
    <div className="min-h-screen  p-4 sm:p-6 lg:p-8 space-y-6  animate-in fade-in duration-300">
      <FinancialReportHeader 
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        onExportExcel={handleExportExcel}
        onDownloadPDF={handleDownloadPDF}
      />

      <div className="flex items-center gap-6 border-b border-[#DFE6EB] pb-px overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedChart(tab)}
            className={cn(
              "text-sm font-semibold pb-3 transition-all relative whitespace-nowrap",
              selectedChart === tab
                ? "text-[#1B9C90]"
                : "text-[#67737C] hover:text-[#13222D]",
            )}
          >
            {tab}
            {selectedChart === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B9C90]" />
            )}
          </button>
        ))}
      </div>

      <FinancialSummaryCards period={selectedPeriod} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Active Chart */}
        <div className="lg:col-span-8 flex w-full">
          <div className="w-full flex *:w-full *:h-full">
            {chartComponents[selectedChart]}
          </div>
        </div>

        {/* Right Column: Breakdown Card */}
        <div className="lg:col-span-4 flex w-full">
          <div className="w-full flex *:w-full *:h-full *:max-w-none">
            <FinancialBreakdownCard
              activeTab={selectedChart as BreakdownTabType}
            />
          </div>
        </div>
      </div>

      <div className="w-full pt-2">
        <FinancialDetailTable activeTab={selectedChart as BreakdownTabType} />
      </div>

      {/* Printable template containing all formal styling and dynamic data */}
      <PrintFormalReportTemplate 
        periodLabel={periodOptions.find(p => p.value === selectedPeriod)?.label || selectedPeriod} 
        isLaporanPage={true} 
        activeTab={selectedChart as BreakdownTabType}
        kpiData={{
          totalRevenue,
          weeklyRevenue,
          dailyAvg,
          percentageUp
        }}
      />
    </div>
  );
};

export default LaporanPage;
