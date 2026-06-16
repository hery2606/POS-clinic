"use client";

import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BillingTable } from '@/features/kasir/components/billing/billing-table';
import { PatientCard } from '@/features/kasir/components/billing/patient-card';
import { PatientSearch } from '@/features/kasir/components/billing/patient-search';
import { PatientQueue } from '@/features/kasir/components/billing/patient-queue';
import { useRightPanel } from '@/features/kasir/context/right-panel-context';
import { billingPosService } from '@/features/kasir/services/billing.pos.service';
import { type BillingTransactionItem } from '@/features/kasir/types/billing.types';

export const KasirPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<BillingTransactionItem | null>(null);
  const { setContent, data: panelData } = useRightPanel();

  const { data: billingResponse, isLoading } = useQuery({
    queryKey: ['billingTransactions'],
    queryFn: () => billingPosService.getAllTransactions(),
    staleTime: 1 * 60 * 1000,
  });

  const queuePatients = useMemo(() => {
    const transactions = billingResponse?.data || [];
    return transactions.filter((item) => 
      item.status !== 'LUNAS' && 
      item.status !== 'CANCELLED' && 
      item.status !== 'CANCELED' &&
      item.status !== 'DIBATALKAN'
    );
  }, [billingResponse]);

  useEffect(() => {
    if (queuePatients.length > 0 && !selectedPatient) {
      setSelectedPatient(queuePatients[0]);
    }
  }, [queuePatients, selectedPatient]);

  // 🟢 OTOMATISASI CONTEXT: Langsung daftarkan data ke panel kanan setiap kali pasien dipilih
  useEffect(() => {
    if (selectedPatient) {
      setContent('payment', {
        source: 'kasir',
        id: selectedPatient.id,
        transactionId: selectedPatient.id,
        amount: selectedPatient.status === 'PARTIAL' ? selectedPatient.remainingAmount : selectedPatient.total,
        total: selectedPatient.total,
        patientName: selectedPatient.patient?.name || 'Pasien',
        insurance: selectedPatient.patient?.insuranceType || 'UMUM',
        status: selectedPatient.status,
        paidAmount: selectedPatient.paidAmount,
        remainingAmount: selectedPatient.remainingAmount,
        paidMethods: selectedPatient.paidMethods
      });
    }
  }, [selectedPatient, setContent]);

  const filteredPatients = useMemo(() => {
    if (!searchValue.trim()) return queuePatients;
    const query = searchValue.toLowerCase();
    return queuePatients.filter(item =>
      item.patient?.name?.toLowerCase().includes(query) ||
      item.patient?.medicalRecordNo?.toLowerCase().includes(query)
    );
  }, [queuePatients, searchValue]);

  const total = selectedPatient ? selectedPatient.total : 0;

  const handleRemovePatientFromQueue = (patientId: string) => {
    console.log("Membatalkan / menghapus transaksi ID:", patientId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh] w-full">
        <Loader2 className="w-8 h-8 animate-spin text-[#1B9C90]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1440px] mx-auto p-1 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="bg-white p-6 rounded-[24px] border border-[#DFE6EB] shadow-sm flex flex-col justify-between gap-4">
          <div className="w-full">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Cari Pasien</p>
            <PatientSearch activeTab="medis" onTabChange={() => { }} searchValue={searchValue} onSearchChange={setSearchValue} totalPatientsInQueue={queuePatients.length} filteredCount={filteredPatients.length} />
          </div>

          <div className="border-t border-slate-100 pt-3 flex-1 overflow-hidden min-h-[160px]">
            <PatientQueue patients={filteredPatients} selectedPatientId={selectedPatient?.id || null} onSelectPatient={setSelectedPatient} onRemovePatient={handleRemovePatientFromQueue} searchQuery={searchValue} totalPatients={queuePatients.length} />
          </div>
        </div>

        <div className="flex flex-col">
          {selectedPatient ? (
            <PatientCard initials={selectedPatient.patient?.name?.substring(0, 2).toUpperCase() || "PS"} name={selectedPatient.patient?.name || "Pasien"} phone="-" insurance={selectedPatient.patient?.insuranceType || "UMUM"} registrationNo={selectedPatient.patient?.medicalRecordNo || "-"} age="-" />
          ) : (
            <div className="bg-white p-6 rounded-[24px] border border-[#DFE6EB] shadow-sm flex items-center justify-center text-slate-400 text-xs font-medium h-full">
              Silakan pilih pasien pada antrean kiri untuk memproses draf tagihan.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden">
            <BillingTable selectedPatient={selectedPatient} />
          </div>
          <Button
            onClick={() =>
              setContent('payment', {
                source: 'kasir',
                id: selectedPatient?.id,
                transactionId: selectedPatient?.id,
                amount: selectedPatient?.status === 'PARTIAL' ? selectedPatient?.remainingAmount : selectedPatient?.total,
                total: selectedPatient?.total,
                patientName: selectedPatient?.patient?.name || 'Pasien',
                insurance: selectedPatient?.patient?.insuranceType || 'UMUM',
                status: selectedPatient?.status,
                paidAmount: selectedPatient?.paidAmount,
                remainingAmount: selectedPatient?.remainingAmount,
                paidMethods: selectedPatient?.paidMethods
              })
            }
            disabled={!selectedPatient || total === 0}
            className="w-full h-12 bg-[#1B9C90] hover:bg-[#158076] text-white rounded-xl font-bold text-xs shadow-lg shadow-[#1B9C90]/10 transition-all disabled:opacity-50"
          >
            Eksekusi Pembayaran Kasir (Rp {total.toLocaleString('id-ID')})
          </Button>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-[24px] p-5 flex gap-3 items-start w-full">
            <div className="p-1.5 bg-white rounded-xl shadow-xs text-emerald-500 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="space-y-0.5 text-[11px] font-semibold text-slate-600 leading-normal">
              <p>Resi otomatis terkirim via WhatsApp pasien setelah kasir melakukan pelunasan.</p>
              <span className="text-[9px] font-bold text-[#1B9C90] uppercase tracking-wider block pt-0.5">Gateway SmartClinic Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};