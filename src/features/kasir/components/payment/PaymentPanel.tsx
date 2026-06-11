"use client";

import { useState, useMemo, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { MethodSelector } from './method-selector';
import { PaymentFooter } from './payment-footer';
import { PaymentHeader } from './payment-header';
import { Button } from "@/components/ui/button";
import { useRightPanel } from '@/features/kasir/context/right-panel-context';
import { Banknote, CreditCard, ArrowLeftRight, QrCode, Shield } from "lucide-react";
import { paymentService, billingPosService } from '../../services';

import { QrisPaymentModal } from './components/qris-payment-modal';
import { PaymentStatusDialog } from './components/payment-status-dialog';
import { SplitPaymentConfirmModal } from './components/split-payment-confirm-modal';

type PaymentCategory = "penjaminan" | "mandiri";

export const PaymentPanel = () => {
  const { data, clearContent } = useRightPanel();
  const queryClient = useQueryClient();
  
  const totalTagihan = data?.amount || data?.total || 0;
  const insurance = data?.insurance || 'Mandiri';
  const isBPJS = insurance?.toLowerCase().includes('bpjs');

  const BPJS_COVERAGE_RATE = 0.7;
  const insuranceCoverage = isBPJS ? Math.floor(totalTagihan * BPJS_COVERAGE_RATE) : 0;
  const remainingAmount = totalTagihan - insuranceCoverage;

  const [payType, setPayType] = useState<PaymentCategory>('mandiri');
  const [nonTunaiMethod, setNonTunaiMethod] = useState('qris');
  const [selectedSubMethod, setSelectedSubMethod] = useState<string | undefined>(undefined);
  
  const [amounts, setAmounts] = useState({ tunai: '', nontunai: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSplitConfirmOpen, setIsSplitConfirmOpen] = useState(false);
  const [pendingSplitFlow, setPendingSplitFlow] = useState<{
    choice: 'cash_first' | 'nontunai_first' | 'both';
    txId: string;
    nominalTunai: number;
    nominalNontunai: number;
  } | null>(null);

  const [qrisPaymentData, setQrisPaymentData] = useState<{
    transactionId: string;
    amount: number;
    token?: string;
    qrUrl?: string;
    qrContent?: string;
  } | null>(null);

  const [successDialogData, setSuccessDialogData] = useState<{
    title: string;
    message: string;
    amount: number;
    type: 'success' | 'error';
    paymentMethod: string;
    patientName: string;
    invoiceId: string;
  } | null>(null);

  useEffect(() => {
    const targetAmount = isBPJS ? remainingAmount : totalTagihan;
    if (targetAmount > 0) {
      if (nonTunaiMethod === 'qris') {
        setAmounts({ tunai: '', nontunai: targetAmount.toString() });
      } else {
        setAmounts({ tunai: targetAmount.toString(), nontunai: '' });
      }
    } else {
      setAmounts({ tunai: '', nontunai: '' });
    }
  }, [data?.id, nonTunaiMethod, isBPJS, totalTagihan, remainingAmount]);

  const nonTunaiIcon = useMemo(() => {
    switch (nonTunaiMethod) {
      case 'debit': return <CreditCard className="w-4 h-4 text-slate-400" />;
      case 'transfer': return <ArrowLeftRight className="w-4 h-4 text-slate-400" />;
      default: return <QrCode className="w-4 h-4 text-slate-400" />;
    }
  }, [nonTunaiMethod]);

  const nonTunaiLabel = useMemo(() => {
    switch (nonTunaiMethod) {
      case 'debit': return 'Pembayaran Debit Card';
      case 'transfer': return 'Pembayaran Bank Transfer';
      default: return 'Pembayaran QRIS (Midtrans)';
    }
  }, [nonTunaiMethod]);

  const { totalBayar, sisaTagihan, isPaymentValid } = useMemo(() => {
    const nominalTunai = parseFloat(amounts.tunai) || 0;
    const nominalNontunai = parseFloat(amounts.nontunai) || 0;
    const target = isBPJS ? remainingAmount : totalTagihan;
    const total = nominalTunai + nominalNontunai;
    return {
      totalBayar: total,
      sisaTagihan: target - total,
      isPaymentValid: total === target && total > 0
    };
  }, [amounts, isBPJS, totalTagihan, remainingAmount]);

  const handleFillRemaining = (field: 'tunai' | 'nontunai') => {
    if (sisaTagihan <= 0) return;
    setAmounts(prev => {
      const currentFieldVal = parseFloat(prev[field]) || 0;
      return {
        ...prev,
        [field]: (currentFieldVal + sisaTagihan).toString()
      };
    });
  };

  const handleMethodSelect = (id: string, subMethod?: string) => {
    setNonTunaiMethod(id);
    setSelectedSubMethod(subMethod);
  };

  const handleProcessChoice = async (choice: 'cash_first' | 'nontunai_first' | 'both') => {
    setIsSplitConfirmOpen(false);
    setIsProcessing(true);

    const nominalNontunai = parseFloat(amounts.nontunai) || 0;
    const nominalTunai = parseFloat(amounts.tunai) || 0;
    const txId = data?.id || data?.transactionId || data?.invoiceId || data?.data?.id || "";

    try {
      if (choice === 'cash_first') {
        await billingPosService.addPaymentSplit(txId, {
          amount: nominalTunai,
          paymentMethod: 'tunai'
        });

        queryClient.invalidateQueries({ queryKey: ['billingTransactions'] });
        queryClient.invalidateQueries({ queryKey: ['billingTransactionsList'] });
        queryClient.invalidateQueries({ queryKey: ['paymentHistoryDetail', txId] });

        setSuccessDialogData({
          title: "Pembayaran Tunai Berhasil",
          message: `Bagian pembayaran tunai sebesar Rp ${nominalTunai.toLocaleString('id-ID')} berhasil dicatat. Sisa tagihan non-tunai ditunda ke status pending.`,
          amount: nominalTunai,
          type: 'success',
          paymentMethod: "Tunai (Sebagian)",
          patientName: data?.patientName || "Pasien Umum",
          invoiceId: txId,
        });
      }
      else if (choice === 'nontunai_first') {
        if (nonTunaiMethod === 'qris') {
          const response = await paymentService.generateSnapToken(txId);
          setPendingSplitFlow({
            choice: 'nontunai_first',
            txId,
            nominalTunai,
            nominalNontunai
          });
          setQrisPaymentData({
            transactionId: txId,
            amount: nominalNontunai,
            token: response?.data?.snapToken || response?.snapToken,
            qrUrl: response?.data?.snapRedirectUrl || response?.data?.snapRedirectUrl,
            qrContent: response?.data?.snapToken || response?.data?.snapToken,
          });
        } else {
          await billingPosService.addPaymentSplit(txId, {
            amount: nominalNontunai,
            paymentMethod: nonTunaiMethod as any,
            vendorName: selectedSubMethod
          });

          queryClient.invalidateQueries({ queryKey: ['billingTransactions'] });
          queryClient.invalidateQueries({ queryKey: ['billingTransactionsList'] });
          queryClient.invalidateQueries({ queryKey: ['paymentHistoryDetail', txId] });

          setSuccessDialogData({
            title: `Pembayaran ${nonTunaiLabel} Berhasil`,
            message: `Bagian pembayaran ${nonTunaiLabel} sebesar Rp ${nominalNontunai.toLocaleString('id-ID')} berhasil dicatat. Sisa tagihan tunai ditunda ke status pending.`,
            amount: nominalNontunai,
            type: 'success',
            paymentMethod: `${nonTunaiLabel} (Sebagian)`,
            patientName: data?.patientName || "Pasien Umum",
            invoiceId: txId,
          });
        }
      }
      else if (choice === 'both') {
        await billingPosService.addPaymentSplit(txId, {
          amount: nominalTunai,
          paymentMethod: 'tunai'
        });

        if (nonTunaiMethod === 'qris') {
          const response = await paymentService.generateSnapToken(txId);
          setPendingSplitFlow({
            choice: 'both',
            txId,
            nominalTunai,
            nominalNontunai
          });
          setQrisPaymentData({
            transactionId: txId,
            amount: nominalNontunai,
            token: response?.data?.snapToken || response?.snapToken,
            qrUrl: response?.data?.snapRedirectUrl || response?.data?.snapRedirectUrl,
            qrContent: response?.data?.snapToken || response?.data?.snapToken,
          });
        } else {
          await billingPosService.addPaymentSplit(txId, {
            amount: nominalNontunai,
            paymentMethod: nonTunaiMethod as any,
            vendorName: selectedSubMethod
          });

          queryClient.invalidateQueries({ queryKey: ['billingTransactions'] });
          queryClient.invalidateQueries({ queryKey: ['billingTransactionsList'] });
          queryClient.invalidateQueries({ queryKey: ['paymentHistoryDetail', txId] });

          setSuccessDialogData({
            title: "Pembayaran Split Berhasil",
            message: `Pembayaran tunai Rp ${nominalTunai.toLocaleString('id-ID')} dan ${nonTunaiLabel} Rp ${nominalNontunai.toLocaleString('id-ID')} berhasil dilunasi sekaligus.`,
            amount: nominalTunai + nominalNontunai,
            type: 'success',
            paymentMethod: `Tunai & ${nonTunaiLabel}`,
            patientName: data?.patientName || "Pasien Umum",
            invoiceId: txId,
          });
        }
      }
    } catch (error) {
      console.error("Gagal melakukan pelunasan split:", error);
      setSuccessDialogData({
        title: "Pembayaran Gagal",
        message: "Terjadi kesalahan saat memproses pembayaran pecahan.",
        amount: 0,
        type: 'error',
        paymentMethod: "RME System Error",
        patientName: data?.patientName || "Pasien Umum",
        invoiceId: txId,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcess = async () => {
    if (!isPaymentValid || isProcessing) return;
    
    const nominalNontunai = parseFloat(amounts.nontunai) || 0;
    const nominalTunai = parseFloat(amounts.tunai) || 0;
    
    const txId = data?.id || data?.transactionId || data?.invoiceId || data?.data?.id || "";

    if (!txId) {
      console.error("❌ Error: ID Transaksi Finansial tidak ditemukan di dalam context data!");
      setSuccessDialogData({
        title: "ID Transaksi Tidak Ditemukan",
        message: "Gagal memproses pembayaran karena ID invoice billing kosong. Silakan pilih ulang pasien di antrean kasir.",
        amount: 0,
        type: 'error',
        paymentMethod: "System Validation",
        patientName: data?.patientName || "Pasien Umum",
        invoiceId: "-",
      });
      return;
    }

    if (nominalTunai > 0 && nominalNontunai > 0) {
      setIsSplitConfirmOpen(true);
      return;
    }

    setIsProcessing(true);

    if (nonTunaiMethod === 'qris' && nominalNontunai > 0) {
      try {
        const response = await paymentService.generateSnapToken(txId);
        
        setQrisPaymentData({
          transactionId: txId,
          amount: nominalNontunai,
          token: response?.data?.snapToken || response?.snapToken,
          qrUrl: response?.data?.snapRedirectUrl || response?.data?.snapRedirectUrl,
          qrContent: response?.data?.snapToken || response?.data?.snapToken,
        });
      } catch (error) {
        console.error("Gagal memproses token QRIS:", error);
        setSuccessDialogData({
          title: "Gagal Memproses QRIS",
          message: "Tidak dapat memproses token pembayaran QRIS server internal. Silakan periksa koneksi Anda.",
          amount: 0,
          type: 'error',
          paymentMethod: "QRIS (Midtrans)",
          patientName: data?.patientName || "Pasien Umum",
          invoiceId: txId,
        });
      } finally {
        setIsProcessing(false);
      }
    } else {
      try {
        if (txId) {
          if (nominalTunai > 0) {
            await billingPosService.addPaymentSplit(txId, {
              amount: nominalTunai,
              paymentMethod: 'tunai'
            });
          }
          if (nominalNontunai > 0) {
            await billingPosService.addPaymentSplit(txId, {
              amount: nominalNontunai,
              paymentMethod: nonTunaiMethod as any,
              vendorName: selectedSubMethod
            });
          }
          queryClient.invalidateQueries({ queryKey: ['billingTransactions'] });
          queryClient.invalidateQueries({ queryKey: ['billingTransactionsList'] });
          queryClient.invalidateQueries({ queryKey: ['paymentHistoryDetail', txId] });
        }

        let methodString = "Tunai";
        if (nominalTunai > 0 && nominalNontunai > 0) {
          methodString = `Tunai & ${nonTunaiLabel}`;
        } else if (nominalNontunai > 0) {
          methodString = `${nonTunaiLabel} ${selectedSubMethod ? `(${selectedSubMethod})` : ''}`;
        }

        setSuccessDialogData({
          title: "Pembayaran Berhasil",
          message: "Data pecahan pembayaran berhasil diproses dan disinkronkan ke database RME.",
          amount: totalTagihan,
          type: 'success',
          paymentMethod: methodString,
          patientName: data?.patientName || "Pasien Umum",
          invoiceId: txId,
        });
      } catch (err) {
        console.error("Gagal melakukan pelunasan:", err);
        setSuccessDialogData({
          title: "Pembayaran Gagal",
          message: "Terjadi kesalahan saat menyimpan data pecahan pembayaran langsung ke database.",
          amount: 0,
          type: 'error',
          paymentMethod: "RME System Error",
          patientName: data?.patientName || "Pasien Umum",
          invoiceId: txId,
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="flex h-full flex-col bg-white px-0">
      <div className="px-0">
        <PaymentHeader className="mb-6" />
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="bg-white p-2">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Pembayaran</p>
            <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              {payType === 'mandiri' ? 'Mandiri (Split Bill)' : 'Penjaminan'}
            </span>
          </div>

          {payType === 'mandiri' ? (
            <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
              
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200/60 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Sisa Bayar</span>
                  <span className={`text-sm font-bold mt-0.5 block ${sisaTagihan > 0 ? 'text-amber-500' : sisaTagihan < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {sisaTagihan === 0 ? 'Pembayaran Pas ✓' : sisaTagihan < 0 ? `Kelebihan Rp ${Math.abs(sisaTagihan).toLocaleString('id-ID')}` : `Rp ${sisaTagihan.toLocaleString('id-ID')}`}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Total Dimasukkan</span>
                  <span className="text-sm font-bold text-slate-700 block mt-0.5">Rp {totalBayar.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 px-1 uppercase tracking-wider">
                  <Banknote className="w-4 h-4 text-slate-400" /> Alokasi Tunai / Cash
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                    <input type="number" placeholder="0" value={amounts.tunai} onChange={(e) => setAmounts(prev => ({ ...prev, tunai: e.target.value }))} className="pl-10 pr-4 w-full h-11 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:border-[#1B9C90] transition-colors" />
                  </div>
                  {sisaTagihan > 0 && (
                    <Button type="button" variant="outline" onClick={() => handleFillRemaining('tunai')} className="h-11 px-3 text-xs font-bold border-slate-200 text-[#1B9C90] hover:bg-emerald-50/20 rounded-xl shadow-none">Gunakan Sisa</Button>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-dashed border-slate-100">
                <p className="text-xs font-bold text-slate-500 px-1 uppercase tracking-widest">Opsi Metode Non-Tunai / Patungan</p>
                <MethodSelector selected={nonTunaiMethod} onSelect={handleMethodSelect} />
              </div>

              <div className="space-y-2 animate-in fade-in duration-200">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 px-1 uppercase tracking-wider">{nonTunaiIcon} {nonTunaiLabel}</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                    <input type="number" placeholder="0" value={amounts.nontunai} onChange={(e) => setAmounts(prev => ({ ...prev, nontunai: e.target.value }))} className="pl-10 pr-4 w-full h-11 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:border-[#1B9C90] transition-colors" />
                  </div>
                  {sisaTagihan > 0 && (
                    <Button type="button" variant="outline" onClick={() => handleFillRemaining('nontunai')} className="h-11 px-3 text-xs font-bold border-slate-200 text-[#1B9C90] hover:bg-emerald-50/20 rounded-xl shadow-none">Gunakan Sisa</Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 p-6 bg-emerald-50/50 border border-emerald-100 rounded-[32px] animate-in zoom-in-95 duration-300">
              <p className="text-sm font-bold text-emerald-800 text-center">Mode Penjaminan Aktif. Sistem akan melakukan sinkronisasi data klaim BPJS/Voucher.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto px-6 pb-6">
        <PaymentFooter onProcess={handleProcess} isDisabled={!isPaymentValid || isProcessing} isLoading={isProcessing} />
      </div>

      <QrisPaymentModal
        isOpen={qrisPaymentData !== null}
        onClose={() => setQrisPaymentData(null)}
        patientName={data?.patientName || "Pasien Umum"}
        invoiceId={qrisPaymentData?.transactionId || data?.id || data?.transactionId || ""}
        qrisData={qrisPaymentData}
        onPaymentSuccess={(amount) => {
          const targetTxId = qrisPaymentData?.transactionId || data?.id || data?.transactionId || "";
          if (targetTxId) {
            queryClient.invalidateQueries({ queryKey: ['billingTransactions'] });
            queryClient.invalidateQueries({ queryKey: ['billingTransactionsList'] });
            queryClient.invalidateQueries({ queryKey: ['paymentHistoryDetail', targetTxId] });
          }
          setQrisPaymentData(null);

          let title = "Pembayaran QRIS Berhasil";
          let message = `Pembayaran QRIS sebesar Rp ${amount.toLocaleString('id-ID')} telah sukses divalidasi oleh Midtrans Gateway.`;
          let finalAmount = amount;
          let methodString = "QRIS (Midtrans)";

          if (pendingSplitFlow) {
            const { choice, nominalTunai, nominalNontunai } = pendingSplitFlow;
            if (choice === 'both') {
              title = "Pembayaran Split Berhasil";
              message = `Pembayaran tunai Rp ${nominalTunai.toLocaleString('id-ID')} dan QRIS Rp ${nominalNontunai.toLocaleString('id-ID')} telah sukses dilunasi sepenuhnya.`;
              finalAmount = nominalTunai + nominalNontunai;
              methodString = "Tunai & QRIS";
            } else if (choice === 'nontunai_first') {
              title = "Pembayaran QRIS Berhasil (Sebagian)";
              message = `Bagian pembayaran QRIS sebesar Rp ${nominalNontunai.toLocaleString('id-ID')} berhasil divalidasi. Sisa tagihan tunai ditunda ke status pending.`;
              finalAmount = nominalNontunai;
              methodString = "QRIS (Sebagian)";
            }
            setPendingSplitFlow(null);
          }

          setSuccessDialogData({
            title,
            message,
            amount: finalAmount,
            type: 'success',
            paymentMethod: methodString,
            patientName: data?.patientName || "Pasien Umum",
            invoiceId: targetTxId,
          });
        }}
      />

      <SplitPaymentConfirmModal
        isOpen={isSplitConfirmOpen}
        onClose={() => setIsSplitConfirmOpen(false)}
        onConfirm={handleProcessChoice}
        cashAmount={parseFloat(amounts.tunai) || 0}
        nonCashAmount={parseFloat(amounts.nontunai) || 0}
        nonCashLabel={nonTunaiLabel}
      />

      <PaymentStatusDialog
        isOpen={successDialogData !== null}
        onClose={() => {
          setSuccessDialogData(null);
          clearContent();
        }}
        title={successDialogData?.title || ""}
        message={successDialogData?.message || ""}
        amount={successDialogData?.amount || 0}
        type={successDialogData?.type || 'success'}
        paymentMethod={successDialogData?.paymentMethod || ""}
        patientName={successDialogData?.patientName || ""}
        invoiceId={successDialogData?.invoiceId || ""}
      />
    </div>
  );
};