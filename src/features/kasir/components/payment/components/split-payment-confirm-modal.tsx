"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Banknote, CreditCard, ArrowRightLeft, Sparkles, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SplitPaymentConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (choice: 'cash_first' | 'nontunai_first' | 'both') => void;
  cashAmount: number;
  nonCashAmount: number;
  nonCashLabel: string;
}

export const SplitPaymentConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  cashAmount,
  nonCashAmount,
  nonCashLabel,
}: SplitPaymentConfirmModalProps) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-6 rounded-[28px] border border-slate-100 bg-white text-center shadow-2xl overflow-hidden">
        <DialogHeader className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-3 border border-amber-100">
            <ArrowRightLeft className="w-6 h-6 text-amber-500 animate-pulse" />
          </div>
          <DialogTitle className="text-lg font-black text-slate-900">
            Konfirmasi Alur Pembayaran Split
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 mt-1 max-w-[340px] leading-relaxed mx-auto">
            Pasien membayar menggunakan kombinasi dua metode pembayaran. Silakan tentukan alur eksekusi yang diinginkan.
          </DialogDescription>
        </DialogHeader>

        {/* Ringkasan Nominal Split */}
        <div className="my-4 grid grid-cols-2 gap-3">
          <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100/50 text-left">
            <span className="text-[10px] font-bold text-emerald-800 uppercase block tracking-wider">
              Porsi Tunai / Cash
            </span>
            <span className="text-sm font-black text-emerald-700 block mt-1">
              {formatCurrency(cashAmount)}
            </span>
          </div>
          <div className="bg-blue-50/50 p-3.5 rounded-2xl border border-blue-100/50 text-left">
            <span className="text-[10px] font-bold text-blue-800 uppercase block tracking-wider truncate">
              Porsi {nonCashLabel}
            </span>
            <span className="text-sm font-black text-blue-700 block mt-1">
              {formatCurrency(nonCashAmount)}
            </span>
          </div>
        </div>

        {/* OPSI PILIHAN ALUR EKSEKUSI */}
        <div className="space-y-3 my-2 text-left">
          
          {/* Pilihan 1: Keduanya Sekaligus */}
          <button
            onClick={() => onConfirm('both')}
            className={cn(
              "w-full p-4 rounded-2xl border transition-all text-left flex items-start gap-3.5 outline-none cursor-pointer",
              "border-[#1B9C90] bg-[#1B9C90]/5 hover:bg-[#1B9C90]/10"
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-[#1B9C90] flex items-center justify-center shrink-0 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-[#1B9C90] uppercase tracking-wide">
                  Opsi 1
                </span>
                <span className="text-[9px] font-bold bg-[#1B9C90] text-white px-1.5 py-0.5 rounded-sm">
                  REKOMENDASI
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                Proses Keduanya Sekaligus
              </p>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                Uang Tunai langsung lunas dicatat di database RME, dan sistem langsung membuka jendela QRIS/nontunai untuk diselesaikan.
              </p>
            </div>
          </button>

          {/* Pilihan 2: Tunai Dahulu */}
          <button
            onClick={() => onConfirm('cash_first')}
            className={cn(
              "w-full p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-left flex items-start gap-3.5 outline-none cursor-pointer"
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <Banknote className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide block">
                Opsi 2
              </span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                Selesaikan Porsi Tunai Terlebih Dahulu
              </p>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                Catat pembayaran Tunai saja di database. Porsi non-tunai ({nonCashLabel}) ditunda dan kwitansi masuk ke antrean <b>PENDING</b>.
              </p>
            </div>
          </button>

          {/* Pilihan 3: Non-Tunai Dahulu */}
          <button
            onClick={() => onConfirm('nontunai_first')}
            className={cn(
              "w-full p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-left flex items-start gap-3.5 outline-none cursor-pointer"
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wide block">
                Opsi 3
              </span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                Proses Porsi {nonCashLabel} Terlebih Dahulu
              </p>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                Jalankan alur pembayaran {nonCashLabel} terlebih dahulu. Porsi Tunai ditunda dan kwitansi masuk ke antrean <b>PENDING</b>.
              </p>
            </div>
          </button>

        </div>

        <div className="mt-4 flex gap-2 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-100 text-xs shadow-none cursor-pointer"
          >
            Kembali & Ubah Nominal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
