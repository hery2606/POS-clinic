import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const PaymentFooter = ({ onProcess }: { onProcess: () => void }) => {
  return (
    <div className="mt-auto space-y-4">
      {/* Stock Info Badge */}
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl p-4">
        <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
        <span className="text-xs font-bold text-slate-600">
          Stok otomatis terpotong saat lunas
        </span>
      </div>

      {/* Main Action Button */}
      <Button 
        onClick={onProcess}
        className="w-full h-16 bg-[#10b981] hover:bg-[#0da975] rounded-3xl text-white font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-emerald-100"
      >
        Proses Pelunasan
        <ArrowRight className="w-6 h-6" />
      </Button>
    </div>
  );
};