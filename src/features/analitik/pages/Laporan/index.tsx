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
import { exportToExcelHelper } from "@/features/analitik/utils/excelExportHelper";
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
  // Piutang data calculations
  // ============================================================
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
    return [];
  }, [outstandingInvoicesQuery.data]);

  const piutangTotalPiutang = useMemo(() => {
    return piutangTransactions.reduce((sum, t) => sum + t.total_tagihan, 0);
  }, [piutangTransactions]);

  const piutangAvgDelay = useMemo(() => {
    if (piutangTransactions.length === 0) return 0;
    return Math.round(piutangTransactions.reduce((sum, t) => sum + t.hari_belum_lunas, 0) / piutangTransactions.length);
  }, [piutangTransactions]);

  const piutangRatio = useMemo(() => {
    if (totalRevenue === 0) return 0;
    return Number(((piutangTotalPiutang / totalRevenue) * 100).toFixed(2));
  }, [piutangTotalPiutang, totalRevenue]);

  const piutangAgingSchedule = useMemo(() => {
    let range1 = 0, range2 = 0, range3 = 0;
    piutangTransactions.forEach(t => {
      if (t.hari_belum_lunas <= 2) range1 += t.total_tagihan;
      else if (t.hari_belum_lunas <= 5) range2 += t.total_tagihan;
      else range3 += t.total_tagihan;
    });
    return [
      { name: "1-2 Hari", amount: range1 },
      { name: "3-5 Hari", amount: range2 },
      { name: "> 7 Hari", amount: range3 }
    ];
  }, [piutangTransactions]);

  const piutangBreakdownProportion = useMemo(() => {
    let umumAmount = 0, bpjsAmount = 0;
    piutangTransactions.forEach(t => {
      if ((t.insurance_type || "UMUM").toUpperCase() === "BPJS") bpjsAmount += t.total_tagihan;
      else umumAmount += t.total_tagihan;
    });
    const total = umumAmount + bpjsAmount;
    if (total === 0) return { umumPercent: 0, bpjsPercent: 0, umumVal: 0, bpjsVal: 0 };
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

    await exportToExcelHelper({
      selectedTab,
      selectedPeriod,
      periodLabel,
      todayStr,
      trendData,
      piutangTransactions,
      piutangTotalPiutang,
      piutangAvgDelay,
      piutangRatio,
      totalRevenue,
    });
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
