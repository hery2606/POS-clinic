"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  amount: number;
  type: 'success' | 'error';
  paymentMethod: string;
  patientName: string;
  invoiceId: string;
  cashReceived?: number;
  changeAmount?: number;
}

export const PaymentStatusDialog = ({
  isOpen,
  onClose,
  title,
  message,
  amount,
  type,
  paymentMethod,
  patientName,
  invoiceId,
  cashReceived,
  changeAmount,
}: PaymentStatusDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-6 rounded-[28px] border border-slate-100 bg-white text-center shadow-2xl">
        <DialogHeader className="flex flex-col items-center justify-center text-center">
          {type === 'success' ? (
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3 border border-emerald-100 animate-bounce">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-3 border border-red-100">
              <XCircle className="w-7 h-7 text-red-500" />
            </div>
          )}
          <DialogTitle className="text-base font-black text-slate-900">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 mt-1 max-w-[240px] leading-relaxed mx-auto">
            {message}
          </DialogDescription>
        </DialogHeader>

        {/* Detail Pembayaran Terperinci */}
        <div className="my-5 bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5 text-xs text-left">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Nama Pasien</span>
            <span className="font-bold text-slate-900">{patientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">No. Invoice</span>
            <span className="font-mono font-bold text-slate-900">{invoiceId || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Metode Pembayaran</span>
            <span className="font-bold text-[#1B9C90]">{paymentMethod}</span>
          </div>
          {cashReceived !== undefined && cashReceived > 0 && (
            <>
              <div className="flex justify-between border-t border-slate-200/60 pt-2.5 mt-2">
                <span className="text-slate-500 font-medium">Uang Diterima</span>
                <span className="font-bold text-slate-900">
                  Rp {cashReceived.toLocaleString("id-ID")}
                </span>
              </div>
              {changeAmount !== undefined && changeAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Kembalian</span>
                  <span className="font-bold text-emerald-600">
                    Rp {changeAmount.toLocaleString("id-ID")}
                  </span>
                </div>
              )}
            </>
          )}
          {amount > 0 && (
            <div className={cn(
              "flex justify-between border-t border-slate-200/60 pt-2.5 mt-2",
              cashReceived !== undefined && "border-t-0 pt-0 mt-0"
            )}>
              <span className="text-slate-900 font-bold">Total Terbayar</span>
              <span className="font-black text-slate-900 text-sm">
                Rp {amount.toLocaleString("id-ID")}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Button
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-[#1B9C90] hover:bg-[#158076] text-white font-bold text-xs border-none shadow-sm shadow-[#1B9C90]/10 transition-all"
          >
            Kembali ke Kasir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
