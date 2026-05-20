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
  
  if (patients.length === 0) return null;
  
  const showingFiltered = searchQuery.length > 0 && patients.length < (totalPatients || patients.length);

  return (
    <div className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm flex flex-col overflow-hidden">
      
      {/* HEADER SECTION */}
      <div className="p-5 border-b border-[#DFE6EB] bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#DFF6F2] flex items-center justify-center">
            <Users className="w-5 h-5 text-[#1B9C90]" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-[#13222D]">Antrian Pasien</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1B9C90] animate-pulse" />
              <p className="text-[10px] font-medium text-[#67737C] uppercase tracking-wider">
                {patients.length} Menunggu
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LIST SECTION DENGAN VERTICAL SCROLL */}
      <ScrollArea className="bg-[#F9FEFC]/30">
        <div className="p-4 space-y-2.5 max-h-[420px]">
          {patients.map((patient, index) => {
            const isActive = selectedPatientId === patient.id;
            
            return (
              <div
                key={patient.id}
                className="group relative"
              >
                <div
                  onClick={() => onSelectPatient(patient)}
                  className={cn(
                    "relative flex items-center gap-4 p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden",
                    isActive 
                      ? "bg-white border-[#1B9C90] shadow-md shadow-[#1B9C90]/10 z-10 scale-[1.02]" 
                      : "bg-white/50 border-[#EFF4F8] hover:border-[#DFE6EB] hover:bg-white"
                  )}
                >
                  {/* Indicator Line untuk yang Aktif */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1B9C90]" />
                  )}

                  {/* Nomor Antrian / Index */}
                  <div className="hidden sm:flex text-[10px] font-black text-[#DFE6EB] absolute right-4 bottom-2 italic group-hover:text-[#1B9C90]/20 transition-colors">
                    #{index + 1}
                  </div>

                  {/* Avatar Section */}
                  <div className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-all shadow-sm",
                    isActive 
                      ? "bg-[#1B9C90] text-white" 
                      : "bg-[#EFF4F8] text-[#67737C]"
                  )}>
                    {patient.initials || patient.name.substring(0, 2).toUpperCase()}
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn(
                        "text-sm font-bold truncate",
                        isActive ? "text-[#1B9C90]" : "text-[#13222D]"
                      )}>
                        {patient.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[10px] font-bold text-[#67737C]">
                        {patient.registrationNo}
                      </p>
                      <span className="text-[#DFE6EB] text-[10px]">•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-[#67737C]/60" />
                        <p className="text-[10px] font-medium text-[#67737C]">
                          10 mnt lalu
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Hapus (X) - Muncul saat hover */}
                  {onRemovePatient && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemovePatient(patient.id);
                      }}
                      className={cn(
                        "opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-full hover:bg-red-50 text-[#67737C] hover:text-red-500",
                        isActive && "opacity-100"
                      )}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* FOOTER MINI */}
      <div className="p-3 bg-[#EFF4F8]/50 border-t border-[#DFE6EB] text-center">
        <p className="text-[9px] font-bold text-[#67737C] uppercase tracking-[0.1em]">
          {showingFiltered ? (
            <>
              Menampilkan {patients.length} dari {totalPatients} Pasien
            </>
          ) : (
            "Daftar Tunggu Otomatis Terupdate"
          )}
        </p>
      </div>
    </div>
  );
}