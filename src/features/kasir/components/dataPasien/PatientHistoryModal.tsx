import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Droplet,
  ShieldAlert,
  Calendar,
} from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface PatientDetailData {
  nik: string;
  namaLengkap: string;
  tanggalLahir: string;
  jenisKelamin: "LAKI_LAKI" | "PEREMPUAN";
  alamat: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  telepon: string;
  email: string;
  golonganDarah: string;
  alergi: string[];
  noBpjs: string;
  jenisPeserta: string;
  fktp: string;
}

interface PatientHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientData: PatientDetailData | null;
}

export const PatientHistoryModal = ({
  isOpen,
  onClose,
  patientData,
}: PatientHistoryModalProps) => {
  if (!patientData) return null;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return createPortal(
    <div className={cn(
      "fixed inset-0 bg-black/50 flex items-center justify-center z-9999 p-4",
      !isOpen && "hidden"
    )}>
      <div className="bg-white rounded-[32px] border border-[#DFE6EB] w-6xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* HEADER */}
        <div className="p-6 border-b border-[#DFE6EB] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#1B9C90]" />
            <h2 className="text-lg font-bold text-[#13222D]">
              Detail & Riwayat Rekam Medis
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-[#EFF4F8] text-[#67737C] h-9 w-9"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* BODY SYSTEM WITH GRID LAYOUT */}
        <ScrollArea className="max-h-[75vh] overflow-y-auto">
          <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start bg-[#F9FEFC]">
            
            {/* LEFT COLUMN: PROFILE CARD & CONTACT (4 SPAN) */}
            <div className="md:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-[24px] border border-[#DFE6EB] text-center space-y-4 shadow-sm">
                <div className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center mx-auto border border-[#DFE6EB] font-bold text-2xl shadow-inner",
                  patientData.jenisKelamin === "LAKI_LAKI" 
                    ? "bg-[#DFF6F2] text-[#1B9C90]" 
                    : "bg-[#FEF2F2] text-[#E62C2C]"
                )}>
                  {getInitials(patientData.namaLengkap)}
                </div>
                <div>
                  <h3 className="font-bold text-[#13222D] text-base leading-tight">
                    {patientData.namaLengkap}
                  </h3>
                  <p className="text-xs font-medium text-[#67737C] mt-1.5">
                    {patientData.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"} • {calculateAge(patientData.tanggalLahir)} Tahun
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-[24px] border border-[#DFE6EB] space-y-4 shadow-sm">
                <h4 className="text-[10px] font-bold text-[#67737C] uppercase tracking-wider">
                  Kontak Pasien
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-[#67737C] shrink-0" />
                    <span className="font-medium text-[#13222D]">{patientData.telepon}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm overflow-hidden">
                    <Mail className="w-4 h-4 text-[#67737C] shrink-0" />
                    <span className="font-medium text-[#13222D] truncate">{patientData.email || "-"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: DETAIL CARDS (8 SPAN) */}
            <div className="md:col-span-8 space-y-6">
              
              {/* SECTION 1: DATA PERSONAL & DEMOGRAFI */}
              <div className="bg-white p-6 rounded-[24px] border border-[#DFE6EB] space-y-6 shadow-sm">
                <h4 className="text-xs font-bold text-[#1B9C90] uppercase tracking-wider border-b border-[#DFE6EB] pb-2">
                  Informasi Demografi & Identitas
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-[#67737C] uppercase">Nomor Identitas (NIK)</p>
                    <p className="text-sm font-bold text-[#13222D] mt-0.5">{patientData.nik}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#67737C] uppercase">Tanggal Lahir</p>
                    <p className="text-sm font-bold text-[#13222D] mt-0.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#67737C]" />
                      {formatDate(patientData.tanggalLahir)}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-[10px] font-bold text-[#67737C] uppercase flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Alamat Domisili Resmi
                  </p>
                  <p className="text-sm font-medium text-[#13222D] mt-1 leading-relaxed">
                    {patientData.alamat}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-[#EFF4F8] text-xs">
                    <div>
                      <span className="text-[#67737C] block font-medium">RT / RW</span>
                      <span className="font-bold text-[#13222D]">RT {patientData.rt} / RW {patientData.rw}</span>
                    </div>
                    <div>
                      <span className="text-[#67737C] block font-medium">Kelurahan</span>
                      <span className="font-bold text-[#13222D]">{patientData.kelurahan}</span>
                    </div>
                    <div>
                      <span className="text-[#67737C] block font-medium">Kecamatan</span>
                      <span className="font-bold text-[#13222D]">{patientData.kecamatan}</span>
                    </div>
                    <div>
                      <span className="text-[#67737C] block font-medium">Kota/Kabupaten</span>
                      <span className="font-bold text-[#13222D]">{patientData.kabupaten}</span>
                    </div>
                    <div>
                      <span className="text-[#67737C] block font-medium">Provinsi</span>
                      <span className="font-bold text-[#13222D]">{patientData.provinsi}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: KESEHATAN & ASURANSI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* MEDIS */}
                <div className="bg-white p-6 rounded-[24px] border border-[#DFE6EB] space-y-4 shadow-sm">
                  <h4 className="text-xs font-bold text-[#13222D] uppercase tracking-wider flex items-center gap-1.5">
                    <Droplet className="w-4 h-4 text-[#E62C2C]" /> Informasi Klinis
                  </h4>
                  <div>
                    <p className="text-[10px] font-bold text-[#67737C] uppercase">Golongan Darah</p>
                    <span className="inline-block mt-1 px-3 py-0.5 bg-[#FEF2F2] border border-[#FEE2E2] rounded-full text-xs font-bold text-[#E62C2C]">
                      {patientData.golonganDarah || "-"}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#67737C] uppercase mb-1">Daftar Alergi</p>
                    {patientData.alergi && patientData.alergi.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {patientData.alergi.map((allergi, index) => (
                          <span key={index} className="px-2 py-0.5 bg-[#FFF9EB] text-[#F2A618] text-[10px] font-bold rounded-full border border-[#FFE6A8]">
                            {allergi}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-medium text-[#67737C]">Tidak ada riwayat alergi</p>
                    )}
                  </div>
                </div>

                {/* PENJAMIN */}
                <div className="bg-white p-6 rounded-[24px] border border-[#DFE6EB] space-y-3 shadow-sm">
                  <h4 className="text-xs font-bold text-[#13222D] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-[#1B9C90]" /> Jaminan / Asuransi
                  </h4>
                  <div>
                    <p className="text-[10px] font-bold text-[#67737C] uppercase">Nomor Kartu BPJS</p>
                    <p className="text-sm font-bold text-[#13222D] mt-0.5">{patientData.noBpjs || "-"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#67737C] uppercase">Fasilitas Kesehatan (FKTP)</p>
                    <p className="text-xs font-semibold text-[#67737C] mt-0.5">{patientData.fktp || "-"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#67737C] uppercase">Jenis Kepesertaan</p>
                    <p className="text-xs font-bold text-[#1B9C90] mt-0.5">{patientData.jenisPeserta || "-"}</p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </ScrollArea>

        {/* FOOTER ACTION */}
        <div className="p-4 border-t border-[#DFE6EB] bg-white flex justify-end gap-3 rounded-b-[32px] shrink-0">
          <Button
            onClick={onClose}
            className="w-full sm:w-32 h-10 bg-[#1B9C90] hover:opacity-90 rounded-full text-white font-bold text-sm border-none shadow-md shadow-[#1B9C90]/10"
          >
            Tutup
          </Button>
        </div>

      </div>
    </div>,
    document.body
  );
};