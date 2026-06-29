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

export const LaporanPage = () => {
  const [selectedTab, setSelectedTab] = useState("Pendapatan");
  const [selectedPeriod, setSelectedPeriod] = useState(periodOptions[0]?.value || "2026-06");

  // ponytail: Removed unused pendingInvoicesQuery that was literally doing nothing

  const { data: revenueResponse } = useQuery({
    queryKey: ["revenueTrendData"],
    queryFn: analitikService.getRevenueTrend,
    staleTime: 300000,
  });

  const { data: outstandingResponse } = useQuery({
    queryKey: ["outstandingInvoices"],
    queryFn: billingPosService.getOutstandingInvoices,
    staleTime: 300000,
  });

  const kpiData = useMemo(() => {
    const dData = revenueResponse?.data;
    const days = (dData?.tabel_rincian_harian || []).filter((i: any) => i.tanggal?.startsWith(selectedPeriod));
    const total = days.reduce((s: number, d: any) => s + (d.total_pendapatan || 0), 0);
    const pctUp = dData?.perbandingan_bulan_ini_vs_lalu?.persentase_kenaikan || 0;
    
    if (days.length && total > 0) {
      const w = [...days].sort((a, b) => a.tanggal.localeCompare(b.tanggal)).slice(-7).reduce((s, d) => s + (d.total_pendapatan || 0), 0);
      return { totalRevenue: total, weeklyRevenue: w, dailyAvg: total / days.length, percentageUp: pctUp };
    }
    
    const curr = new Date();
    if (selectedPeriod === `${curr.getFullYear()}-${String(curr.getMonth() + 1).padStart(2, "0")}`) {
      const t = dData?.total_pendapatan_bulan_ini || 0;
      return { totalRevenue: t, weeklyRevenue: dData?.total_pendapatan_minggu_ini || 0, dailyAvg: t / 30 || 0, percentageUp: pctUp };
    }
    return { totalRevenue: 0, weeklyRevenue: 0, dailyAvg: 0, percentageUp: 0 };
  }, [revenueResponse?.data, selectedPeriod]);

  const piutangData = useMemo(() => {
    const txs = (outstandingResponse?.data || []).map((i: any) => ({
      no_invoice: `INV-2026-${i.id.split("-")[0].toUpperCase()}`,
      pasien: i.patient?.name || "Pasien",
      total_tagihan: i.remainingAmount || i.total || 0,
      hari_belum_lunas: i.daysPending || 1,
      status_reminder: "Belum Dikirim",
      wa_number: i.patient?.phone || "0812XXXXXXXX",
      insurance_type: i.patient?.insuranceType || "UMUM",
    }));

    let total = 0, delay = 0, r1 = 0, r2 = 0, r3 = 0, umum = 0, bpjs = 0;
    txs.forEach((t: any) => {
      total += t.total_tagihan; delay += t.hari_belum_lunas;
      if (t.hari_belum_lunas <= 2) r1 += t.total_tagihan; else if (t.hari_belum_lunas <= 5) r2 += t.total_tagihan; else r3 += t.total_tagihan;
      if ((t.insurance_type || "UMUM").toUpperCase() === "BPJS") bpjs += t.total_tagihan; else umum += t.total_tagihan;
    });

    const uPct = total === 0 ? 0 : Math.round((umum / (umum + bpjs)) * 100);
    return {
      totalPiutang: total,
      totalPendingTransactions: txs.length,
      averageDelayDays: txs.length ? Math.round(delay / txs.length) : 0,
      piutangRatioPercentage: kpiData.totalRevenue ? Number(((total / kpiData.totalRevenue) * 100).toFixed(2)) : 0,
      agingSchedule: [{ name: "1-2 Hari", amount: r1 }, { name: "3-5 Hari", amount: r2 }, { name: "> 7 Hari", amount: r3 }],
      breakdownProportion: { umumPercent: uPct, bpjsPercent: 100 - uPct, umumVal: umum, bpjsVal: bpjs },
      transactions: txs // ponytail: no need to re-map this 1:1 down in the JSX
    };
  }, [outstandingResponse?.data, kpiData.totalRevenue]);

  const handleExportExcel = async () => exportToExcelHelper({
    selectedTab, selectedPeriod, todayStr: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    periodLabel: periodOptions.find(p => p.value === selectedPeriod)?.label || selectedPeriod, trendData: revenueResponse?.data,
    piutangTransactions: piutangData.transactions, piutangTotalPiutang: piutangData.totalPiutang, piutangAvgDelay: piutangData.averageDelayDays,
    piutangRatio: piutangData.piutangRatioPercentage, totalRevenue: kpiData.totalRevenue,
  });

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-300">
      <FinancialReportHeader selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} onExportExcel={handleExportExcel} onDownloadPDF={() => window.print()} />

      <div className="flex items-center gap-6 border-b border-[#DFE6EB] pb-px overflow-x-auto scrollbar-none">
        {["Pendapatan", "Piutang"].map((tab) => (
          <button key={tab} onClick={() => setSelectedTab(tab)} className={cn("text-sm font-semibold pb-3 transition-all relative whitespace-nowrap flex items-center gap-2", selectedTab === tab ? "text-[#1B9C90]" : "text-[#67737C] hover:text-[#13222D]")}>
            <span>{tab}</span>
            {tab === "Piutang" && outstandingResponse?.data?.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-5 h-5 flex items-center justify-center animate-pulse">{outstandingResponse.data.length}</span>
            )}
            {selectedTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B9C90]" />}
          </button>
        ))}
      </div>

      {selectedTab === "Pendapatan" ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <FinancialSummaryCards period={selectedPeriod} />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* ponytail: removed redundant div wrapping chains */}
            <div className="lg:col-span-8 flex w-full *:w-full *:h-full"><RevenueTrendChart /></div>
            <div className="lg:col-span-4 flex w-full *:w-full *:h-full *:max-w-none"><FinancialBreakdownCard activeTab="Pendapatan" period={selectedPeriod} /></div>
          </div>
          <div className="w-full pt-2"><FinancialDetailTable activeTab="Pendapatan" period={selectedPeriod} /></div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-300"><PiutangReportSection /></div>
      )}

      <PrintFormalReportTemplate
        periodLabel={periodOptions.find(p => p.value === selectedPeriod)?.label || selectedPeriod}
        isLaporanPage={true} activeTab={selectedTab as any} period={selectedPeriod}
        kpiData={kpiData} piutangData={selectedTab === "Piutang" ? piutangData : undefined}
      />
    </div>
  );
};

export default LaporanPage;
