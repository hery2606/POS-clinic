"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  Calendar, 
  User, 
  Printer, 
  Send, 
  FileText, 
  QrCode,
  Clock
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { billingPosService } from "@/features/kasir/services/billing.pos.service";
import { paymentService } from "@/features/kasir/services/payment.service";
import { cn } from "@/lib/utils";

interface TransactionDetailPanelProps {
  transactionId: string | null;
  onDownloadPDF?: () => void;
  onPrintReceipt?: () => void;
  onSendWhatsApp?: () => void;
}

export function TransactionDetailPanel({
  transactionId,
  onDownloadPDF,
  onPrintReceipt,
  onSendWhatsApp,
}: TransactionDetailPanelProps) {
  
  // 🎯 AMBIL DETAIL INVOICE DARI BILLING POS SERVICE
  const { data: billingResponse, isLoading: isBillingLoading } = useQuery({
    queryKey: ['billingDetail', transactionId],
    queryFn: () => billingPosService.getTransactionById(transactionId!),
    enabled: !!transactionId,
  });

  // 🎯 AMBIL HISTORI PEMBAYARAN DARI PAYMENT SERVICE
  const { data: paymentResponse, isLoading: isPaymentLoading } = useQuery({
    queryKey: ['paymentHistory', transactionId],
    queryFn: () => paymentService.getTransactionHistory(transactionId!),
    enabled: !!transactionId,
  });

  const isLoading = isBillingLoading || isPaymentLoading;
  const billing = billingResponse?.data;
  const paymentHistory = paymentResponse?.data;

  // 1. Placeholder jika belum memilih transaksi
  if (!transactionId) {
    return (
      <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm w-full max-w-md flex flex-col justify-center items-center min-h-[400px] text-center gap-3">
        <Clock className="w-12 h-12 text-[#67737C]/30 animate-pulse" />
        <h4 className="font-bold text-[#13222D] text-sm">Pilih Transaksi</h4>
        <p className="text-xs text-[#67737C] max-w-xs leading-relaxed">
          Silakan pilih salah satu data transaksi di tabel sebelah kiri untuk melihat rincian pembayaran & struk secara detail.
        </p>
      </Card>
    );
  }

  // 2. Loading State (Skeleton)
  if (isLoading) {
    return (
      <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm w-full max-w-md space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
        <Separator className="bg-[#DFE6EB]" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Separator className="bg-[#DFE6EB]" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </Card>
    );
  }

  const items = billing?.detail || [];
  const payments = paymentHistory?.payments || [];

  const mapStatusLabel = (status: string) => {
    switch (status) {
      case 'LUNAS': return 'LUNAS';
      case 'PARTIAL': return 'SEBAGIAN';
      default: return 'PENDING';
    }
  };

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return "-";
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm w-full max-w-md space-y-6">
      
      {/* HEADER SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#13222D] truncate max-w-[70%]">
            {billing?.noInvoice || `TRX-${transactionId.slice(0, 8).toUpperCase()}`}
          </h2>
          <Badge className={cn(
            "border-none shadow-none px-2.5 py-0.5 text-xs font-bold rounded-full uppercase",
            billing?.status === "LUNAS" && "bg-[#DFF6F2] text-[#1B9C90]",
            billing?.status === "PARTIAL" && "bg-orange-50 text-orange-500",
            billing?.status === "PENDING_PAYMENT" && "bg-[#FFF9EB] text-[#F2A618]"
          )}>
            {mapStatusLabel(billing?.status || "")}
          </Badge>
        </div>
        
        <div className="space-y-2 text-xs font-medium text-[#67737C]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#67737C]/70" />
            <span>{formatDate(billing?.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#67737C]/70" />
            <span className="text-[#13222D] font-semibold">
              {billing?.janji?.pasien?.namaLengkap || paymentHistory?.patient?.name || "Pasien Umum"}
            </span>
          </div>
        </div>
      </div>

      <Separator className="bg-[#DFE6EB]" />

      {/* ITEMS LIST SECTION */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#13222D] text-left">
          Rincian Layanan & Produk
        </h3>
        
        <div className="space-y-3.5">
          {items.length > 0 ? (
            items.map((item: any, index: number) => (
              <div key={item.id || index} className="flex items-start justify-between gap-4 text-sm">
                <div className="space-y-0.5 text-left">
                  <p className="font-bold text-[#13222D]">{item.namaLayanan}</p>
                  <p className="text-xs font-medium text-[#67737C]">
                    {item.jumlah} x Rp {Number(item.harga || 0).toLocaleString("id-ID")}
                    {item.isBpjs && (
                      <span className="ml-1.5 px-1.5 py-0.5 rounded bg-green-50 text-green-600 font-bold text-[9px] border border-green-200 uppercase">
                        BPJS
                      </span>
                    )}
                  </p>
                </div>
                <span className="font-bold text-[#13222D] shrink-0">
                  Rp {Number(item.subTotal || 0).toLocaleString("id-ID")}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#67737C] text-left">Tidak ada rincian layanan & produk.</p>
          )}
        </div>
      </div>

      <div className="border-t border-dashed border-[#DFE6EB] pt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between font-medium text-[#67737C]">
          <span>Subtotal (Non-BPJS)</span>
          <span className="font-bold text-[#13222D]">
            Rp {Number(billing?.totalNonBpjs || 0).toLocaleString("id-ID")}
          </span>
        </div>
        <div className="flex items-center justify-between font-medium text-[#67737C]">
          <span>Ditanggung BPJS</span>
          <span className="font-bold text-green-600">
            - Rp {Number(billing?.totalBpjs || 0).toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      <Separator className="bg-[#DFE6EB]" />

      {/* TOTAL PAYMENT */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold text-[#13222D]">Total Tagihan Mandiri</span>
        <span className="text-lg font-bold text-[#1B9C90]">
          Rp {Number(billing?.totalBiaya || 0).toLocaleString("id-ID")}
        </span>
      </div>

      {/* PAYMENT METHOD BLOCK */}
      <div className="bg-[#F4F7F9] rounded-xl p-4 space-y-2 border border-[#DFE6EB]/40">
        <span className="text-[11px] font-semibold text-[#67737C] block text-left uppercase tracking-wider">
          Metode & Histori Pembayaran
        </span>
        {payments.length > 0 ? (
          <div className="space-y-2">
            {payments.map((pm: any, idx: number) => (
              <div key={pm.id || idx} className="flex justify-between items-center text-xs text-[#13222D]">
                <div className="flex items-center gap-1.5 font-bold">
                  <QrCode className="w-3.5 h-3.5 text-[#1B9C90]" />
                  <span className="uppercase">{pm.method}</span>
                  {pm.isBpjsCoverage && (
                    <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase">
                      BPJS
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-bold">Rp {pm.amount.toLocaleString("id-ID")}</span>
                  <span className={`block text-[9px] font-semibold uppercase ${
                    pm.status === 'PAID' ? 'text-[#1B9C90]' : 'text-orange-500'
                  }`}>
                    {pm.status === 'PAID' ? 'LUNAS' : 'PENDING'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm font-bold text-[#13222D] justify-start">
            <QrCode className="w-4 h-4 text-[#1B9C90]" />
            <span className="uppercase">{billing?.metodePembayaran || "TUNAI"}</span>
          </div>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="space-y-2.5 pt-2">
        <Button
          onClick={onDownloadPDF}
          disabled={!billing?.pdfPath}
          className="w-full bg-[#1B9C90] hover:bg-[#157A71] text-white font-bold h-11 px-4 rounded-xl flex items-center justify-center gap-2 border-none shadow-none transition-colors cursor-pointer disabled:opacity-40"
        >
          <FileText className="w-4 h-4" />
          <span>Unduh Invoice (PDF)</span>
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onPrintReceipt}
            variant="outline"
            className="border-[#DFE6EB] text-[#13222D] hover:bg-[#F4F7F9] font-bold h-11 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-none cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#67737C]" />
            <span>Cetak Struk</span>
          </Button>
          <Button
            onClick={onSendWhatsApp}
            variant="outline"
            className="border-[#DFE6EB] text-[#13222D] hover:bg-[#F4F7F9] font-bold h-11 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-none cursor-pointer"
          >
            <Send className="w-4 h-4 text-[#67737C]" />
            <span>Kirim WA</span>
          </Button>
        </div>
      </div>

    </Card>
  );
}