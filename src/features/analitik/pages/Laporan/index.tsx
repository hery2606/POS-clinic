"use client";

import { useState, type JSX } from "react";
import { FinancialReportHeader } from "@/features/analitik/components/laporan/FinancialReportHeader";
import { FinancialSummaryCards } from "@/features/analitik/components/laporan/FinancialSummaryCards";
import { BalanceSheetChart } from "@/features/analitik/components/laporan/chart/BalanceSheetChart";
import { RevenueTrendChart } from "@/features/analitik/components/laporan/chart/RevenueTrendChart";
import { CashFlowChart } from "@/features/analitik/components/laporan/chart/CashFlowChart";
import { ExpenseTrendChart } from "@/features/analitik/components/laporan/chart/ExpenseTrendChart";
import { ProfitLossChart } from "@/features/analitik/components/laporan/chart/ProfitLossChart";
import {
  FinancialBreakdownCard,
  type BreakdownTabType,
} from "@/features/analitik/components/laporan/FinancialBreakdownCard";
import { FinancialDetailTable } from "@/features/analitik/components/laporan/FinancialDetailTable";
import { cn } from "@/lib/utils";

const tabs = ["Pendapatan", "Pengeluaran", "Laba Rugi", "Neraca", "Arus Kas"];

const chartComponents: Record<string, JSX.Element> = {
  Pendapatan: <RevenueTrendChart />,
  Pengeluaran: <ExpenseTrendChart />,
  "Laba Rugi": <ProfitLossChart />,
  Neraca: <BalanceSheetChart />,
  "Arus Kas": <CashFlowChart />,
};

export const LaporanPage = () => {
  const [selectedChart, setSelectedChart] = useState<string>("Pendapatan");

  return (
    <div className="min-h-screen  p-4 sm:p-6 lg:p-8 space-y-6  animate-in fade-in duration-300">
      <FinancialReportHeader />

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

      <FinancialSummaryCards />

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
    </div>
  );
};

export default LaporanPage;
