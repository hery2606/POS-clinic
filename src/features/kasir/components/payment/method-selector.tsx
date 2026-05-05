import { QrCode, Banknote, CreditCard, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

const methods = [
  { id: 'qris', label: 'QRIS', icon: QrCode },
  { id: 'tunai', label: 'Tunai', icon: Banknote },
  { id: 'debit', label: 'Debit', icon: CreditCard },
  { id: 'transfer', label: 'Transfer', icon: ArrowLeftRight },
];

export const MethodSelector = ({ selected, onSelect }: { selected: string, onSelect: (id: string) => void }) => {
  return (
    <div className="grid grid-cols-2 gap-3 mt-6">
      {methods.map((method) => {
        const Icon = method.icon;
        const isActive = selected === method.id;
        return (
          <button
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-2 h-24 rounded-3xl border-2 transition-all",
              isActive 
                ? "border-[#10b981] bg-emerald-50/30 text-[#10b981]" 
                : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
            )}
          >
            <Icon className={cn("w-6 h-6", isActive ? "text-[#10b981]" : "text-slate-300")} />
            <span className="text-xs font-bold">{method.label}</span>
          </button>
        );
      })}
    </div>
  );
};