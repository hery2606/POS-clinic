"use client"

import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  User,
  Phone,
  Heart,
  Clock,
  Shield,
  X,
  CheckCircle
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
  // Fetch patient analytics if patient ID provided
  const { data: analyticsData } = useQuery({
    queryKey: ['patientAnalytics'],
    queryFn: () => analitikService.getPatientAnalytics(),
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Use initial patient or get from analytics (for loyalty info)
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

  if (!patient) return null;

  const age = calculateAge(patient.tanggalLahir);
  const isBPJS = patient.noBpjs && patient.noBpjs !== 'null';

  if (!isOpen) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* MODAL CONTAINER */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4">
        <div className="bg-white rounded-2xl border border-[#DFE6EB] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* HEADER */}
          <div className="border-b border-[#DFE6EB] px-8 py-6 bg-gradient-to-r from-white to-[#F9FEFC]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1B9C90] to-[#0F6B64] flex items-center justify-center text-white font-medium text-2xl border-4 border-[#DFF6F2] shadow-sm">
                  {patient.namaLengkap.charAt(0).toUpperCase()}
                </div>

                {/* Header Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-medium text-[#13222D]">
                    {patient.namaLengkap}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium border-none shadow-none",
                        patient.isActive
                          ? "bg-[#DFF6F2] text-[#1B9C90]"
                          : "bg-[#FEF2F2] text-[#E62C2C]"
                      )}
                    >
                      {patient.isActive ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          AKTIF
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <X className="w-3 h-3" />
                          TIDAK AKTIF
                        </div>
                      )}
                    </Badge>
                    {isBPJS && (
                      <Badge className="rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 border-none shadow-none">
                        <Shield className="w-3 h-3 mr-1" />
                        BPJS
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-full hover:bg-[#EFF4F8] shrink-0"
              >
                <X className="w-4 h-4 text-[#67737C]" />
              </Button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="overflow-y-auto max-h-[calc(90vh-160px)] px-8 py-6 space-y-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-sm font-medium text-[#13222D] uppercase tracking-wider mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-[#1B9C90]" />
                Informasi Pribadi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nomor RM */}
                <Card className="p-4 border border-[#DFE6EB] bg-white rounded-xl hover:shadow-md transition-shadow">
                  <p className="text-xs text-[#67737C] uppercase tracking-wider font-medium mb-1">
                    Nomor Rekam Medis
                  </p>
                  <p className="text-lg font-medium text-[#13222D]">{patient.noRm}</p>
                </Card>

                {/* NIK */}
                <Card className="p-4 border border-[#DFE6EB] bg-white rounded-xl hover:shadow-md transition-shadow">
                  <p className="text-xs text-[#67737C] uppercase tracking-wider font-medium mb-1">
                    NIK (Nomor Identitas)
                  </p>
                  <p className="text-lg font-medium text-[#13222D]">{patient.nik}</p>
                </Card>

                {/* Tanggal Lahir */}
                <Card className="p-4 border border-[#DFE6EB] bg-[#F9FEFC] rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#67737C] uppercase tracking-wider font-medium mb-1">
                        Tanggal Lahir
                      </p>
                      <p className="text-sm font-medium text-[#13222D]">
                        {formatDate(patient.tanggalLahir)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#67737C] font-medium">Usia</p>
                      <p className="text-xl font-medium text-[#1B9C90]">{age} tahun</p>
                    </div>
                  </div>
                </Card>

                {/* Jenis Kelamin */}
                <Card className="p-4 border border-[#DFE6EB] bg-[#F9FEFC] rounded-xl hover:shadow-md transition-shadow">
                  <p className="text-xs text-[#67737C] uppercase tracking-wider font-medium mb-1">
                    Jenis Kelamin
                  </p>
                  <Badge
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium border-none shadow-none",
                      patient.jenisKelamin === "LAKI_LAKI"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-pink-100 text-pink-700"
                    )}
                  >
                    {patient.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}
                  </Badge>
                </Card>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h3 className="text-sm font-medium text-[#13222D] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#1B9C90]" />
                Informasi Kontak
              </h3>
              <Card className="p-4 border border-[#DFE6EB] bg-white rounded-xl hover:shadow-md transition-shadow">
                <p className="text-xs text-[#67737C] uppercase tracking-wider font-medium mb-2">
                  Nomor Telepon
                </p>
                <p className="text-lg font-medium text-[#13222D]">{patient.telepon || '-'}</p>
              </Card>
            </div>

            {/* Insurance Information Section */}
            {isBPJS && (
              <div>
                <h3 className="text-sm font-medium text-[#13222D] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Informasi Asuransi
                </h3>
                <Card className="p-4 border-2 border-blue-200 bg-blue-50 rounded-xl hover:shadow-md transition-shadow">
                  <p className="text-xs text-blue-700 uppercase tracking-wider font-medium mb-2">
                    Nomor BPJS Kesehatan
                  </p>
                  <p className="text-lg font-medium text-blue-900">{patient.noBpjs}</p>
                </Card>
              </div>
            )}

            {/* Loyalty & Spending Section */}
            {(loyaltyInfo || spendInfo) && (
              <div>
                <h3 className="text-sm font-medium text-[#13222D] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#E62C2C]" />
                  Statistik Pasien
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loyaltyInfo && (
                    <Card className="p-4 border border-[#FFE6A8] bg-[#FFF9EB] rounded-xl hover:shadow-md transition-shadow">
                      <p className="text-xs text-[#F2A618] uppercase tracking-wider font-medium mb-2">
                        Kunjungan Terbanyak
                      </p>
                      <p className="text-3xl font-medium text-[#F2A618]">
                        {loyaltyInfo.kunjungan_terbanyak}
                      </p>
                      <p className="text-xs text-[#D99E08] font-medium mt-1">
                        kunjungan dalam periode ini
                      </p>
                    </Card>
                  )}
                  {spendInfo && (
                    <Card className="p-4 border border-[#B8EBE5] bg-[#DFF6F2] rounded-xl hover:shadow-md transition-shadow">
                      <p className="text-xs text-[#1B9C90] uppercase tracking-wider font-medium mb-2">
                        Total Pengeluaran
                      </p>
                      <p className="text-2xl font-medium text-[#1B9C90]">
                        {formatCurrency(spendInfo.total_spend)}
                      </p>
                      <p className="text-xs text-[#0F6B64] font-medium mt-1">
                        total belanja pasien
                      </p>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Registration Date Section */}
            <div>
              <h3 className="text-sm font-medium text-[#13222D] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#67737C]" />
                Informasi Pendaftaran
              </h3>
              <Card className="p-4 border border-[#DFE6EB] bg-[#F9FEFC] rounded-xl hover:shadow-md transition-shadow">
                <p className="text-xs text-[#67737C] uppercase tracking-wider font-medium mb-2">
                  Tanggal Pendaftaran
                </p>
                <p className="text-base font-medium text-[#13222D]">
                  {formatDate(patient.createdAt)}
                </p>
                <p className="text-xs text-[#67737C] font-medium mt-2">
                  Pasien sudah terdaftar selama{' '}
                  <span className="font-medium text-[#1B9C90]">
                    {Math.floor(
                      (Date.now() - new Date(patient.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                    )}{' '}
                    hari
                  </span>
                </p>
              </Card>
            </div>
          </div>

          {/* FOOTER */}
          <div className="border-t border-[#DFE6EB] px-8 py-4 bg-[#F9FEFC]/50 flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 h-10 rounded-lg border-[#DFE6EB] font-medium text-[#13222D] hover:bg-[#EFF4F8]"
            >
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
