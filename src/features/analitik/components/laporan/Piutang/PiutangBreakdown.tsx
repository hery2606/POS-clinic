"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type LocalDaftarTransaksiBelumLunas } from "./types";

interface BreakdownProportion {
  umumPercent: number;
  bpjsPercent: number;
  umumVal: number;
  bpjsVal: number;
}

interface PiutangBreakdownProps {
  breakdownProportion: BreakdownProportion;
  topDebtors: LocalDaftarTransaksiBelumLunas[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function PiutangBreakdown({
  breakdownProportion,
  topDebtors,
}: PiutangBreakdownProps) {
  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm lg:col-span-4 flex flex-col justify-between p-6 space-y-6">
      {/* Breakdown Penjamin */}
      <div className="space-y-4">
        <div>
          <CardTitle className="text-base font-bold text-[#13222D]">
            Breakdown Penjamin Piutang
          </CardTitle>
          <p className="text-xs font-medium text-[#67737C] mt-1">
            Proporsi penanggung piutang klinik
          </p>
        </div>

        <div className="space-y-4">
          {/* UMUM */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1B9C90]" />
                <span className="text-[#13222D]">Pasien UMUM  (Mandiri)</span>
              </div>
              <span className="text-[#1B9C90]">{breakdownProportion.umumPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#EFF4F8] rounded-full overflow-hidden">
              <div className="h-full bg-[#1B9C90] rounded-full" style={{ width: `${breakdownProportion.umumPercent}%` }} />
            </div>
            <p className="text-[10px] font-medium text-[#67737C] text-right">
              Estimasi: {formatCurrency(breakdownProportion.umumVal)}
            </p>
          </div>

          {/* BPJS */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#84DFD4]" />
                <span className="text-[#13222D]">Klaim BPJS / Asuransi</span>
              </div>
              <span className="text-[#1B9C90]">{breakdownProportion.bpjsPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#EFF4F8] rounded-full overflow-hidden">
              <div className="h-full bg-[#84DFD4] rounded-full" style={{ width: `${breakdownProportion.bpjsPercent}%` }} />
            </div>
            <p className="text-[10px] font-medium text-[#67737C] text-right">
              Estimasi: {formatCurrency(breakdownProportion.bpjsVal)}
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-[#DFE6EB]" />

      {/* Top 3 Pasien Penunggak Terbesar */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#67737C] uppercase tracking-wide">
          Top 3 Prioritas Penagihan
        </h3>

        <div className="space-y-2">
          {topDebtors.map((debtor, index) => (
            <div
              key={debtor.no_invoice}
              className="flex items-center justify-between p-3 rounded-xl bg-[#F4F7F9] border border-[#DFE6EB]/30 hover:border-[#1B9C90]/30 transition-colors"
            >
              <div className="space-y-0.5 min-w-0 pr-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
                  <span className="text-xs font-bold text-[#13222D] truncate max-w-[140px]">
                    {debtor.pasien}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-[#67737C] block">
                  Menunggak {debtor.hari_belum_lunas} hari
                </span>
              </div>
              <span className="text-xs font-bold text-[#E62C2C] shrink-0">
                {formatCurrency(debtor.total_tagihan)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
