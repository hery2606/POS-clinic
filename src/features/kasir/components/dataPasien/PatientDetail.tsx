import {
  X,
  Edit3,
  Phone,
  MapPin,
  User,
  ChevronRight,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRightPanel } from "../../context/right-panel-context";
import { PatientHistoryModal } from "./PatientHistoryModal";
import type { PatientDetailData } from "./PatientHistoryModal";

interface PatientData {
  id: string;
  name: string;
  gender: string;
  age: number;
  phone: string;
  address: string;
  bloodType: string;
  allergy: string;
  insurance: string;
  lastVisit: string;
  initial: string;
}

export const PatientDetail = ({
  patient,
}: {
  patient?: Partial<PatientData>;
}) => {
  const { clearContent } = useRightPanel();
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const data: PatientData = {
    id: patient?.id || "RM-098123",
    name: patient?.name || "Budi Santoso",
    gender: patient?.gender || "L",
    age: patient?.age || 45,
    phone: patient?.phone || "+62 812-3456-7890",
    address: patient?.address || "Jl. Melati No. 12, Sleman, Yogyakarta",
    bloodType: patient?.bloodType || "O+",
    allergy: patient?.allergy || "Antibiotik",
    insurance: patient?.insurance || "BPJS",
    lastVisit: patient?.lastVisit || "14 Ags 2023",
    initial: patient?.initial || "BU",
  };

  const patientHistoryData: PatientDetailData = {
    nik: "3404010101900001",
    namaLengkap: patient?.name || "Budi Santoso",
    tanggalLahir: "1990-01-01",
    jenisKelamin: patient?.gender === "P" ? "PEREMPUAN" : "LAKI_LAKI",
    alamat: patient?.address || "Jl. Melati No. 12",
    rt: "01",
    rw: "02",
    kelurahan: "Sleman",
    kecamatan: "Sleman",
    kabupaten: "Sleman",
    provinsi: "Daerah Istimewa Yogyakarta",
    telepon: patient?.phone || "+62 812-3456-7890",
    email: "budi.santoso@email.com",
    golonganDarah: patient?.bloodType || "O+",
    alergi: patient?.allergy ? [patient.allergy] : ["Antibiotik"],
    noBpjs: "0001234567890123",
    jenisPeserta: "Keluarga",
    fktp: "PUSKESMAS SLEMAN",
  };

  const getInsuranceBadgeColor = (insurance: string) => {
    switch (insurance) {
      case "BPJS":
        return {
          bg: "bg-[#DFF6F2]",
          text: "text-[#1B9C90]",
          border: "border-[#DFE6EB]",
        };
      case "Mandiri":
        return {
          bg: "bg-[#FFF9EB]",
          text: "text-[#F2A618]",
          border: "border-[#FFE6A8]",
        };
      case "Asuransi Astra":
        return {
          bg: "bg-[#F0FDF4]",
          text: "text-[#3EB268]",
          border: "border-[#DCFCE7]",
        };
      default:
        return {
          bg: "bg-[#F9FEFC]",
          text: "text-[#67737C]",
          border: "border-[#DFE6EB]",
        };
    }
  };

  const insuranceColor = getInsuranceBadgeColor(data.insurance);

  return (
    <div className="space-y-6 w-full">
      {/* HEADER - Close Button */}
      <div className="flex justify-end mb-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-[#EFF4F8] text-[#67737C]"
          onClick={clearContent}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* PATIENT SUMMARY CARD */}
      <div className="rounded-[20px] border border-[#DFE6EB] bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#DFF6F2] border-2 border-white shadow-md flex items-center justify-center">
            <span className="text-3xl font-bold text-[#1B9C90]">
              {data.initial}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#13222D]">{data.name}</h2>
            <Badge className="mt-2 rounded-full bg-[#EFF4F8] text-[#67737C] border-none font-bold px-3 shadow-none text-xs">
              {data.id}
            </Badge>
          </div>
        </div>

        <Separator className="my-6 bg-[#DFE6EB]" />

        {/* PATIENT INFO */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F9FEFC] border border-[#DFE6EB] flex items-center justify-center text-[#1B9C90]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-[#67737C] uppercase tracking-widest">
                Jenis Kelamin
              </p>
              <p className="text-xs font-bold text-[#13222D]">
                {data.gender === "L" ? "Laki-laki" : "Perempuan"} ({data.age}{" "}
                Tahun)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F9FEFC] border border-[#DFE6EB] flex items-center justify-center text-[#1B9C90]">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-[#67737C] uppercase tracking-widest">
                Kontak
              </p>
              <p className="text-xs font-bold text-[#13222D]">{data.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F9FEFC] border border-[#DFE6EB] flex items-center justify-center text-[#1B9C90]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-[#67737C] uppercase tracking-widest">
                Alamat
              </p>
              <p className="text-xs font-bold text-[#13222D] leading-relaxed">
                {data.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-[16px] border border-[#DFE6EB] text-center">
          <p className="text-[9px] font-bold text-[#67737C] uppercase mb-1">
            Gol. Darah
          </p>
          <p className="text-lg font-bold text-[#E62C2C]">{data.bloodType}</p>
        </div>
        <div className="bg-white p-4 rounded-[16px] border border-[#DFE6EB] text-center">
          <p className="text-[9px] font-bold text-[#67737C] uppercase mb-1">
            Alergi
          </p>
          <p className="text-xs font-bold text-[#F2A618]">{data.allergy}</p>
        </div>
      </div>

      {/* INSURANCE & LAST VISIT */}
      <div className="bg-white p-4 rounded-[16px] border border-[#DFE6EB] space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-[#67737C]">Penjamin</span>
          <Badge
            className={`rounded-full px-2 py-1 text-[9px] font-bold border shadow-none ${insuranceColor.bg} ${insuranceColor.text}`}
          >
            <div className="flex items-center gap-1">
              <div
                className={`w-1 h-1 rounded-full ${insuranceColor.text === "text-[#1B9C90]" ? "bg-[#1B9C90]" : insuranceColor.text === "text-[#F2A618]" ? "bg-[#F2A618]" : "bg-[#3EB268]"}`}
              />
              {data.insurance}
            </div>
          </Badge>
        </div>
        <Separator className="bg-[#DFE6EB]" />
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-[#67737C]">
            Kunjungan Terakhir
          </span>
          <span className="text-xs font-bold text-[#13222D] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {data.lastVisit}
          </span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="space-y-2 border-t border-[#DFE6EB] mt-4 pt-4">
        {/*<Button
          className="w-full h-10 bg-[#1B9C90] hover:bg-[#15857a] rounded-full text-white font-bold text-sm shadow-lg shadow-[#1B9C90]/20 gap-2"
          onClick={() =>
            setContent("payment", {
              patientId: data.id,
              patientName: data.name,
            })
          }
        >
          <ChevronRight className="w-4 h-4" />
          Lanjut Pembayaran
        </Button>*/}
        <Button className="w-full h-10 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-bold text-sm shadow-lg shadow-blue-600/20 gap-2">
          <Edit3 className="w-4 h-4" />
          Edit Profil
        </Button>
        <Button
          variant="outline"
          className="w-full h-10 rounded-full border-[#DFE6EB] text-[#13222D] font-bold text-sm bg-[#F9FEFC] hover:bg-[#EFF4F8] gap-2"
          onClick={() => setIsHistoryModalOpen(true)}
        >
          <ChevronRight className="w-4 h-4" />
          Riwayat Lengkap
        </Button>
        <PatientHistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          patientData={patientHistoryData}
        />
      </div>
    </div>
  );
};
