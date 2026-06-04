import { X, Users, Clock } from 'lucide-react';
import { type Patient } from '@/features/kasir/data/patients';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface PatientQueueProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  selectedPatientId: string | null;
  onRemovePatient?: (patientId: string) => void;
  searchQuery?: string;
  totalPatients?: number;
}

export function PatientQueue({ 
  patients, 
  onSelectPatient, 
  selectedPatientId,
  onRemovePatient,
  searchQuery = "",
  totalPatients = 0
}: PatientQueueProps) {
  
  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 text-xs font-medium h-full min-h-[150px]">
        Tidak ada pasien dalam daftar tunggu antrean.
      </div>
    );
  }
  
  const showingFiltered = searchQuery.length > 0 && patients.length < (totalPatients || patients.length);

  return (
    <div className="w-full flex flex-col h-full min-h-0 bg-transparent">
      
      {/* COUNTER HEADER MINI INTERNAL */}
      <div className="flex items-center justify-between pb-2 px-1 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#1B9C90] animate-pulse" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            {patients.length} Pasien Menunggu
          </p>
        </div>
      </div>

      {/* LIST SECTION - Fleksibel Mengikuti Sisa Kontainer Induk */}
      <ScrollArea className="flex-1 w-full min-h-0 bg-transparent">
        <div className="space-y-2 pr-1 py-1">
          {patients.map((patient, index) => {
            const isActive = selectedPatientId === patient.id;
            
            return (
              <div
                key={patient.id}
                className="group relative w-full"
              >
                <div
                  onClick={() => onSelectPatient(patient)}
                  className={cn(
                    "relative flex items-center gap-3.5 p-3 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden w-full",
                    isActive 
                      ? "bg-white border-[#1B9C90] shadow-sm z-10" 
                      : "bg-slate-50/50 border-slate-100 hover:border-slate-200 hover:bg-white"
                  )}
                >
                  {/* Garis Indikator Sisi Kiri Aktif */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1B9C90]" />
                  )}

                  {/* Penanda Nomor Urut Antrean */}
                  <div className="hidden sm:flex text-[9px] font-black text-slate-200 absolute right-3 bottom-1.5 italic group-hover:text-[#1B9C90]/20 transition-colors">
                    #{index + 1}
                  </div>

                  {/* Avatar Inisial Pasien */}
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors shadow-2xs",
                    isActive 
                      ? "bg-[#1B9C90] text-white" 
                      : "bg-white text-slate-500 border border-slate-100"
                  )}>
                    {patient.initials || patient.name.substring(0, 2).toUpperCase()}
                  </div>

                  {/* Ringkasan Informasi Rekam Medis */}
                  <div className="flex-1 min-w-0 pr-4">
                    <p className={cn(
                      "text-xs font-bold truncate leading-tight",
                      isActive ? "text-[#1B9C90]" : "text-[#13222D]"
                    )}>
                      {patient.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 font-medium">
                      <span className="font-bold text-slate-500">{patient.registrationNo}</span>
                      <span>•</span>
                      <div className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5 opacity-70" />
                        <span>10 mnt lalu</span>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Aksi Hapus Pasien Dari Antrean */}
                  {onRemovePatient && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemovePatient(patient.id);
                      }}
                      className={cn(
                        "opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 absolute right-2 top-1/2 -translate-y-1/2 bg-white sm:bg-transparent shadow-xs sm:shadow-none",
                        isActive && "opacity-100"
                      )}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* FOOTER STATISTIK MINI */}
      {showingFiltered && (
        <div className="pt-2 border-t border-slate-100 mt-1 shrink-0 bg-transparent text-right">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            Menampilkan {patients.length} dari {totalPatients} Pasien
          </p>
        </div>
      )}
    </div>
  );
}