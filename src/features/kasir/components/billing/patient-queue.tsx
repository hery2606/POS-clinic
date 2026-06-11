"use client";

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query'; // 🟢 Untuk auto-refresh database react-query
import { X, Clock, RefreshCw } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import { type BillingTransactionItem } from "@/features/kasir/types/billing.types";

interface PatientQueueProps {
  patients: BillingTransactionItem[];
  onSelectPatient: (patient: BillingTransactionItem) => void;
  selectedPatientId: string | null;
  onRemovePatient?: (patientId: string) => void;
  searchQuery?: string;
  totalPatients?: number;
}

export function PatientQueue({ 
  patients, 
  onSelectPatient, 
  selectedPatientId,
  onRemovePatient,
  searchQuery = "",
  totalPatients = 0
}: PatientQueueProps) {
  
  const queryClient = useQueryClient();

  // 🟢 AUTO REFRESH: Melakukan sinkronisasi otomatis ke queryKey 'billingTransactions' jika data eksternal berubah
  useEffect(() => {
    const handleVisibilityOrFocus = () => {
      queryClient.invalidateQueries({ queryKey: ['billingTransactions'] });
    };

    // Dengarkan perubahan ketika window fokus (efek setelah pop-up Midtrans menutup/menyelesaikan transaksi)
    window.addEventListener('focus', handleVisibilityOrFocus);
    return () => {
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, [queryClient]);

  const handleManualRefresh = () => {
    // Memaksa React Query mengambil data antrean terupdate dari server backend Railway
    queryClient.invalidateQueries({ queryKey: ['billingTransactions'] });
  };

  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 text-xs font-medium h-full min-h-[150px]">
        <div className="mb-2 p-2 rounded-full bg-slate-50 text-slate-300">
          <Clock className="w-5 h-5" />
        </div>
        Tidak ada pasien dalam daftar tunggu antrean.
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleManualRefresh}
          className="mt-2 text-[10px] font-bold text-[#1B9C90] hover:text-[#158076] gap-1 px-2.5 h-7 rounded-lg"
        >
          <RefreshCw className="w-3 h-3" /> Perbarui Antrean
        </Button>
      </div>
    );
  }
  
  const showingFiltered = searchQuery.length > 0 && patients.length < (totalPatients || patients.length);

  return (
    <div className="w-full flex flex-col h-full min-h-0 bg-transparent">
      
      {/* Container Header Antrean */}
      <div className="flex items-center justify-between pb-2 px-1 shrink-0 border-b border-slate-50 mb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#1B9C90] animate-pulse" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            {patients.length} Pasien Menunggu
          </p>
        </div>
        
        {/* 🟢 TOMBOL REFRESH MANUAL: Desain minimalis, estetik, dan menyatu dengan UI */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleManualRefresh}
          title="Perbarui data antrean"
          className="w-6 h-6 rounded-lg text-slate-400 hover:text-[#1B9C90] hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 w-full min-h-0 bg-transparent">
        <div className="space-y-2 pr-1 py-1">
          {patients.map((item, index) => {
            const isActive = selectedPatientId === item.id;
            const patientName = item.patient?.name || "Pasien Tanpa Nama";
            const initials = patientName.substring(0, 2).toUpperCase();
            const medicalRecordNo = item.patient?.medicalRecordNo || "-";
            
            return (
              <div
                key={item.id}
                className="group relative w-full animate-in fade-in slide-in-from-bottom-1 duration-200"
              >
                <div
                  onClick={() => onSelectPatient(item)}
                  className={cn(
                    "relative flex items-center gap-3.5 p-3 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden w-full",
                    isActive 
                      ? "bg-white border-[#1B9C90] shadow-sm z-10" 
                      : "bg-slate-50/50 border-slate-100 hover:border-slate-200 hover:bg-white"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1B9C90]" />
                  )}

                  <div className="hidden sm:flex text-[9px] font-black text-slate-200 absolute right-3 bottom-1.5 italic group-hover:text-[#1B9C90]/20 transition-colors">
                    #{index + 1}
                  </div>

                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors shadow-2xs",
                    isActive 
                      ? "bg-[#1B9C90] text-white" 
                      : "bg-white text-slate-500 border border-slate-100"
                  )}>
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <p className={cn(
                      "text-xs font-bold truncate leading-tight",
                      isActive ? "text-[#1B9C90]" : "text-[#13222D]"
                    )}>
                      {patientName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 font-medium">
                      <span className="font-bold text-slate-500">{medicalRecordNo}</span>
                      <span>•</span>
                      <div className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5 opacity-70" />
                        <span className={cn(
                          "uppercase text-[9px] font-bold tracking-wider px-1 py-0.5 rounded",
                          item.status === 'PENDING_PAYMENT' ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-600"
                        )}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {onRemovePatient && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemovePatient(item.id);
                      }}
                      className={cn(
                        "opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 absolute right-2 top-1/2 -translate-y-1/2 bg-white sm:bg-transparent shadow-xs sm:shadow-none",
                        isActive && "opacity-100"
                      )}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {showingFiltered && (
        <div className="pt-2 border-t border-slate-100 mt-1 shrink-0 bg-transparent text-right">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            Menampilkan {patients.length} dari {totalPatients} Pasien
          </p>
        </div>
      )}
    </div>
  );
}