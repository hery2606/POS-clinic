import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface PaymentFooterProps {
  onProcess: () => void;
  isDisabled: boolean; // Properti baru untuk pengaman validasi
}

export const PaymentFooter = ({ onProcess, isDisabled }: PaymentFooterProps) => {
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
        disabled={isDisabled} // Mengunci tombol secara otomatis
        className="w-full h-16 bg-[#29B5A8] hover:bg-[#259d90] disabled:bg-slate-200 disabled:text-slate-400 disabled:opacity-100 disabled:shadow-none rounded-3xl text-white font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-emerald-100"
      >
        Proses Pelunasan
        <ArrowRight className="w-6 h-6" />
      </Button>
    </div>
  );
};