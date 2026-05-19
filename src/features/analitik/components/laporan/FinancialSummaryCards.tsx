"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function FinancialSummaryCards() {

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Pendapatan */}
        <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm">
          <CardContent className="p-0 space-y-2">
            <span className="text-xs font-semibold text-[#67737C]">
              Total Pendapatan (Nov 2023)
            </span>
            <h3 className="text-2xl font-bold text-[#13222D]">
              Rp 124.500.000
            </h3>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="bg-[#DFF6F2] text-[#1B9C90] px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12.5%
              </span>
              <span className="text-[#67737C]">vs Okt 2023 (Rp 110.6M)</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Rata-rata Pendapatan Harian */}
        <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm">
          <CardContent className="p-0 space-y-2">
            <span className="text-xs font-semibold text-[#67737C]">
              Rata-rata Pendapatan Harian
            </span>
            <h3 className="text-2xl font-bold text-[#13222D]">
              Rp 4.150.000
            </h3>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="bg-[#DFF6F2] text-[#1B9C90] px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +5.2%
              </span>
              <span className="text-[#67737C]">vs Okt 2023 (Rp 3.9M)</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Total Transaksi Selesai */}
        <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm">
          <CardContent className="p-0 space-y-2">
            <span className="text-xs font-semibold text-[#67737C]">
              Total Transaksi Selesai
            </span>
            <h3 className="text-2xl font-bold text-[#13222D]">
              842
            </h3>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="bg-red-50 text-[#E62C2C] px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                -2.1%
              </span>
              <span className="text-[#67737C]">vs Okt 2023 (860)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}