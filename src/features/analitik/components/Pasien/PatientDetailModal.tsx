"use client"

import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  User,
  Phone,
  Heart,
  Clock,
  Shield,
  X,
  CheckCircle2,
  Calendar,
  Layers,
  CreditCard,
  UserCheck
} from 'lucide-react';
import type { PatientData } from '../../types/patient.types';
import { analitikService } from '../../services/analitik.service';

interface PatientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string;
  patient?: PatientData;
}

export const PatientDetailModal = ({
  isOpen,
  onClose,
  patientId,
  patient: initialPatient,
}: PatientDetailModalProps) => {
  // Ambil data analitik pasien dari React Query
  const { data: analyticsData } = useQuery({
    queryKey: ['patientAnalytics'],
    queryFn: () => analitikService.getPatientAnalytics(),
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const patient = initialPatient;
  
  const loyaltyInfo = analyticsData?.data?.pasien_paling_loyal?.find(
    (p) => p.id_pasien === patientId
  );
  const spendInfo = analyticsData?.data?.pasien_spend_tertinggi?.find(
    (p) => p.id_pasien === patientId
  );

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatCurrency = (value: number | string): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(value));
  };

  if (!patient || !isOpen) return null;

  const age = calculateAge(patient.tanggalLahir);
  const isBPJS = patient.noBpjs && patient.noBpjs !== 'null' && patient.noBpjs.trim() !== '';

  return (
    <>
      {/* BACKDROP GLASSMORPHISM OVERLAY */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* MODAL CONTAINER */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[51] w-full max-w-2xl px-4">
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
          
          {/* HEADER DENGAN GRADIENT KLINIK SOFT */}
          <div className="border-b border-[#EFF2F5] px-8 py-6 bg-gradient-to-br from-white via-white to-[#F4FBF9]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Lingkaran Avatar Monogram */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1B9C90] to-[#127067] flex items-center justify-center text-white font-medium text-xl border-4 border-[#E2F6F3] shadow-md shadow-[#1B9C90]/10 shrink-0">
                  {patient.namaLengkap.charAt(0).toUpperCase()}
                </div>

                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-xl font-medium text-[#13222D] tracking-tight">
                      {patient.namaLengkap}
                    </h2>
                    <Badge
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-medium border-none shadow-none tracking-wider",
                        patient.isActive
                          ? "bg-[#E2F6F3] text-[#1B9C90]"
                          : "bg-red-50 text-red-600"
                      )}
                    >
                      {patient.isActive ? (
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 stroke-[3]" /> AKTIF</span>
                      ) : (
                        <span className="flex items-center gap-1"><X className="w-3 h-3 stroke-[3]" /> NON-AKTIF</span>
                      )}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#67737C] font-semibold mt-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#A0AEC0]" /> No. Rekam Medis: <span className="text-[#13222D] font-medium">{patient.noRm}</span>
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-xl hover:bg-slate-100 shrink-0 border border-slate-100"
              >
                <X className="w-4 h-4 text-[#67737C]" />
              </Button>
            </div>
          </div>

          {/* ISI CONTENT BODY (DI-OPTIMALKAN DENGAN GRID SISTEM LEBIH PADAT) */}
          <div className="overflow-y-auto px-8 py-6 space-y-6 bg-[#FAFCFD]">
            
            {/* SEKSI 1: INFORMASI DEMOGRAFI & DATA DIRI */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-medium text-[#67737C] uppercase tracking-widest flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#1B9C90]" />
                Biodata & Identitas Pasien
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* NIK Field */}
                <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-medium text-[#8A99A5] uppercase tracking-wider block">Nomor NIK (KTP)</span>
                    <span className="text-sm font-medium text-[#13222D] mt-0.5 block">{patient.nik || '-'}</span>
                  </div>
                  <UserCheck className="w-5 h-5 text-slate-300" />
                </div>

                {/* Jenis Kelamin Field */}
                <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-medium text-[#8A99A5] uppercase tracking-wider block">Jenis Kelamin</span>
                    <span className={cn(
                      "text-xs font-medium px-2.5 py-0.5 rounded-full inline-block mt-1",
                      patient.jenisKelamin === "LAKI_LAKI" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"
                    )}>
                      {patient.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}
                    </span>
                  </div>
                </div>

                {/* Tanggal Lahir & Usia Campuran */}
                <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center justify-between sm:col-span-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-medium text-[#8A99A5] uppercase tracking-wider block">Lahir / Tanggal Lahir</span>
                      <span className="text-sm font-medium text-[#13222D]">{formatDate(patient.tanggalLahir)}</span>
                    </div>
                  </div>
                  <div className="text-right border-l border-dashed border-[#E2E8F0] pl-4">
                    <span className="text-[10px] font-medium text-[#8A99A5] uppercase block">Kategori Usia</span>
                    <span className="text-base font-extrabold text-[#1B9C90]">{age} <span className="text-xs font-medium text-slate-500">Thn</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* SEKSI 2: JALUR UTAMA LAYANAN ASURANSI (BPJS FIX DI SINI) */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-medium text-[#67737C] uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#1B9C90]" />
                Jaminan Kesehatan / Asuransi
              </h3>
              
              {isBPJS ? (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 p-4 rounded-2xl border-2 border-blue-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
                      <Shield className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-widest block">Peserta Jaminan Aktif</span>
                      <span className="text-base font-black text-blue-900 tracking-wide mt-0.5 block">{patient.noBpjs}</span>
                    </div>
                  </div>
                  <Badge className="bg-blue-500 text-white font-medium text-[10px] rounded-lg shadow-none border-none px-2.5 py-1">BPJS KESEHATAN</Badge>
                </div>
              ) : (
                <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-medium text-[#8A99A5] uppercase tracking-wider block">Metode Penjaminan</span>
                      <span className="text-sm font-medium text-[#67737C] block mt-0.5">Pasien Umum (Non-Asuransi / Mandiri)</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-slate-400 font-medium border-slate-200 rounded-lg text-[10px] px-2 py-0.5 bg-slate-50/50">UMUM</Badge>
                </div>
              )}
            </div>

            {/* SEKSI 3: INFORMASI HUBUNGAN KONTAK */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-medium text-[#67737C] uppercase tracking-widest flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#1B9C90]" />
                Informasi Kontak Darurat
              </h3>
              <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-[#1B9C90]">
                  <Phone className="w-4 h-4 fill-[#1B9C90]/10" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-medium text-[#8A99A5] uppercase tracking-wider block">No. Handphone Kasir/Pasien</span>
                  <span className="text-sm font-medium text-[#13222D]">{patient.telepon || 'Tidak mencantumkan nomor'}</span>
                </div>
              </div>
            </div>

            {/* SEKSI 4: STATISTIK & LOYALITAS DATA PASIEN */}
            {(loyaltyInfo || spendInfo) && (
              <div className="space-y-3">
                <h3 className="text-[11px] font-medium text-[#67737C] uppercase tracking-widest flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-red-500" />
                  Statistik Rekam Medis & Finansial Pasien
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {loyaltyInfo && (
                    <div className="border border-[#FFEBB7] bg-[#FFFBF0] p-4 rounded-2xl shadow-sm relative overflow-hidden">
                      <span className="text-[10px] font-medium text-[#C98F14] uppercase tracking-wider block">Total Kunjungan Poliklinik</span>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-3xl font-black text-[#D99404]">{loyaltyInfo.kunjungan_terbanyak}</span>
                        <span className="text-xs font-medium text-[#C98F14]">Kali</span>
                      </div>
                      <span className="text-[10px] font-semibold text-[#D99A1A] block mt-1">Sangat loyal dalam periode pendaftaran ini</span>
                    </div>
                  )}
                  {spendInfo && (
                    <div className="border border-[#B2E7E1] bg-[#ECFAF8] p-4 rounded-2xl shadow-sm">
                      <span className="text-[10px] font-medium text-[#147D73] uppercase tracking-wider block">Kontribusi Finansial Obor</span>
                      <div className="text-xl font-black text-[#127067] mt-2.5">
                        {formatCurrency(spendInfo.total_spend)}
                      </div>
                      <span className="text-[10px] font-semibold text-[#1B8A80] block mt-1.5">Akumulasi transaksi kasir obat farmasi</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SEKSI 5: JEJAK WAKTU TIMESTAMPS */}
            <div className="border-t border-dashed border-[#E2E8F0] pt-4 flex items-center gap-2.5 text-[#67737C]">
              <Clock className="w-4 h-4 text-slate-400" />
              <p className="text-[11px] font-medium">
                Terdaftar di database RME sejak <span className="font-medium text-[#13222D]">{formatDate(patient.createdAt)}</span> (Sudah berjalan{" "}
                <span className="font-extrabold text-[#1B9C90]">
                  {Math.floor((Date.now() - new Date(patient.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                </span>{" "}
                hari kerja).
              </p>
            </div>
          </div>

          {/* FOOTER ACTION */}
          <div className="border-t border-[#EFF2F5] px-8 py-4 bg-white flex gap-3 justify-end items-center">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-5 h-10 rounded-xl border-[#DFE6EB] text-xs font-medium text-[#13222D] hover:bg-slate-50 shadow-none"
            >
              Tutup Panel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};