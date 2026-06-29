"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type LocalDaftarTransaksiBelumLunas } from "./types";

const fmt = (a: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(a);

export function PiutangBreakdown({ breakdownProportion: bp, topDebtors: td }: { breakdownProportion: { umumPercent: number; bpjsPercent: number; umumVal: number; bpjsVal: number; }; topDebtors: LocalDaftarTransaksiBelumLunas[]; }) {
  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm lg:col-span-4 flex flex-col justify-between p-4 sm:p-6 space-y-6">
      <div className="space-y-4">
        <div><CardTitle className="text-base font-bold text-[#13222D]">Breakdown Penjamin Piutang</CardTitle><p className="text-xs font-medium text-[#67737C] mt-1">Proporsi penanggung piutang klinik</p></div>
        <div className="space-y-4">
          {[
            { c: "#1B9C90", bg: "#EFF4F8", t: "Pasien UMUM (Mandiri)", p: bp.umumPercent, v: bp.umumVal },
            { c: "#84DFD4", bg: "#EFF4F8", t: "Klaim BPJS / Asuransi", p: bp.bpjsPercent, v: bp.bpjsVal }
          ].map(x => (
            <div key={x.t} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: x.c }} /><span className="text-[#13222D]">{x.t}</span></div><span className="text-[#1B9C90]">{x.p}%</span></div>
              <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: x.bg }}><div className="h-full rounded-full" style={{ width: `${x.p}%`, backgroundColor: x.c }} /></div>
              <p className="text-[10px] font-medium text-[#67737C] text-right">Estimasi: {fmt(x.v)}</p>
            </div>
          ))}
        </div>
      </div>
      <Separator className="bg-[#DFE6EB]" />
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#67737C] uppercase tracking-wide">Top 3 Prioritas Penagihan</h3>
        <div className="space-y-2">
          {td.map((d, i) => (
            <div key={d.no_invoice} className="flex items-center justify-between p-3 rounded-xl bg-[#F4F7F9] border border-[#DFE6EB]/30 hover:border-[#1B9C90]/30 transition-colors">
              <div className="space-y-0.5 min-w-0 pr-4"><div className="flex items-center gap-1.5"><span className="text-xs font-bold text-slate-400">#{i + 1}</span><span className="text-xs font-bold text-[#13222D] truncate max-w-[140px]">{d.pasien}</span></div><span className="text-[10px] font-semibold text-[#67737C] block">Menunggak {d.hari_belum_lunas} hari</span></div>
              <span className="text-xs font-bold text-[#E62C2C] shrink-0">{fmt(d.total_tagihan)}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
