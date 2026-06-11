"use client"

import { useState, useMemo } from 'react';
import { QrCode, Banknote, CreditCard, ArrowLeftRight, ChevronDown, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// 🌐 STRUKTUR DATA SUB-METODE (Dropdown QRIS Dihapus Total Karena Bersifat Universal)
const subMethodOptions: Record<string, string[]> = {
  debit: ["Bank Mandiri", "Bank BCA", "Bank BNI", "Bank BRI"],
  transfer: ["Virtual Account Mandiri", "Virtual Account BCA", "Virtual Account BNI", "Manual Transfer Bank"],
};

const methods = [
  { id: 'tunai', label: 'Tunai / Cash', icon: Banknote },
  { id: 'qris', label: 'QRIS Universal Gateway', icon: QrCode },
  { id: 'debit', label: 'Mesin EDC / Debit Card', icon: CreditCard },
  { id: 'transfer', label: 'Bank Transfer / VA', icon: ArrowLeftRight },
];

interface MethodSelectorProps {
  selected: string;
  onSelect: (id: string, subMethod?: string) => void;
}

export const MethodSelector = ({ selected, onSelect }: MethodSelectorProps) => {
  // State lokal menyimpan sub-pilihan yang tersisa (tanpa QRIS)
  const [subSelections, setSubSelections] = useState<Record<string, string>>({
    debit: "Bank Mandiri",
    transfer: "Virtual Account Mandiri",
  });

  const handleSubSelect = (methodId: string, option: string) => {
    setSubSelections(prev => ({ ...prev, [methodId]: option }));
    onSelect(methodId, option);
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
            {/* BARIS UTAMA (LIST ROW ACTION) */}
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
                  
                  {/* 🟢 SUB-LABEL KHUSUS QRIS: Menginfokan sifat otomatisnya */}
                  {isActive && method.id === 'qris' && (
                    <span className="text-[10px] font-bold text-[#1B9C90] flex items-center gap-1 mt-0.5 animate-in fade-in duration-200">
                      <Sparkles className="w-3 h-3 shrink-0" /> Semua Dompet Digital & M-Banking
                    </span>
                  )}

                  {/* Sub-label dinamis untuk Debit & Transfer bank */}
                  {isActive && hasDropdown && (
                    <span className="text-[10px] font-semibold text-[#1B9C90] block mt-0.5 animate-in fade-in duration-200">
                      Metode: {currentSubValue}
                    </span>
                  )}
                </div>
              </div>

              {/* Radio Indicator Bulat */}
              <div className={cn(
                "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                isActive ? "border-[#1B9C90] bg-[#1B9C90]" : "border-slate-300 bg-white"
              )}>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </button>

            {/* 🟢 INFORMASI FLAT BANNER UNTUK QRIS UNIVERSAL */}
            {isActive && method.id === 'qris' && (
              <div className="px-4 pb-3 pt-2 border-t border-dashed border-[#DFE6EB] bg-[#F4FBF9] flex items-center gap-2 animate-in slide-in-from-top-1 duration-200">
                <span className="text-[10px] font-semibold text-slate-500 leading-relaxed">
                  💡 <span className="font-bold text-slate-700">QRIS Terintegrasi GPN:</span> Pasien dapat memindai nota lunas menggunakan Gopay, ShopeePay, OVO, Dana, LinkAja, serta seluruh aplikasi perbankan nasional.
                </span>
              </div>
            )}

            {/* BARIS SEKSI DROPDOWN UNTUK NON-QRIS (DEBIT & TRANSFER BANNER) */}
            {isActive && hasDropdown && (
              <div className="px-4 pb-3.5 pt-0 border-t border-dashed border-[#DFE6EB] bg-[#F4F7F9]/30 flex items-center justify-between gap-4 animate-in slide-in-from-top-1 duration-200">
                <span className="text-[10px] font-bold text-[#67737C] uppercase tracking-wider">
                  Pilih Vendor / Sumber:
                </span>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      type="button"
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