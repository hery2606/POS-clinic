"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, User, Printer, Send, QrCode, Clock, ArrowRightLeft, CornerDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { billingPosService } from "@/features/kasir/services/billing.pos.service";
import { paymentService } from "@/features/kasir/services/payment.service";
import { logActivity } from '@/features/analitik/utils/activityLogger';

interface Props { transactionId: string | null; onPrintReceipt?: () => void; onSendWhatsApp?: () => void; }

export function TransactionDetailPanel({ transactionId, onPrintReceipt, onSendWhatsApp }: Props) {
  const { data: bData, isLoading: bLoad } = useQuery({ queryKey: ['billingDetail', transactionId], queryFn: () => billingPosService.getTransactionById(transactionId!), enabled: !!transactionId });
  const { data: pData, isLoading: pLoad } = useQuery({ queryKey: ['paymentHistory', transactionId], queryFn: () => paymentService.getTransactionHistory(transactionId!), enabled: !!transactionId });

  const loading = bLoad || pLoad;
  const bill = bData?.data;
  const items = Array.isArray(bill?.detail) ? bill.detail : [];
  const pays = Array.isArray(pData?.data?.payments) ? pData.data.payments : [];

  const { initial, suppl } = useMemo(() => {
    if (!pays.length) return { initial: [], suppl: [] };
    const pIdx = pays.findIndex((p: any) => p?.status?.toUpperCase().includes('PENDING'));
    return pIdx !== -1 && pIdx < pays.length - 1 ? { initial: pays.slice(0, pIdx + 1), suppl: pays.slice(pIdx + 1) } : { initial: pays, suppl: [] };
  }, [pays]);

  if (!transactionId) return <Card className="bg-white rounded-[24px] border-[#DFE6EB] p-6 shadow-sm w-full max-w-md flex flex-col justify-center items-center min-h-[400px] text-center gap-3"><Clock className="w-12 h-12 text-[#67737C]/30 animate-pulse" /><h4 className="font-bold text-[#13222D] text-sm">Pilih Transaksi</h4><p className="text-xs text-[#67737C] max-w-xs">Silakan pilih salah satu data transaksi di tabel sebelah kiri.</p></Card>;

  if (loading) return <Card className="bg-white rounded-[24px] border-[#DFE6EB] p-6 shadow-sm w-full max-w-md space-y-6"><div className="space-y-3"><div className="flex justify-between"><Skeleton className="h-6 w-1/3" /><Skeleton className="h-5 w-16 rounded-full" /></div><div className="space-y-2"><Skeleton className="h-3 w-1/2" /><Skeleton className="h-3 w-2/3" /></div></div><Separator className="bg-[#DFE6EB]" /><div className="space-y-3"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div></Card>;

  const getStatusStyle = (s: string) => s === "LUNAS" ? "bg-[#DFF6F2] text-[#1B9C90]" : s === "PARTIAL" ? "bg-orange-50 text-orange-500" : "bg-[#FFF9EB] text-[#F2A618]";
  const fDate = (d?: string) => d ? new Date(d).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";

  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm w-full max-w-md space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#13222D] truncate max-w-[70%]">{bill?.noInvoice || `TRX-${String(transactionId).slice(0, 8).toUpperCase()}`}</h2>
          <Badge className={`border-none shadow-none px-2.5 py-0.5 text-xs font-bold rounded-full uppercase ${getStatusStyle(bill?.status || "")}`}>{bill?.status === 'PARTIAL' ? 'SEBAGIAN' : bill?.status || 'PENDING'}</Badge>
        </div>
        <div className="space-y-2 text-xs font-medium text-[#67737C]">
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#67737C]/70" /><span>{fDate(bill?.createdAt)}</span></div>
          <div className="flex items-center gap-2"><User className="w-4 h-4 text-[#67737C]/70" /><span className="text-[#13222D] font-semibold">{bill?.janji?.pasien?.namaLengkap || pData?.data?.patient?.name || "Pasien Umum"}</span></div>
        </div>
      </div>

      <Separator className="bg-[#DFE6EB]" />

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#13222D]">Rincian Layanan & Produk</h3>
        <div className="space-y-3.5">
          {items.length ? items.map((t: any, i: number) => (
            <div key={t.id || i} className="flex justify-between gap-4 text-sm">
              <div className="space-y-0.5">
                <p className="font-bold text-[#13222D]">{t.namaLayanan}</p>
                <p className="text-xs font-medium text-[#67737C]">{t.jumlah} x Rp {Number(t.harga || 0).toLocaleString("id-ID")}{t.isBpjs && <span className="ml-1.5 px-1.5 py-0.5 rounded bg-green-50 text-green-600 font-bold text-[9px] border border-green-200">BPJS</span>}</p>
              </div>
              <span className="font-bold text-[#13222D] shrink-0">Rp {Number(t.subTotal || 0).toLocaleString("id-ID")}</span>
            </div>
          )) : <p className="text-xs text-[#67737C]">Tidak ada rincian layanan & produk.</p>}
        </div>
      </div>

      <div className="border-t border-dashed border-[#DFE6EB] pt-4 space-y-3 text-sm">
        <div className="flex justify-between font-medium text-[#67737C]"><span>Subtotal (Non-BPJS)</span><span className="font-bold text-[#13222D]">Rp {Number(bill?.totalNonBpjs || 0).toLocaleString("id-ID")}</span></div>
        <div className="flex justify-between font-medium text-[#67737C]"><span>Ditanggung BPJS</span><span className="font-bold text-green-600">- Rp {Number(bill?.totalBpjs || 0).toLocaleString("id-ID")}</span></div>
      </div>

      <Separator className="bg-[#DFE6EB]" />

      <div className="flex justify-between text-sm"><span className="font-bold text-[#13222D]">Total Tagihan Mandiri</span><span className="text-lg font-bold text-[#1B9C90]">Rp {Number(bill?.totalBiaya || 0).toLocaleString("id-ID")}</span></div>

      <div className="bg-[#F4F7F9] rounded-xl p-4 space-y-4 border border-[#DFE6EB]/40">
        <span className="text-[11px] font-semibold text-[#67737C] block uppercase tracking-wider">Metode & Histori Pembayaran</span>
        {initial.length ? (
          <div className="space-y-2">
            {initial.map((p: any, i: number) => {
              const pending = p.status?.includes('PENDING');
              return (
                <div key={p.id || i} className="flex justify-between items-center text-xs text-[#13222D] bg-white p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold"><QrCode className="w-3.5 h-3.5 text-[#1B9C90]" /><span className="uppercase">{p?.method || "-"}</span>{p?.isBpjsCoverage && <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase">BPJS</span>}</div>
                  <div className="text-right"><span className="font-bold block">Rp {Number(p?.amount || 0).toLocaleString("id-ID")}</span><span className={`block text-[9px] font-black uppercase tracking-wider ${pending ? "text-orange-500" : "text-[#1B9C90]"}`}>{pending ? 'PENDING' : 'LUNAS'}</span></div>
                </div>
              );
            })}
          </div>
        ) : <div className="flex items-center gap-2 text-sm font-bold text-[#13222D]"><QrCode className="w-4 h-4 text-[#1B9C90]" /><span className="uppercase">{bill?.metodePembayaran || "TUNAI"}</span></div>}

        {suppl.length > 0 && (
          <div className="mt-3 pt-3 border-t border-dashed border-slate-300 space-y-2">
            <div className="flex items-center gap-1.5 text-[9px] font-black text-orange-600 uppercase tracking-widest pl-1 bg-orange-50 py-1 px-2.5 rounded-lg w-fit border border-orange-100/70"><ArrowRightLeft className="w-3 h-3" /> Keterangan Tagihan Pelunasan</div>
            <div className="space-y-2.5 pl-2 border-l-2 border-dashed border-orange-200">
              {suppl.map((p: any, i: number) => (
                <div key={p.id || i} className="flex justify-between items-center text-xs text-[#13222D]"><div className="flex items-center gap-1 font-medium text-slate-600"><CornerDownRight className="w-3.5 h-3.5 text-orange-500 shrink-0" /><span>Pelunasan via </span><span className="font-black text-slate-800 uppercase tracking-wide">{p?.method || "-"}</span></div><div className="text-right flex items-center gap-2"><Badge className="bg-emerald-50 text-emerald-700 font-extrabold text-[8px] h-4 rounded px-1 border-none shadow-none uppercase">LUNAS</Badge><span className="font-black text-slate-800">Rp {Number(p?.amount || 0).toLocaleString("id-ID")}</span></div></div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <Button onClick={() => { logActivity({ action: 'EXPORT_PDF', module: 'KASIR', detail: `Cetak struk: ${bill?.noInvoice || transactionId}`, target_name: 'Transaksi', target_id: transactionId ?? undefined }); setTimeout(() => onPrintReceipt?.(), 300); }} variant="outline" className="border-[#DFE6EB] hover:bg-[#F4F7F9] font-bold h-11 rounded-xl shadow-none"><Printer className="w-4 h-4 mr-2" /> Cetak Struk</Button>
        <Button onClick={() => { onSendWhatsApp?.(); logActivity({ action: 'SEND_WA_REMINDER', module: 'KASIR', detail: `Kirim WA untuk: ${bill?.noInvoice || transactionId}`, target_name: 'Transaksi', target_id: transactionId ?? undefined }); }} variant="outline" className="border-[#DFE6EB] hover:bg-[#F4F7F9] font-bold h-11 rounded-xl shadow-none"><Send className="w-4 h-4 mr-2" /> Kirim WA</Button>
      </div>
    </Card>
  );
}