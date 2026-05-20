import { KpiCards } from "@/features/analitik/components/dashboard/KPICards";
import { AiInsightBanner } from "@/features/analitik/components/dashboard/components/AiInsightBanner";
import { ChartBarMixed } from "@/features/analitik/components/dashboard/components/ChartBarMixed";
import { ChartBarStacked } from "@/features/analitik/components/dashboard/components/ChartBarStacked";
import { PaymentMethodChart } from "@/features/analitik/components/dashboard/components/PaymentMethodChart";
import { InvoiceReminderTable } from "@/features/analitik/components/dashboard/InvoiceReminderTable";
import { ChartAreaInteractive } from "@/features/analitik/components/dashboard/components/ChartAreaInteractive";
import { Card } from "@/components/ui/card";

export const DashboardPage = () => {
  return (
    <div className="min-h-screen  p-6">
      {/* AI Insight Banner */}
      <div className="mb-8">
        <AiInsightBanner />
        <div className="mt-6">
          <ChartAreaInteractive />
        </div>
      </div>

      {/* KPI Cards */}
      <div>
        <h2 className="text-xl font-bold text-[#13222D] mb-4">Metrik Utama</h2>
        <KpiCards />
      </div>

      {/* Bar Charts - 2 Columns */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm">
          <ChartBarStacked />
        </Card>
        <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm">
          <ChartBarMixed />
        </Card>
      </div>
      <div className="mt-12 grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <div className="xl:col-span-5 flex">
          <PaymentMethodChart />
        </div>
        <div className="xl:col-span-7 flex">
          <InvoiceReminderTable className="w-full" />
        </div>
      </div>
    </div>
  );
};
