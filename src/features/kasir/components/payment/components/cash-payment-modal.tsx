"use client";

import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Banknote, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CashPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (cashReceived: number) => void;
  totalBill: number;
}

const formatRupiah = (value: string | number) => {
  if (value === undefined || value === null) return "";
  const num = typeof value === "number" ? value.toString() : value.replace(/[^,\d]/g, "");
  const split = num.split(",");
  const sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    const separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
  return rupiah;
};

const parseRupiah = (value: string) => {
  return parseInt(value.replace(/[^0-9]/g, "")) || 0;
};

export const CashPaymentModal = ({
  isOpen,
  onClose,
  onConfirm,
  totalBill,
}: CashPaymentModalProps) => {
  const [cashPayType, setCashPayType] = useState<"pas" | "lebih">("pas");
  const [rawCashReceived, setRawCashReceived] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCashPayType("pas");
      setRawCashReceived("");
    }
  }, [isOpen]);

  const { cashReceived, changeAmount, isValid } = useMemo(() => {
    if (cashPayType === "pas") {
      return {
        cashReceived: totalBill,
        changeAmount: 0,
        isValid: totalBill > 0,
      };
    } else {
      const received = parseRupiah(rawCashReceived);
      return {
        cashReceived: received,
        changeAmount: received - totalBill,
        isValid: received >= totalBill && totalBill > 0,
      };
    }
  }, [cashPayType, rawCashReceived, totalBill]);

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm(cashReceived);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-6 rounded-[28px] border border-slate-100 bg-white text-center shadow-2xl overflow-hidden">
        <DialogHeader className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3 border border-emerald-100">
            <Banknote className="w-6 h-6 text-emerald-500" />
          </div>
          <DialogTitle className="text-lg font-black text-slate-900">
            Konfirmasi Pembayaran Tunai
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 mt-1 max-w-[340px] leading-relaxed mx-auto">
            Konfirmasikan apakah nominal uang tunai yang diterima dari pasien pas atau memiliki kelebihan.
          </DialogDescription>
        </DialogHeader>

        {/* Ringkasan Tagihan */}
        <div className="my-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">
              Total Tagihan
            </span>
            <span className="text-base font-black text-slate-800 block mt-0.5">
              {formatCurrency(totalBill)}
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#1B9C90] bg-[#DFF6F2] px-2.5 py-1 rounded-full uppercase tracking-wider">
            Cash / Tunai
          </span>
        </div>

        {/* Selector Tipe Pembayaran */}
        <div className="grid grid-cols-2 gap-3 my-2">
          <button
            type="button"
            onClick={() => {
              setCashPayType("pas");
              setRawCashReceived("");
            }}
            className={cn(
              "h-11 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer outline-none",
              cashPayType === "pas"
                ? "bg-[#1B9C90] text-white border-[#1B9C90] shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            Uang Pas
          </button>
          
          <button
            type="button"
            onClick={() => {
              setCashPayType("lebih");
              setRawCashReceived(totalBill.toString());
            }}
            className={cn(
              "h-11 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer outline-none",
              cashPayType === "lebih"
                ? "bg-[#1B9C90] text-white border-[#1B9C90] shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            Uang Lebih
          </button>
        </div>

        {/* Form Uang Lebih */}
        {cashPayType === "lebih" && (
          <div className="space-y-3.5 my-3 text-left animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase block tracking-wider pl-1">
                Jumlah Uang Diterima
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                <input
                  type="text"
                  placeholder="0"
                  value={formatRupiah(rawCashReceived)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\./g, "");
                    setRawCashReceived(raw);
                  }}
                  className="pl-10 pr-4 w-full h-11 border border-slate-200 bg-white rounded-xl text-sm font-semibold focus:outline-none focus:border-[#1B9C90] transition-colors"
                  autoFocus
                />
              </div>
            </div>

            {changeAmount > 0 ? (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex justify-between items-center text-xs font-bold text-emerald-800 animate-in zoom-in-95 duration-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Kembalian Pasien
                </span>
                <span className="text-sm font-black text-emerald-600">
                  {formatCurrency(changeAmount)}
                </span>
              </div>
            ) : changeAmount < 0 ? (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-1.5 text-xs font-bold text-red-800 animate-in zoom-in-95 duration-200">
                <AlertCircle className="w-4 h-4 text-red-600" />
                Uang diterima kurang {formatCurrency(Math.abs(changeAmount))}
              </div>
            ) : null}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-4 flex gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-100 text-xs shadow-none cursor-pointer"
          >
            Batal
          </Button>
          <Button
            type="button"
            disabled={!isValid}
            onClick={handleConfirm}
            className="flex-1 h-11 rounded-xl bg-[#1B9C90] hover:bg-[#158076] text-white font-bold text-xs shadow-none cursor-pointer"
          >
            Konfirmasi & Lunasi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
