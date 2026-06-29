"use client"

import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { User, Phone, Heart, Clock, Shield, X, CheckCircle2, Calendar, Layers, CreditCard, UserCheck } from 'lucide-react';
import type { PatientData } from '../../types/patient.types';
import { analitikService } from '../../services/analitik.service';

const fmt = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);
const getAge = (d: string) => { const b = new Date(d), n = new Date(); let a = n.getFullYear() - b.getFullYear(); if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--; return a; };

export const PatientDetailModal = ({ isOpen, onClose, patientId, patient: p }: { isOpen: boolean; onClose: () => void; patientId?: string; patient?: PatientData; }) => {
  const { data: analyticsData } = useQuery({ queryKey: ['patientAnalytics'], queryFn: () => analitikService.getPatientAnalytics(), enabled: !!patientId, staleTime: 300000 });

  if (!p || !isOpen) return null;

  const ly = analyticsData?.data?.pasien_paling_loyal?.find((x) => x.id_pasien === patientId);
  const sp = analyticsData?.data?.pasien_spend_tertinggi?.find((x) => x.id_pasien === patientId);
  const isB = p.noBpjs && p.noBpjs !== 'null' && p.noBpjs.trim() !== '';
  const age = getAge(p.tanggalLahir);

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[51] w-full max-w-2xl px-4">
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="border-b border-[#EFF2F5] px-8 py-6 bg-gradient-to-br from-white via-white to-[#F4FBF9]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1B9C90] to-[#127067] flex items-center justify-center text-white font-medium text-xl border-4 border-[#E2F6F3] shadow-md shrink-0">{p.namaLengkap.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap"><h2 className="text-xl font-medium text-[#13222D] tracking-tight">{p.namaLengkap}</h2><Badge className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-medium border-none shadow-none tracking-wider", p.isActive ? "bg-[#E2F6F3] text-[#1B9C90]" : "bg-red-50 text-red-600")}>{p.isActive ? <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 stroke-[3]" /> AKTIF</span> : <span className="flex items-center gap-1"><X className="w-3 h-3 stroke-[3]" /> NON-AKTIF</span>}</Badge></div>
                  <p className="text-xs text-[#67737C] font-semibold mt-1 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-[#A0AEC0]" /> No. Rekam Medis: <span className="text-[#13222D] font-medium">{p.noRm}</span></p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-xl hover:bg-slate-100 shrink-0 border border-slate-100"><X className="w-4 h-4 text-[#67737C]" /></Button>
            </div>
          </div>
          <div className="overflow-y-auto px-8 py-6 space-y-6 bg-[#FAFCFD]">
            <div className="space-y-3">
              <h3 className="text-[11px] font-medium text-[#67737C] uppercase tracking-widest flex items-center gap-2"><User className="w-3.5 h-3.5 text-[#1B9C90]" /> Biodata & Identitas Pasien</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex justify-between"><div><span className="text-[10px] font-medium text-[#8A99A5] uppercase tracking-wider block">Nomor NIK (KTP)</span><span className="text-sm font-medium text-[#13222D] mt-0.5 block">{p.nik || '-'}</span></div><UserCheck className="w-5 h-5 text-slate-300" /></div>
                <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm"><div><span className="text-[10px] font-medium text-[#8A99A5] uppercase tracking-wider block">Jenis Kelamin</span><span className={cn("text-xs font-medium px-2.5 py-0.5 rounded-full inline-block mt-1", p.jenisKelamin === "LAKI_LAKI" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600")}>{p.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}</span></div></div>
                <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex justify-between sm:col-span-2"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Calendar className="w-4 h-4" /></div><div><span className="text-[10px] font-medium text-[#8A99A5] uppercase block">Lahir / Tanggal Lahir</span><span className="text-sm font-medium text-[#13222D]">{new Date(p.tanggalLahir).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div></div><div className="text-right border-l border-dashed border-[#E2E8F0] pl-4"><span className="text-[10px] font-medium text-[#8A99A5] uppercase block">Kategori Usia</span><span className="text-base font-extrabold text-[#1B9C90]">{age} <span className="text-xs font-medium text-slate-500">Thn</span></span></div></div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-[11px] font-medium text-[#67737C] uppercase tracking-widest flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-[#1B9C90]" /> Jaminan Kesehatan / Asuransi</h3>
              {isB ? <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 p-4 rounded-2xl border-2 border-blue-100 shadow-sm flex justify-between"><div className="flex gap-3"><div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white"><Shield className="w-5 h-5" /></div><div><span className="text-[10px] font-extrabold text-blue-700 uppercase block">Peserta Jaminan Aktif</span><span className="text-base font-black text-blue-900 block mt-0.5">{p.noBpjs}</span></div></div><Badge className="bg-blue-500 text-white font-medium text-[10px] px-2.5 py-1">BPJS KESEHATAN</Badge></div> : <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex justify-between"><div className="flex gap-3"><div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400"><CreditCard className="w-5 h-5" /></div><div><span className="text-[10px] font-medium text-[#8A99A5] uppercase block">Metode Penjaminan</span><span className="text-sm font-medium text-[#67737C] block mt-0.5">Pasien Umum (Mandiri)</span></div></div><Badge variant="outline" className="text-slate-400 text-[10px] bg-slate-50/50">UMUM</Badge></div>}
            </div>
            <div className="space-y-3">
              <h3 className="text-[11px] font-medium text-[#67737C] uppercase tracking-widest flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#1B9C90]" /> Informasi Kontak Darurat</h3>
              <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center gap-3.5"><div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-[#1B9C90]"><Phone className="w-4 h-4 fill-[#1B9C90]/10" /></div><div className="flex-1"><span className="text-[10px] font-medium text-[#8A99A5] uppercase block">No. Handphone Kasir/Pasien</span><span className="text-sm font-medium text-[#13222D]">{p.telepon || 'Tidak mencantumkan nomor'}</span></div></div>
            </div>
            {(ly || sp) && (
              <div className="space-y-3">
                <h3 className="text-[11px] font-medium text-[#67737C] uppercase tracking-widest flex items-center gap-2"><Heart className="w-3.5 h-3.5 text-red-500" /> Statistik Rekam Medis & Finansial</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {ly && <div className="border border-[#FFEBB7] bg-[#FFFBF0] p-4 rounded-2xl shadow-sm"><span className="text-[10px] font-medium text-[#C98F14] uppercase block">Total Kunjungan Poliklinik</span><div className="flex items-baseline gap-1 mt-2"><span className="text-3xl font-black text-[#D99404]">{ly.kunjungan_terbanyak}</span><span className="text-xs font-medium text-[#C98F14]">Kali</span></div></div>}
                  {sp && <div className="border border-[#B2E7E1] bg-[#ECFAF8] p-4 rounded-2xl shadow-sm"><span className="text-[10px] font-medium text-[#147D73] uppercase block">Kontribusi Finansial</span><div className="text-xl font-black text-[#127067] mt-2.5">{fmt(sp.total_spend)}</div></div>}
                </div>
              </div>
            )}
            <div className="border-t border-dashed border-[#E2E8F0] pt-4 flex gap-2.5 text-[#67737C]"><Clock className="w-4 h-4 text-slate-400 shrink-0" /><p className="text-[11px] font-medium">Terdaftar di database RME sejak <span className="font-medium text-[#13222D]">{new Date(p.createdAt).toLocaleDateString('id-ID')}</span> (Sudah berjalan <span className="font-extrabold text-[#1B9C90]">{Math.floor((Date.now() - new Date(p.createdAt).getTime()) / 86400000)}</span> hari).</p></div>
          </div>
          <div className="border-t border-[#EFF2F5] px-8 py-4 bg-white flex justify-end"><Button variant="outline" onClick={onClose} className="px-5 h-10 rounded-xl border-[#DFE6EB] text-xs font-medium text-[#13222D] hover:bg-slate-50 shadow-none">Tutup Panel</Button></div>
        </div>
      </div>
    </>
  );
};