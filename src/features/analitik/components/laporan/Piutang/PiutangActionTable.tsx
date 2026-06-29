"use client";

import { useState, Fragment } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Search, ChevronLeft, ChevronRight, Edit2, Check, Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { type LocalDaftarTransaksiBelumLunas } from "./types";

const fmt = (a: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(a);
const dt = (d: number) => { const x = new Date(); x.setDate(x.getDate() - d); return `${x.getDate()} ${["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][x.getMonth()]} ${x.getFullYear()}`; };

export function PiutangActionTable({ transactions: txs, reminderStatuses: sts, onSendWa, onUpdatePhone }: { transactions: LocalDaftarTransaksiBelumLunas[]; reminderStatuses: Record<string, "idle" | "sending" | "sent" | "error">; onSendWa: (i: LocalDaftarTransaksiBelumLunas) => void; onUpdatePhone: (id: string, ph: string) => void; }) {
  const [q, setQ] = useState(""), [p, setP] = useState(1), [edit, setEdit] = useState<string | null>(null), [ph, setPh] = useState("");
  const items = txs.filter(t => t.pasien.toLowerCase().includes(q.toLowerCase()) || t.no_invoice.toLowerCase().includes(q.toLowerCase()));
  const total = Math.ceil(items.length / 5) || 1, pageTxs = items.slice((p - 1) * 5, p * 5);
  const pages = Array.from({ length: total }, (_, i) => i + 1).filter(i => total <= 5 || i === 1 || i === total || (i >= p - 1 && i <= p + 1) || (p === 1 && i <= 3) || (p === total && i >= total - 2));

  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full flex flex-col justify-between">
      <div className="p-4 sm:p-6 border-b border-[#DFE6EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-0.5"><h3 className="text-base font-bold text-[#13222D]">Tabel Aksi Penagihan Piutang</h3><p className="text-xs font-medium text-[#67737C]">Kirim pengingat tagihan pasien secara asinkron lewat WhatsApp CRM</p></div>
        <div className="relative w-full sm:w-64"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#67737C]" /><input type="text" placeholder="Cari pasien / no invoice..." value={q} onChange={(e) => { setQ(e.target.value); setP(1); }} className="w-full h-10 pl-10 pr-4 bg-[#F4F7F9] border-none text-xs font-medium text-[#13222D] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1B9C90]" /></div>
      </div>
      <div className="overflow-x-auto w-full">
        <Table className="w-full min-w-[900px] table-fixed">
          <TableHeader><TableRow className="bg-[#F4F7F9] hover:bg-[#F4F7F9] border-none"><TableHead className="text-xs font-bold text-[#67737C] h-12 text-left pl-4 sm:pl-6 w-[12%]">TANGGAL</TableHead><TableHead className="text-xs font-bold text-[#67737C] h-12 text-left w-[15%]">NO. INVOICE</TableHead><TableHead className="text-xs font-bold text-[#67737C] h-12 text-left w-[18%]">NAMA PASIEN</TableHead><TableHead className="text-xs font-bold text-[#67737C] h-12 text-left w-[13%]">SISA TAGIHAN</TableHead><TableHead className="text-xs font-bold text-[#67737C] h-12 text-left w-[10%]">MENUNGGAK</TableHead><TableHead className="text-xs font-bold text-[#67737C] h-12 text-left w-[18%]">NOMOR WHATSAPP</TableHead><TableHead className="text-xs font-bold text-[#67737C] h-12 text-center pr-4 sm:pr-6 w-[14%]">AKSI REMINDER</TableHead></TableRow></TableHeader>
          <TableBody>
            {!pageTxs.length ? <TableRow><TableCell colSpan={7} className="text-center py-10 text-xs font-medium text-[#67737C]">Tidak ada data.</TableCell></TableRow> : pageTxs.map((t) => {
              const st = sts[t.no_invoice] || "idle", isEd = edit === t.no_invoice;
              return (
                <TableRow key={t.no_invoice} className="border-b border-[#DFE6EB] hover:bg-[#F9FEFC]">
                  <TableCell className="pl-4 sm:pl-6 py-4 text-xs font-bold text-[#13222D] text-left">{dt(t.hari_belum_lunas)}</TableCell>
                  <TableCell className="py-4 text-xs font-mono font-bold text-[#13222D] text-left">{t.no_invoice}</TableCell>
                  <TableCell className="py-4 text-xs font-bold text-[#13222D] text-left truncate">{t.pasien}</TableCell>
                  <TableCell className="py-4 text-xs font-bold text-[#1B9C90] text-left">{fmt(t.total_tagihan)}</TableCell>
                  <TableCell className="py-4 text-left"><Badge className={cn("border-none shadow-none rounded-full px-2.5 py-0.5 text-[10px] font-bold", t.hari_belum_lunas <= 3 ? "bg-[#DFF6F2] text-[#1B9C90]" : t.hari_belum_lunas <= 7 ? "bg-[#FFF8E6] text-[#F2A618]" : "bg-red-50 text-[#E62C2C]")}>{t.hari_belum_lunas} Hari</Badge></TableCell>
                  <TableCell className="py-4 text-left"><div className="flex items-center gap-2">{isEd ? <div className="flex gap-1 w-full max-w-[170px]"><input autoFocus type="text" value={ph} onChange={e => setPh(e.target.value)} className="h-9 w-full border border-[#DFE6EB] rounded-xl px-3 text-xs font-bold focus:outline-none focus:border-[#1B9C90]" /><Button size="icon" className="h-9 w-9 bg-[#1B9C90] text-white rounded-xl shadow-none cursor-pointer" onClick={() => { onUpdatePhone(t.no_invoice, ph); setEdit(null); }}><Check className="w-4 h-4" /></Button></div> : <div className="flex items-center gap-2 group"><span className="text-xs font-bold text-[#67737C]">{t.wa_number}</span><button onClick={() => { setEdit(t.no_invoice); setPh(t.wa_number); }} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-[#EFF4F8] rounded-lg text-[#67737C] cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button></div>}</div></TableCell>
                  <TableCell className="py-4 text-center pr-4 sm:pr-6">{st === "sending" ? <Button disabled className="bg-slate-100 text-[#67737C] font-bold text-xs h-9 rounded-xl shadow-none px-4 mx-auto flex gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" />Mengirim...</Button> : (st === "sent" || t.status_reminder === "Terkirim") ? <div className="flex items-center gap-1 text-[#1B9C90] font-bold text-xs bg-[#DFF6F2]/70 py-1.5 px-3 rounded-xl w-fit mx-auto border border-[#1B9C90]/20"><CheckCircle2 className="w-3.5 h-3.5" />Terkirim</div> : <Button onClick={() => onSendWa(t)} className="bg-[#1B9C90] hover:bg-[#157A71] text-white font-bold text-xs h-9 rounded-xl shadow-none px-4 flex gap-1.5 mx-auto"><Send className="w-3 h-3" />Kirim Reminder</Button>}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="px-4 py-4 sm:px-6 border-t border-[#DFE6EB] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F9FEFC]/30">
        <span className="text-xs font-medium text-[#67737C]">Menampilkan <span className="text-[#13222D] font-bold">{items.length ? (p - 1) * 5 + 1 : 0} - {Math.min(p * 5, items.length)}</span> dari <span className="text-[#13222D] font-bold">{items.length}</span> data entri</span>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" onClick={() => p > 1 && setP(p - 1)} disabled={p === 1} className="h-8 w-8 p-0 rounded-lg text-[#67737C] hover:bg-[#F4F7F9]"><ChevronLeft className="w-4 h-4" /></Button>
          {pages.map((x, i, a) => <Fragment key={x}>{i > 0 && x - a[i - 1] > 1 && <span className="text-[#67737C] px-1 text-xs">...</span>}<Button variant="outline" onClick={() => setP(x)} className={cn("h-8 px-3 rounded-lg text-xs font-bold border-none shadow-none", p === x ? "bg-[#13272F]/5 text-[#1B9C90]" : "text-[#67737C] hover:bg-[#F4F7F9]")}>{x}</Button></Fragment>)}
          <Button variant="outline" onClick={() => p < total && setP(p + 1)} disabled={p === total} className="h-8 w-8 p-0 rounded-lg text-[#67737C] hover:bg-[#F4F7F9]"><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>
    </Card>
  );
}
