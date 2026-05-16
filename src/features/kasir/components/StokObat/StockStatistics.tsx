import { 
  Package, 
  AlertCircle, 
  XCircle, 
  Wallet 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from "@/lib/utils";

export const StockStatistics = () => {
  const stats = [
    {
      title: "Total Item",
      value: "1,245",
      unit: "Item",
      icon: Package,
      bgColor: "bg-white",
      borderColor: "border-[#DFE6EB]",
      textColor: "text-[#13222D]",
      iconColor: "text-[#67737C]"
    },
    {
      title: "Stok Menipis",
      value: "24",
      unit: "Item",
      icon: AlertCircle,
      bgColor: "bg-[#FFF9EB]", // Light Warning
      borderColor: "border-[#FFE6A8]",
      textColor: "text-[#F2A618]", // --warning
      iconColor: "text-[#F2A618]"
    },
    {
      title: "Stok Habis",
      value: "5",
      unit: "Item",
      icon: XCircle,
      bgColor: "bg-[#FEF2F2]", // Light Destructive
      borderColor: "border-[#FEE2E2]",
      textColor: "text-[#E62C2C]", // --destructive
      iconColor: "text-[#E62C2C]"
    },
    {
      title: "Nilai Aset",
      value: "42.5M",
      unit: "IDR",
      icon: Wallet,
      bgColor: "bg-[#DFF6F2]", // Light Primary/Secondary
      borderColor: "border-[#B8EBE5]",
      textColor: "text-[#1B9C90]", // --primary
      iconColor: "text-[#1B9C90]"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-in fade-in p-4 slide-in-from-top-4 duration-500 ">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className={cn(
            "rounded-[20px] p-6 border shadow-sm transition-all hover:shadow-md",
            stat.bgColor,
            stat.borderColor
          )}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-[0.15em]",
                stat.textColor === "text-[#13222D]" ? "text-[#67737C]" : stat.textColor
              )}>
                {stat.title}
              </p>
              <div className={cn(
                "p-2 rounded-xl bg-white/50 border border-white/20",
                stat.iconColor
              )}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            
            <div className="flex items-baseline gap-2">
              <h3 className={cn(
                "text-3xl font-bold tracking-tight",
                stat.textColor
              )}>
                {stat.value}
              </h3>
              <span className={cn(
                "text-xs font-bold uppercase opacity-60",
                stat.textColor
              )}>
                {stat.unit}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};