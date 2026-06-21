"use client";

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  X, 
  CheckCircle2, 
  Printer, 
  Share2,
  AlertCircle,
  CreditCard,
  FileText,
  Activity,
  Loader2,
  ArrowRightLeft,
  CornerDownRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRightPanel } from '../../context/right-panel-context';
import { paymentService } from '../../services/payment.service';
import { billingPosService } from '../../services/billing.pos.service';
import { cn } from '@/lib/utils';
import { TransactionDetailSkeleton } from './ui/TransactionDetailSkeleton';


interface TransactionItem {
  name: string;
  quantity: number;
  price: number;
}

export const TransactionDetail = () => {
  const { clearContent, setContent, data: panelData } = useRightPanel();

  // Ambil ID Transaksi aktif dari lemparan list tabel kiri
  const activeTransactionId = panelData?.transactionId || panelData?.id;

  // Mengambil data histori split-bill per ID transaksi aktif dari backend Railway
  const { data: historyResponse, isLoading: isHistoryLoading, isError: isHistoryError } = useQuery({
    queryKey: ['paymentHistoryDetail', activeTransactionId],
    queryFn: () => paymentService.getTransactionHistory(activeTransactionId!),
    enabled: !!activeTransactionId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  // Mengambil data billing detail asli (layanan & produk) dari backend Railway
  const { data: billingResponse, isLoading: isBillingLoading } = useQuery({
    queryKey: ['billingDetailDetail', activeTransactionId],
    queryFn: () => billingPosService.getTransactionById(activeTransactionId!),
    enabled: !!activeTransactionId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const isLoading = isHistoryLoading || isBillingLoading;
  const isError = isHistoryError;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const billingDataObj = billingResponse?.data;

  // 🟢 KUNCI UTAMA: Ambil objek 'data' di dalam response body sesuai log JSON kamu!
  const serverData = historyResponse?.data;

  // Ambil rincian item asli dari billing, fallback ke items dari serverData atau mock
  const billingItems: TransactionItem[] = useMemo(() => {
    if (billingDataObj?.detail && billingDataObj.detail.length > 0) {
      return billingDataObj.detail.map((item: any) => ({
        name: item.namaLayanan,
        quantity: item.jumlah,
        price: parseFloat(item.harga || '0'),
      }));
    }
    return (serverData as any)?.items || [
      { name: 'Registrasi & Administrasi Umum Klinik', quantity: 1, price: 25000 },
      { name: 'Pelayanan Tindakan & Konsultasi Medis', quantity: 1, price: 50000 },
    ];
  }, [billingDataObj, serverData]);

  // 🟢 LOGIKA MUTASI TERMIN: Memecah rentetan pembayaran jika ada status PENDING di tengah jalan
  const { initialPayments, supplementalPayments } = useMemo(() => {
    const paymentsList = serverData?.payments || [];
    if (paymentsList.length === 0) {
      return { initialPayments: [], supplementalPayments: [] };
    }
    const pendingIndex = paymentsList.findIndex(
      (p: any) => p.status?.toUpperCase() === 'PENDING' || p.status?.toUpperCase() === 'PENDING_PAYMENT'
    );
    if (pendingIndex !== -1 && pendingIndex < paymentsList.length - 1) {
      return {
        initialPayments: paymentsList.slice(0, pendingIndex + 1),
        supplementalPayments: paymentsList.slice(pendingIndex + 1),
      };
    }
    return { initialPayments: paymentsList, supplementalPayments: [] };
  }, [serverData?.payments]);

  // 🟢 PINDAHAN KE SINI: statusConfig harus di atas semua conditional return!
  const statusConfig = useMemo(() => {
    const status = serverData?.status?.toUpperCase();
    if (status === 'LUNAS') return { bg: '#DFF6F2', text: '#1B9C90', label: 'SUKSES / LUNAS', icon: CheckCircle2 };
    if (status === 'PARTIAL') return { bg: '#FFF2E6', text: '#E27A12', label: 'BAYAR SEBAGIAN (PARTIAL)', icon: Activity };
    return { bg: '#FFF9EB', text: '#F2A618', label: 'PENDING PEMBAYARAN', icon: AlertCircle };
  }, [serverData?.status]);

  if (isLoading) return <TransactionDetailSkeleton />;

  if (isError || !historyResponse || !serverData) {
    return (
      <div className="bg-white p-6 rounded-[24px] border border-[#DFE6EB] shadow-sm flex flex-col items-center justify-center text-center text-slate-400 text-xs font-medium h-60 mt-12">
        <AlertCircle className="w-6 h-6 text-slate-300 mb-2" />
        Silakan pilih salah satu baris riwayat transaksi pada tabel kiri untuk memuat rincian kwitansi split-bill.
      </div>
    );
  }

  const totalTagihanNetto = serverData.total || 0;
  const canPayment = serverData.status?.toUpperCase() === 'PENDING_PAYMENT' || serverData.status?.toUpperCase() === 'PARTIAL';

  const txIdVal = serverData.transactionId;
  const remainingAmountVal = serverData.remainingAmount;
  const totalVal = serverData.total;
  const patientNameVal = serverData.patient?.name;
  const insuranceVal = serverData.patient?.insuranceType;
  const statusVal = serverData.status;
  const paidAmountVal = serverData.paidAmount;
  const paidMethodsVal = serverData.payments?.map((p: any) => p.method) || [];

  return (
    <div className="space-y-6 w-full max-w-md mx-auto animate-in fade-in slide-in-from-right-4 duration-200 mt-12">
      
      {/* HEADER CONTROL */}
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-xs font-bold text-[#67737C] uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-[#1B9C90]" /> Kwitansi Kasir Digital
        </h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-xl bg-[#EFF4F8] text-[#67737C] h-8 w-8 hover:bg-slate-200 border-none outline-none shadow-none cursor-pointer"
          onClick={clearContent}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* STATUS BANNER */}
      <div className="flex flex-col items-center text-center space-y-3 bg-white rounded-2xl p-5 border border-[#DFE6EB] shadow-xs">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: statusConfig.bg }}>
          <statusConfig.icon className="w-6 h-6" style={{ color: statusConfig.text }} />
        </div>
        <div className="space-y-1">
          <Badge className="border-none rounded-md px-2.5 py-0.5 font-bold shadow-none text-[10px] tracking-wider uppercase" style={{ backgroundColor: statusConfig.bg, color: statusConfig.text }}>
            {statusConfig.label}
          </Badge>
          <h1 className="text-2xl font-black text-[#13222D] mt-1">{formatCurrency(totalTagihanNetto)}</h1>
          <p className="text-[10px] font-medium text-[#67737C]">Klinik Utama Arda Medical Center</p>
        </div>
      </div>

      {/* METADATA NOTA KLINIK */}
      <div className="bg-[#F4FBF9] rounded-2xl p-4 border border-emerald-100 space-y-2.5 text-xs">
        <div className="grid grid-cols-3 gap-1">
          <span className="font-semibold text-[#67737C]">Cashier</span>
          <span className="col-span-2 font-bold text-[#13222D]">: Farmasi Klinik Arda</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <span className="font-semibold text-[#67737C]">Pasien</span>
          <span className="col-span-2 font-bold text-[#13222D]">
            : {serverData.patient?.name || 'Pasien Tanpa Nama'}
            <span className="block text-[10px] text-[#1B9C90] font-black mt-0.5 uppercase tracking-wide">
              ➔ TIPE KONTRAK: {serverData.patient?.insuranceType || 'UMUM'}
            </span>
          </span>
        </div>
        
        <Separator className="bg-[#D2EBE7] border-dashed my-2" />
        
        <div className="grid grid-cols-3 gap-1">
          <span className="font-semibold text-[#67737C]">No Invoice</span>
          <span className="col-span-2 font-mono font-bold text-[#13222D] truncate">: {serverData.transactionId}</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <span className="font-semibold text-[#67737C]">Total Terbayar</span>
          <span className="col-span-2 font-bold text-emerald-700">: {formatCurrency(serverData.paidAmount)}</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <span className="font-semibold text-[#67737C]">
            {serverData.status?.toUpperCase() === 'PENDING_PAYMENT' ? 'Belum Terbayar' : 'Sisa Tagihan'}
          </span>
          <span className="col-span-2 font-bold text-amber-600">: {formatCurrency(serverData.remainingAmount)}</span>
        </div>
      </div>

      {/* RINCIAN ITEM TINDAKAN */}
      <div className="space-y-2">
        <p className="text-[10px] font-black text-[#67737C] uppercase tracking-widest block px-1">
          Rincian Transaksi Tindakan & Obat
        </p>
        <div className="bg-white p-4 rounded-2xl border border-[#DFE6EB] shadow-xs space-y-3 max-h-60 overflow-y-auto">
          {billingItems.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start text-xs border-b border-slate-50 pb-2 last:border-none last:pb-0">
              <div className="space-y-0.5 max-w-[70%]">
                <p className="font-bold text-[#13222D] leading-tight">{item.name}</p>
                <p className="text-[10px] font-medium text-[#67737C]">
                  {item.quantity} x {formatCurrency(item.price)}
                </p>
              </div>
              <span className="font-bold text-[#13222D] pt-0.5">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SEKSI AKUMULASI BIAYA & HISTORI SPLIT BILL DENGAN PECAHAN TERMIN */}
      <div className="bg-white p-4 rounded-2xl border border-[#DFE6EB] shadow-xs space-y-2.5 text-xs">
        <div className="flex justify-between items-center text-slate-600">
          <span>Harga Kotor Tagihan</span>
          <span className="font-semibold">{formatCurrency(totalTagihanNetto)}</span>
        </div>

        {/* DETAIL PENJAMINAN BPJS */}
        {(serverData.patient?.insuranceType?.toUpperCase() === 'BPJS' || (serverData.bpjsAmount && serverData.bpjsAmount > 0)) && (
          <div className="space-y-2.5 border-t border-slate-100 pt-2.5 mt-1">
            <div className="flex justify-between items-center text-blue-700 font-semibold">
              <span>Ditanggung BPJS</span>
              <span>{formatCurrency(serverData.bpjsAmount || 0)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-700 font-bold">
              <span>Selisih Bayar Pasien</span>
              <span>{formatCurrency(serverData.nonBpjsAmount || 0)}</span>
            </div>
          </div>
        )}

        <Separator className="bg-slate-100" />

        <div className="flex justify-between items-center py-0.5">
          <span className="font-black text-[#13222D]">Total Akhir (Netto)</span>
          <span className="font-black text-[#1B9C90] text-base">{formatCurrency(totalTagihanNetto)}</span>
        </div>

        {/* 🟢 TIER 1: RENDERING HISTORI PEMBAYARAN UTAMA */}
        {initialPayments.length > 0 ? (
          <div className="mt-2 pt-2 border-t border-dashed border-slate-200 space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
              Metode &amp; Histori Pembayaran
            </span>
            {initialPayments.map((split: any, sIdx: number) => {
              const isItemPending = split.status?.toUpperCase() === 'PENDING' || split.status?.toUpperCase() === 'PENDING_PAYMENT';
              return (
                <div key={split.id || sIdx} className="flex justify-between text-[11px] items-center bg-slate-50/60 p-2 rounded-xl border border-slate-100">
                  <div className="text-slate-600 font-medium">
                    <span>➔ via </span>
                    <span className="font-black text-slate-700 uppercase tracking-wide">{split.method}</span>
                    <span className="text-[9px] text-slate-400 block pl-3">
                      {split.paidAt ? new Date(split.paidAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : '-'}
                    </span>
                  </div>
                  <Badge 
                    className={cn(
                      "font-extrabold text-[8px] h-4 rounded px-1 border-none shadow-none uppercase",
                      isItemPending ? "bg-amber-500 text-white" : "bg-emerald-600 text-white"
                    )}
                  >
                    {isItemPending ? 'PENDING' : 'LUNAS'}
                  </Badge>
                  <span className="font-black text-slate-800">{formatCurrency(split.amount)}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex justify-between items-center text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="font-medium flex items-center gap-1">Metode Bayar Utama</span>
            <span className="font-bold text-[#1B9C90] uppercase tracking-wide">
              {panelData?.paymentMethod || (serverData.patient?.insuranceType?.toUpperCase() === 'BPJS' ? 'BPJS' : 'TUNAI')}
            </span>
          </div>
        )}

        {/* 🟢 TIER 2: BLOK KETERANGAN TAGIHAN PELUNASAN SUSULAN (MUNCUL OTOMATIS) */}
        {supplementalPayments.length > 0 && (
          <div className="mt-3 pt-3 border-t border-dashed border-slate-200 space-y-2.5 animate-in fade-in duration-300">
            <div className="flex items-center gap-1.5 text-[9px] font-black text-orange-600 uppercase tracking-widest pl-1 bg-orange-50 py-1 px-2.5 rounded-lg w-fit border border-orange-100/70">
              <ArrowRightLeft className="w-3 h-3" /> Keterangan Tagihan Pelunasan
            </div>
            
            <div className="space-y-2 pl-2 border-l-2 border-dashed border-orange-200">
              {supplementalPayments.map((split: any, sIdx: number) => (
                <div key={split.id || sIdx} className="flex justify-between text-[11px] items-center animate-in slide-in-from-left-2 duration-200">
                  <div className="text-slate-600 font-medium flex items-center gap-1">
                    <CornerDownRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>Pelunasan via </span>
                    <span className="font-black text-slate-800 uppercase tracking-wide">{split.method}</span>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <Badge className="bg-emerald-50 text-emerald-700 font-extrabold text-[8px] h-4 rounded px-1 border border-emerald-200/50 shadow-none uppercase">
                      LUNAS
                    </Badge>
                    <span className="font-black text-slate-800">{formatCurrency(split.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="space-y-2 pt-2 border-t border-[#DFE6EB]">
        {canPayment ? (
          <Button 
            className="w-full h-11 bg-[#1B9C90] hover:bg-[#15857a] rounded-xl text-white font-bold text-xs shadow-md shadow-[#1B9C90]/10 gap-2 transition-all border-none cursor-pointer"
            onClick={() => setContent('payment', { 
              transactionId: txIdVal, 
              amount: remainingAmountVal,
              total: totalVal,
              patientName: patientNameVal,
              insurance: insuranceVal,
              status: statusVal,
              paidAmount: paidAmountVal,
              remainingAmount: remainingAmountVal,
              paidMethods: paidMethodsVal
            } as any)}
          >
            <CreditCard className="w-4 h-4" />
            {serverData.status?.toUpperCase() === 'PARTIAL' 
              ? 'Lanjut Eksekusi Pelunasan Sisa' 
              : 'Proses Pembayaran Kwitansi'}
          </Button>
        ) : (
          <div className="bg-[#DFF6F2] text-[#1B9C90] p-3 rounded-xl border border-emerald-100/50 flex items-center justify-center gap-2 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#1B9C90]" /> Kwitansi Ini Sudah Lunas Sepenuhnya
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="h-10 rounded-xl border-[#DFE6EB] text-[#13222D] font-bold text-xs bg-[#F9FEFC] hover:bg-[#EFF4F8] gap-1.5 shadow-none cursor-pointer">
            <Printer className="w-3.5 h-3.5 text-slate-400" /> Cetak Struk
          </Button>
          <Button variant="outline" className="h-10 rounded-xl border-[#DFE6EB] text-[#13222D] font-bold text-xs bg-[#F9FEFC] hover:bg-[#EFF4F8] gap-1.5 shadow-none cursor-pointer">
            <Share2 className="w-3.5 h-3.5 text-slate-400" /> Kirim WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};