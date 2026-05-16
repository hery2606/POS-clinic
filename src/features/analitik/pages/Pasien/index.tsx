"use client";

import { Card } from "@/components/ui/card";
import { LoyalPatientCard } from "@/features/analitik/components/Pasien/LoyalPatientCard";
import { TopSpendingPatients } from "@/features/analitik/components/Pasien/TopSpendingPatients";
import { PatientListTable } from "@/features/analitik/components/Pasien/PatientListTable";
import { PatientOriginCard } from "@/features/analitik/components/Pasien/PatientOriginCard";
import { PatientDemographicsChart } from "@/features/analitik/components/Pasien/PatientDemographicsChart";
import { PatientAnalysisDashboard } from "@/features/analitik/components/Pasien/PatientAnalysisDashboard";

export const PasienPage = () => {
  return (
    <div className="min-h-screen bg-[#F9FEFC]/50 p-4 sm:p-6 lg:p-8 space-y-8 max-w-400 mx-auto animate-in fade-in duration-300">
      <div className="w-full py-2 border border-[#c4d1cf] shadow-sm rounded-[24px] bg-white">
        <div className="p-6">
          <PatientAnalysisDashboard />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <div className="xl:col-span-7 flex w-full">
          <div className="w-full flex *:w-full *:max-w-none">
            <PatientDemographicsChart />
          </div>
        </div>
        <div className="xl:col-span-5 flex w-full">
          <div className="w-full flex *:w-full *:max-w-none">
            <PatientOriginCard />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm flex flex-col justify-between h-full">
          <LoyalPatientCard />
        </Card>
        <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm flex flex-col justify-between h-full">
          <TopSpendingPatients />
        </Card>
      </div>

      <div className="w-full pt-2">
        <PatientListTable />
      </div>
    </div>
  );
};

export default PasienPage;
