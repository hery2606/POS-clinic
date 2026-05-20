"use client"

import { useState } from "react";
import { QrCode, Banknote, CreditCard, ArrowLeftRight, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Struktur data opsi sub-metode pembayaran
const subMethodOptions: Record<string, string[]> = {
  qris: ["Gopay", "OVO", "ShopeePay", "Dana", "LinkAja"],
  debit: ["Bank Mandiri", "Bank BCA", "Bank BNI", "Bank BRI"],
  transfer: ["Virtual Account Mandiri", "Virtual Account BCA", "Virtual Account BNI", "Manual Transfer Bank"],
};

const methods = [
  { id: 'tunai', label: 'Tunai / Cash', icon: Banknote },
  { id: 'qris', label: 'QRIS Gateway', icon: QrCode },
  { id: 'debit', label: 'Mesin EDC / Debit Card', icon: CreditCard },
  { id: 'transfer', label: 'Bank Transfer / VA', icon: ArrowLeftRight },
];

interface MethodSelectorProps {
  selected: string;
  onSelect: (id: string, subMethod?: string) => void;
}

export const MethodSelector = ({ selected, onSelect }: MethodSelectorProps) => {
  // State lokal untuk menyimpan sub-pilihan bank/e-wallet yang aktif
  const [subSelections, setSubSelections] = useState<Record<string, string>>({
    qris: "Gopay",
    debit: "Bank Mandiri",
    transfer: "Virtual Account Mandiri",
  });

  const handleSubSelect = (methodId: string, option: string) => {
    setSubSelections(prev => ({ ...prev, [methodId]: option }));
    onSelect(methodId, option); // Lempar data pilihan sub-metode ke state utama PaymentPanel
  };

  return (
    <div className="space-y-2.5 mt-4">
      {methods.map((method) => {
        const Icon = method.icon;
        const isActive = selected === method.id;
        const hasDropdown = !!subMethodOptions[method.id];
        const currentSubValue = subSelections[method.id];

        return (
          <div 
            key={method.id} 
            className={cn(
              "rounded-2xl border transition-all overflow-hidden bg-white",
              isActive ? "border-[#1B9C90] shadow-sm shadow-[#1B9C90]/5" : "border-[#DFE6EB] hover:border-slate-300"
            )}
          >
            {/* BARIS UTAMA (LIST ROW) */}
            <button
              type="button"
              onClick={() => onSelect(method.id, hasDropdown ? currentSubValue : undefined)}
              className="w-full h-14 px-4 flex items-center justify-between text-left transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                  isActive ? "bg-[#DFF6F2] text-[#1B9C90]" : "bg-slate-50 text-[#67737C]"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className={cn(
                    "text-xs font-bold block",
                    isActive ? "text-[#13222D]" : "text-[#67737C]"
                  )}>
                    {method.label}
                  </span>
                  {/* Tampilkan keterangan sub-opsi aktif secara ringkas di bawah teks utama */}
                  {isActive && hasDropdown && (
                    <span className="text-[10px] font-semibold text-[#1B9C90] block mt-0.5 animate-in fade-in duration-200">
                      Opsi: {currentSubValue}
                    </span>
                  )}
                </div>
              </div>

              {/* Radio Indicator Bulat Minimalis */}
              <div className={cn(
                "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                isActive ? "border-[#1B9C90] bg-[#1B9C90]" : "border-slate-300 bg-white"
              )}>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </button>

            {/* BARIS SEKSI DROPDOWN (HANYA MUNCUL JIKA METODE AKTIF DAN MEMILIKI SUB-OPTIONS) */}
            {isActive && hasDropdown && (
              <div className="px-4 pb-3.5 pt-0 border-t border-dashed border-[#DFE6EB] bg-[#F4F7F9]/30 flex items-center justify-between gap-4 animate-in slide-in-from-top-1 duration-200">
                <span className="text-[10px] font-bold text-[#67737C] uppercase tracking-wider">
                  Pilih Vendor / Sumber:
                </span>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="h-8 px-3 text-[11px] font-bold border-[#DFE6EB] rounded-lg bg-white text-[#13222D] flex items-center gap-1.5 shadow-none hover:bg-slate-50"
                    >
                      <span>{currentSubValue}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#67737C]" />
                    </Button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent className="w-48 bg-white border border-[#DFE6EB] rounded-xl shadow-lg z-[100]" align="end">
                    {subMethodOptions[method.id].map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => handleSubSelect(method.id, option)}
                        className="text-xs font-bold text-[#13222D] py-2 px-3 focus:bg-[#DFF6F2] focus:text-[#1B9C90] rounded-lg cursor-pointer flex items-center justify-between"
                      >
                        <span>{option}</span>
                        {currentSubValue === option && <Check className="w-3.5 h-3.5 text-[#1B9C90]" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};