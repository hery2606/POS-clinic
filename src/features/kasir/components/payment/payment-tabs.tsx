import { cn } from "@/lib/utils";

// Definisi tipe literal agar logic pemindahan tab aman (type-safe)
type PaymentCategory = "penjaminan" | "mandiri";

interface PaymentTabsProps {
  activeTab: PaymentCategory;
  onTabChange: (tab: PaymentCategory) => void;
  isLoading?: boolean; 
}

export const PaymentTabs = ({ 
  activeTab, 
  onTabChange, 
  isLoading = false 
}: PaymentTabsProps) => {
  
  // Fungsi penangan klik untuk memastikan sinkronisasi data
  const handleTabClick = (tab: PaymentCategory) => {
    if (isLoading) return; // Logic: jangan biarkan user pindah tab jika sedang memproses API
    onTabChange(tab);
  };

  return (
    <div className="w-full">
      <div className="bg-white border border-slate-200 p-1 rounded-full flex items-center shadow-sm w-full">
        
        {/* Jalur Penjaminan: BPJS & Voucher Integration */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleTabClick("penjaminan")}
          className={cn(
            "flex-1 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2",
            activeTab === "penjaminan"
              ? "bg-[#29B5A8] text-white shadow-md shadow-emerald-100"
              : "bg-transparent text-slate-600 hover:text-slate-900 disabled:opacity-50"
          )}
        >
          <span>Penjaminan</span>
        </button>

        {/* Jalur Mandiri: Tunai, QRIS, Debit, & Transfer */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleTabClick("mandiri")}
          className={cn(
            "flex-1 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2",
            activeTab === "mandiri"
              ? "bg-[#29B5A8] text-white shadow-md shadow-emerald-100"
              : "bg-transparent text-slate-600 hover:text-slate-900 disabled:opacity-50"
          )}
        >
          <span>Mandiri</span>
        </button>
      </div>
    </div>
  );
};