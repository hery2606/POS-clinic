import { 
  Coins, 
  Calendar, 
  Receipt, 
  Users, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from "@/lib/utils";

const kpiData = [
  {
    title: "Pendapatan Hari Ini",
    value: "Rp 8.5M",
    trend: "+12% vs lalu",
    isPositive: true,
    icon: Coins
  },
  {
    title: "Pendapatan Bulanan",
    value: "Rp 124M",
    trend: "+5% vs lalu",
    isPositive: true,
    icon: Calendar
  },
  {
    title: "Total Transaksi",
    value: "42",
    trend: "+8% vs lalu",
    isPositive: true,
    icon: Receipt
  },
  {
    title: "Total Pasien",
    value: "1,240",
    trend: "+15% vs lalu",
    isPositive: true,
    icon: Users
  },
  {
    title: "Pending Payment",
    value: "12",
    trend: "-2% vs lalu",
    isPositive: false,
    icon: Clock
  },
  {
    title: "Total Piutang",
    value: "Rp 15M",
    trend: "+4% vs lalu",
    isPositive: false, 
    icon: AlertCircle
  }
];

export const KpiCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 w-full">
      {kpiData.map((data, index) => {
        const Icon = data.icon;
        return (
          <Card 
            key={index} 
            className="bg-white rounded-[24px] border border-[#DFE6EB] p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-[#67737C]" />
                <span className="text-xs font-semibold text-[#67737C] tracking-tight">
                  {data.title}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#13222D] tracking-tight">
                {data.value}
              </h3>
            </div>
            
            <div className="mt-2">
              <span className={cn(
                "text-xs font-bold",
                data.isPositive ? "text-[#3EB268]" : "text-[#E62C2C]"
              )}>
                {data.trend}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};