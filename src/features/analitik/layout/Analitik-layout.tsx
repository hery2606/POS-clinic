import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./sidebar/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AnalitikHeader } from "./Analitik-header";
import { type PeriodType } from "./periodOptionsConfig";
import { ClinicBot } from "@/features/analitik/components/Chatbot/ClinicBot";

export const AnalitikLayout: React.FC = () => {
  const currentYearStr = String(new Date().getFullYear());
  const prevYearStr = String(new Date().getFullYear() - 1);

  // Lifted state for dashboard filters
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("daily");
  const [monthlyYear, setMonthlyYear] = useState(currentYearStr);
  const [startMonth, setStartMonth] = useState("3"); 
  const [endMonth, setEndMonth] = useState("6"); 
  const [startYear, setStartYear] = useState(prevYearStr);
  const [endYear, setEndYear] = useState(currentYearStr);

  return (
    <SidebarProvider>
      <AppSidebar />
      
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden bg-[#F9FEFC] dark:bg-[#0B131A]">
        <div className="sticky top-0 z-20 bg-[#F9FEFC] dark:bg-[#0B131A] px-6 lg:px-8 pt-6 border-b-2 border-slate-100 dark:border-slate-800">
          <AnalitikHeader 
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            monthlyYear={monthlyYear}
            setMonthlyYear={setMonthlyYear}
            startMonth={startMonth}
            setStartMonth={setStartMonth}
            endMonth={endMonth}
            setEndMonth={setEndMonth}
            startYear={startYear}
            setStartYear={setStartYear}
            endYear={endYear}
            setEndYear={setEndYear}
          />
        </div>

        <SidebarInset className="flex-1 overflow-hidden bg-[#EFF4F8] dark:bg-[#080F14] text-slate-900 dark:text-slate-100">
          <main className="h-full overflow-y-auto px-6 lg:px-8 py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <Outlet context={{ selectedPeriod, monthlyYear, startMonth, endMonth, startYear, endYear }} />
          </main>
        </SidebarInset>
      </div>
      <ClinicBot />
    </SidebarProvider>
  );
};

export default AnalitikLayout;
