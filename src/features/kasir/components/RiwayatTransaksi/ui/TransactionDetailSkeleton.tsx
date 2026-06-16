import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export const TransactionDetailSkeleton = () => {
  return (
    <div className="space-y-6 w-full max-w-md mx-auto animate-pulse mt-12">
      {/* HEADER CONTROL SKELETON */}
      <div className="flex justify-between items-center mb-1">
        <Skeleton className="w-40 h-4 bg-gray-200 rounded" />
        <Skeleton className="h-8 w-8 rounded-xl bg-gray-100" />
      </div>

      {/* STATUS BANNER SKELETON */}
      <div className="flex flex-col items-center text-center space-y-3 bg-white rounded-2xl p-5 border border-[#DFE6EB] shadow-xs">
        <Skeleton className="w-11 h-11 rounded-xl bg-gray-200" />
        <div className="space-y-2 flex flex-col items-center w-full">
          <Skeleton className="w-28 h-5 rounded bg-gray-200" />
          <Skeleton className="w-48 h-8 rounded bg-gray-200 mt-1" />
          <Skeleton className="w-36 h-3 rounded bg-gray-200" />
        </div>
      </div>

      {/* METADATA NOTA SKELETON */}
      <div className="bg-[#F4FBF9] rounded-2xl p-4 border border-emerald-100 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="w-16 h-3.5 bg-emerald-100/70 rounded" />
          <Skeleton className="w-32 h-3.5 bg-emerald-100/70 rounded" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="w-16 h-3.5 bg-emerald-100/70 rounded" />
          <Skeleton className="w-40 h-3.5 bg-emerald-100/70 rounded" />
        </div>
        <Separator className="bg-[#D2EBE7] border-dashed my-2" />
        <div className="flex justify-between">
          <Skeleton className="w-20 h-3.5 bg-emerald-100/70 rounded" />
          <Skeleton className="w-32 h-3.5 bg-emerald-100/70 rounded font-mono" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="w-24 h-3.5 bg-emerald-100/70 rounded" />
          <Skeleton className="w-24 h-3.5 bg-emerald-100/70 rounded" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="w-20 h-3.5 bg-emerald-100/70 rounded" />
          <Skeleton className="w-24 h-3.5 bg-emerald-100/70 rounded" />
        </div>
      </div>

      {/* ITEMS LIST SKELETON */}
      <div className="space-y-2">
        <Skeleton className="w-48 h-3 bg-gray-200 rounded px-1" />
        <div className="bg-white p-4 rounded-2xl border border-[#DFE6EB] shadow-xs space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-2 last:border-none last:pb-0">
              <div className="space-y-2 w-2/3">
                <Skeleton className="h-3.5 w-full bg-gray-100 rounded" />
                <Skeleton className="h-3 w-16 bg-gray-100 rounded" />
              </div>
              <Skeleton className="h-4 w-16 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* COSTS ACCUMULATION SKELETON */}
      <div className="bg-white p-4 rounded-2xl border border-[#DFE6EB] shadow-xs space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="w-24 h-3 bg-gray-100 rounded" />
          <Skeleton className="w-16 h-3 bg-gray-100 rounded" />
        </div>
        <Separator className="bg-slate-100" />
        <div className="flex justify-between items-center py-1">
          <Skeleton className="w-28 h-4 bg-gray-200 rounded" />
          <Skeleton className="w-24 h-5 bg-gray-200 rounded" />
        </div>
        <Skeleton className="w-full h-12 bg-gray-100 rounded-xl mt-2" />
      </div>

      {/* FOOTER ACTIONS SKELETON */}
      <div className="space-y-2 pt-2 border-t border-[#DFE6EB]">
        <Skeleton className="w-full h-11 bg-gray-200 rounded-xl" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-10 bg-gray-100 rounded-xl" />
          <Skeleton className="h-10 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
