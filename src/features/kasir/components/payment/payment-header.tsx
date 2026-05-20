"use client"

import { useRightPanel } from '@/features/kasir/context/right-panel-context';
import { cn } from '@/lib/utils';
import { Pill, Activity } from 'lucide-react';

export interface PaymentHeaderProps {
  className?: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const PaymentHeader = ({ className }: PaymentHeaderProps) => {
  const { data } = useRightPanel();

  const patientName = data?.patientName || 'Nama Pasien';
  const total = data?.total || 0;

  return (
    <div className={cn(
      "bg-[#F4F7F9]/50 border-b border-[#DFE6EB] rounded-b-[24px] overflow-hidden",
      className
    )}>
      <div className="p-6 space-y-5">
        
        {/* BARIS ATAS: DETAIL PASIEN & BADGE SUMBER */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-medium uppercase tracking-widest text-[#67737C]">
              Registrasi Pasien
            </span>
            <p className="text-base font-medium text-[#13222D]">
              {patientName}
            </p>
          </div>

          {/* BADGE SUMBER MINIMALIS */}
          {data?.source && (
            <div className={cn(
              "px-3 py-1 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 shadow-none",
              data.source === 'obat'
                ? 'bg-blue-50/50 text-blue-600 border-blue-100'
                : 'bg-[#DFF6F2] text-[#1B9C90] border-[#1B9C90]/10'
            )}>
              {data.source === 'obat' ? (
                <>
                  <Pill className="w-3.5 h-3.5 shrink-0" />
                  <span>Farmasi</span>
                </>
              ) : (
                <>
                  <Activity className="w-3.5 h-3.5 shrink-0" />
                  <span>Tindakan Medis</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* BARIS BAWAH: TOTAL TAGIHAN */}
        <div className="pt-4 border-t border-dashed border-[#DFE6EB] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#67737C]">
              Total Tagihan Klinik
            </span>
            <p className="text-2xl font-bold text-[#1B9C90] tracking-tight">
              {formatCurrency(total)}
            </p>
          </div>

          {total > 0 && (
            <span className="text-[10px] font-extrabold text-[#1B9C90] bg-[#DFF6F2] px-2.5 py-1 rounded-lg uppercase tracking-wider">
              Siap Bayar
            </span>
          )}
        </div>

      </div>
    </div>
  );
};