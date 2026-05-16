import { useState } from 'react';
import { PaymentTabs } from './payment-tabs';
import { MethodSelector } from './method-selector';
import { QrisDisplay } from './qris-display';
import { PaymentFooter } from './payment-footer';
import { PaymentHeader } from './payment-header';

type PaymentCategory = "penjaminan" | "mandiri";

export const PaymentPanel = () => {
  const [payType, setPayType] = useState<PaymentCategory>('mandiri');
  const [method, setMethod] = useState('qris');

  const handleProcess = () => {
    console.log("Memulai proses pelunasan paralel: WMS, Akuntansi, & WhatsApp[cite: 1, 2]");
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Payment Header with Patient Name & Total */}
      <div className="px-0">
        <PaymentHeader className="mb-6" />
      </div>

      <div className="p-6">
        <div className=" bg-white  p-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Pembayaran
              </p>
              
            </div>
            <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              {payType === 'mandiri' ? 'Mandiri' : 'Penjaminan'}
            </span>
          </div>

          <div className="mt-6">
            <PaymentTabs activeTab={payType} onTabChange={setPayType} />
          </div>

          {payType === 'mandiri' ? (
            <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="text-xs font-semibold text-slate-500 mb-2 px-1 uppercase tracking-widest">
                Metode Pembayaran
              </p>
              <MethodSelector selected={method} onSelect={setMethod} />
              {method === 'qris' && <QrisDisplay />}
            </div>
          ) : (
            <div className="mt-6 p-6 bg-emerald-50/50 border border-emerald-100 rounded-[32px] animate-in zoom-in-95 duration-300">
              <p className="text-sm font-bold text-emerald-800 text-center">
                Mode Penjaminan Aktif. Sistem akan melakukan sinkronisasi data klaim BPJS/Voucher[cite: 1, 2].
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto px-6 pb-6">
        <PaymentFooter onProcess={handleProcess} />
      </div>
    </div>
  );
};
