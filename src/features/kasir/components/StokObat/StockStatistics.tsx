import { useQuery } from '@tanstack/react-query';
import { 
  Package, 
  AlertCircle, 
  XCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from "@/lib/utils";
import { warehouseService } from '../../services/warehouse.service';

export const StockStatistics = () => {
  // FETCH REAL STOCK STATS DATA
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['medicineStats'],
    queryFn: () => warehouseService.getMedicineStats(),
    staleTime: 5 * 60 * 1000, // 5 menit
    gcTime: 10 * 60 * 1000,   // 10 menit
  });

  // BUILD STATS ARRAY DENGAN DATA REAL ATAU FALLBACK
  const stats = [
    {
      title: "Total Item",
      value: statsData?.total?.toLocaleString() || "0",
      unit: "Item",
      icon: Package,
      bgColor: "bg-white",
      borderColor: "border-[#DFE6EB]",
      textColor: "text-[#13222D]",
      iconColor: "text-[#67737C]"
    },
    {
      title: "Stok Aman",
      value: statsData?.aman?.toLocaleString() || "0",
      unit: "Item",
      icon: Package,
      bgColor: "bg-[#DFF6F2]",
      borderColor: "border-[#B8EBE5]",
      textColor: "text-[#1B9C90]",
      iconColor: "text-[#1B9C90]"
    },
    {
      title: "Stok Menipis",
      value: statsData?.menipis?.toLocaleString() || "0",
      unit: "Item",
      icon: AlertCircle,
      bgColor: "bg-[#FFF9EB]",
      borderColor: "border-[#FFE6A8]",
      textColor: "text-[#F2A618]",
      iconColor: "text-[#F2A618]"
    },
    {
      title: "Stok Kritis",
      value: statsData?.kritis?.toLocaleString() || "0",
      unit: "Item",
      icon: XCircle,
      bgColor: "bg-[#FEF2F2]",
      borderColor: "border-[#FEE2E2]",
      textColor: "text-[#E62C2C]",
      iconColor: "text-[#E62C2C]"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="rounded-[20px] p-6 border border-[#DFE6EB]">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20 rounded-md bg-[#EFF4F8]" />
                <Skeleton className="h-10 w-10 rounded-xl bg-[#EFF4F8]" />
              </div>
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-8 w-16 rounded-md bg-[#EFF4F8]" />
                <Skeleton className="h-3 w-10 rounded-md bg-[#EFF4F8]" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

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