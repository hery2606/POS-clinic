import { Input } from "@/components/ui/input";

interface BuyerNameInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const BuyerNameInput = ({ 
  value, 
  onChange,
  placeholder = "Nama Pembeli (Opsional)"
}: BuyerNameInputProps) => {
  return (
    <div className="flex items-center gap-4 w-full">
      <div className="relative flex-1 group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#29B5A8] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-12 h-12 bg-white border-slate-200 rounded-full text-sm font-medium focus-visible:ring-1 focus-visible:ring-[#29B5A8] focus-visible:border-[#29B5A8] transition-all placeholder:text-slate-400 shadow-sm"
        />
      </div>
    </div>
  );
};
