"use client"

import { useState, useMemo } from 'react';
import { PaymentTabs } from './payment-tabs';
import { MethodSelector } from './method-selector';
import { PaymentFooter } from './payment-footer';
import { PaymentHeader } from './payment-header';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRightPanel } from '@/features/kasir/context/right-panel-context';
import { Banknote, CreditCard, ArrowLeftRight, QrCode, Shield } from "lucide-react";

type PaymentCategory = "penjaminan" | "mandiri";

export const PaymentPanel = () => {
  const { data } = useRightPanel();
  const totalTagihan = data?.total || 0;
  const insurance = data?.insurance || 'Mandiri'; // Dari patient card
  const isBPJS = insurance?.toLowerCase().includes('bpjs');

  // Calculate insurance coverage (BPJS typically covers 70%)
  const BPJS_COVERAGE_RATE = 0.7;
  const insuranceCoverage = isBPJS ? Math.floor(totalTagihan * BPJS_COVERAGE_RATE) : 0;
  const remainingAmount = totalTagihan - insuranceCoverage;

  const [payType, setPayType] = useState<PaymentCategory>('mandiri');
  const [nonTunaiMethod, setNonTunaiMethod] = useState('qris');
  
  // STATE NOMINAL SPLIT BILL
  const [amounts, setAmounts] = useState({
    tunai: '',
    nontunai: ''
  });

  // Sinkronisasi icon dinamis sesuai pilihan MethodSelector
  const nonTunaiIcon = useMemo(() => {
    switch (nonTunaiMethod) {
      case 'debit': return <CreditCard className="w-4 h-4 text-slate-400" />;
      case 'transfer': return <ArrowLeftRight className="w-4 h-4 text-slate-400" />;
      default: return <QrCode className="w-4 h-4 text-slate-400" />;
    }
  }, [nonTunaiMethod]);

  // Label dinamis input non-tunai sesuai pilihan MethodSelector
  const nonTunaiLabel = useMemo(() => {
    switch (nonTunaiMethod) {
      case 'debit': return 'Pembayaran Debit Card';
      case 'transfer': return 'Pembayaran Bank Transfer';
      default: return 'Pembayaran QRIS (Midtrans)';
    }
  }, [nonTunaiMethod]);

  // Live Kalkulator Validasi Angka
  const { totalBayar, sisaTagihan, isPaymentValid } = useMemo(() => {
    const nominalTunai = parseFloat(amounts.tunai) || 0;
    const nominalNontunai = parseFloat(amounts.nontunai) || 0;
    
    // If BPJS, patient should only pay the remainder
    const target = isBPJS ? remainingAmount : totalTagihan;
    
    const total = nominalTunai + nominalNontunai;
    const sisa = target - total;

    return {
      totalBayar: total,
      sisaTagihan: sisa,
      isPaymentValid: total === target
    };
  }, [amounts, isBPJS, totalTagihan, remainingAmount]);

  // Shortcut otomatis mengisi sisa tagihan
  const handleFillRemaining = (field: 'tunai' | 'nontunai') => {
    if (sisaTagihan <= 0) return;
    setAmounts(prev => ({
      ...prev,
      [field]: (parseFloat(prev[field]) || 0) + sisaTagihan
    }));
  };

  const handleProcess = () => {
    if (!isPaymentValid) return;
    console.log("Memproses split bill lunas!", {
      idInvoice: data?.invoiceId,
      tunai: parseFloat(amounts.tunai) || 0,
      nonTunai: {
        metode: nonTunaiMethod,
        nominal: parseFloat(amounts.nontunai) || 0
      }
    });
  };

  return (
    <div className="flex h-full flex-col bg-white px-0">
      {/* Header bawaan panel */}
      <div className="px-0">
        <PaymentHeader className="mb-6" />
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="bg-white p-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Pembayaran
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              {payType === 'mandiri' ? 'Mandiri (Split Bill)' : 'Penjaminan'}
            </span>
          </div>

          <div className="mt-6">
            <PaymentTabs activeTab={payType} onTabChange={setPayType} />
          </div>

          {payType === 'mandiri' ? (
            <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* SHOW BPJS INFO IF APPLICABLE */}
              {isBPJS && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-bold text-blue-900">Pasien Menggunakan BPJS Kesehatan</p>
                    <div className="text-xs text-blue-700 mt-1 space-y-0.5">
                      <p>• Total Tagihan: Rp {totalTagihan.toLocaleString('id-ID')}</p>
                      <p>• BPJS Menanggung (70%): Rp {insuranceCoverage.toLocaleString('id-ID')}</p>
                      <p className="font-bold text-blue-900">• Pasien Bayar: Rp {remainingAmount.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* LIVE COUNTER TRACKING TOTAL INDIKATOR */}
              <div className="p-4 rounded-2xl bg-slate-100 border border-blue-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Sisa Bayar</span>
                  <span className={`text-base font-medium mt-0.5 block ${sisaTagihan > 0 ? 'text-amber-500' : sisaTagihan < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {sisaTagihan === 0 ? 'Pembayaran Pas ✓' : sisaTagihan < 0 ? `Kelebihan Rp ${Math.abs(sisaTagihan).toLocaleString('id-ID')}` : `Rp ${sisaTagihan.toLocaleString('id-ID')}`}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Total Dimasukkan</span>
                  <span className="text-sm font-bold text-slate-700 block mt-0.5">Rp {totalBayar.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* INPUT SPLIT BAGIAN 1: CASH/TUNAI */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 px-1 uppercase tracking-wider">
                  <Banknote className="w-4 h-4 text-slate-400" /> Alokasi Tunai / Cash
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                    <Input 
                      type="number"
                      placeholder="0"
                      value={amounts.tunai}
                      onChange={(e) => setAmounts(prev => ({ ...prev, tunai: e.target.value }))}
                      className="pl-10 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-[#29B5A8]"
                    />
                  </div>
                  {sisaTagihan > 0 && (
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => handleFillRemaining('tunai')}
                      className="h-12 px-3 text-xs font-bold border-slate-200 text-[#29B5A8] hover:bg-emerald-50/20 rounded-xl"
                    >
                      Gunakan Sisa
                    </Button>
                  )}
                </div>
              </div>

              {/* FILTER UTAMA: METHOD SELECTOR UNTUK JALUR NON-TUNAI */}
              <div className="space-y-2 pt-2 border-t border-dashed border-slate-100">
                <p className="text-xs font-bold text-slate-500 px-1 uppercase tracking-widest">
                  Opsi Metode Non-Tunai / Patungan
                </p>
                {/* MethodSelector bawaan komponenmu, tidak dibuang */}
                <MethodSelector selected={nonTunaiMethod} onSelect={setNonTunaiMethod} />
              </div>

              {/* INPUT SPLIT BAGIAN 2: NON-TUNAI (MENYESUAIKAN METHOD SELECTOR) */}
              <div className="space-y-2 animate-in fade-in duration-200">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 px-1 uppercase tracking-wider">
                  {nonTunaiIcon} {nonTunaiLabel}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                    <Input 
                      type="number"
                      placeholder="0"
                      value={amounts.nontunai}
                      onChange={(e) => setAmounts(prev => ({ ...prev, nontunai: e.target.value }))}
                      className="pl-10 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-[#29B5A8]"
                    />
                  </div>
                  {sisaTagihan > 0 && (
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => handleFillRemaining('nontunai')}
                      className="h-12 px-3 text-xs font-bold border-slate-200 text-[#29B5A8] hover:bg-emerald-50/20 rounded-xl"
                    >
                      Gunakan Sisa
                    </Button>
                  )}
                </div>
              </div>

             

            </div>
          ) : (
            <div className="mt-6 p-6 bg-emerald-50/50 border border-emerald-100 rounded-[32px] animate-in zoom-in-95 duration-300">
              <p className="text-sm font-bold text-emerald-800 text-center">
                Mode Penjaminan Aktif. Sistem akan melakukan sinkronisasi data klaim BPJS/Voucher.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto px-6 pb-6">
        <PaymentFooter onProcess={handleProcess} isDisabled={!isPaymentValid && payType === 'mandiri'} />
      </div>
    </div>
  );
};