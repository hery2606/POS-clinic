import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Calendar, Phone, Stethoscope, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PatientCardProps {
  initials?: string
  name?: string
  phone?: string
  insurance?: string
  registrationNo?: string
  age?: number
}

export function PatientCard({ 
  initials = 'BS', 
  name = 'Budi Santoso', 
  phone = '+62 812-3456-7890',
  insurance = 'BPJS Kesehatan',
  registrationNo = 'RM-001',
  age = 45
}: PatientCardProps) {
  
  const isBPJS = insurance.toLowerCase().includes('bpjs');
  const badgeColor = isBPJS 
    ? 'bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-50'
    : 'bg-emerald-50 text-[#1B9C90] border border-emerald-100 hover:bg-emerald-50';

  return (
    <div className="w-full h-full bg-white border border-[#DFE6EB] rounded-[24px] p-6 flex flex-col justify-between shadow-sm transition-all duration-200">
      
      {/* SECTION ATAS: AVATAR & INFORMASI UTAMA (CENTERED VERTICAL) */}
      <div className="flex flex-col items-center text-center space-y-3 mt-2">
        {/* Avatar Besar Lingkaran/Kotak Melengkung */}
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#1B9C90] to-[#127067] text-white flex items-center justify-center font-black text-xl shadow-md shadow-[#1B9C90]/10 shrink-0">
          {initials}
        </div>
        
        {/* Nama & Badge Penjamin */}
        <div className="space-y-1.5 flex flex-col items-center w-full">
          <h3 className="font-black text-slate-800 text-base md:text-lg tracking-tight max-w-full truncate px-1">
            {name}
          </h3>
          <Badge className={cn(
            "flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[9px] font-black tracking-wider uppercase border shadow-none w-fit",
            badgeColor
          )}>
            <Shield className="h-3 w-3 shrink-0 opacity-80" />
            {isBPJS ? (
              <>
                <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />
                <span>BPJS Kesehatan</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />
                <span>Pasien Pribadi</span>
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* SECTION BAWAH: DATA REKAM MEDIS & KONTAK (GRID LIST) */}
      <div className="bg-[#FAFCFD] border border-slate-100 rounded-xl p-3.5 space-y-2.5 text-xs font-semibold text-slate-600 mb-2">
        <div className="flex items-center justify-between border-b border-slate-200/40 pb-2">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>No. Rekam Medis</span>
          </div>
          <span className="font-black text-slate-800">{registrationNo}</span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-200/40 pb-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>Usia Pasien</span>
          </div>
          <span className="text-slate-700 font-bold">{age} tahun</span>
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>No. WhatsApp</span>
          </div>
          <span className="text-slate-700 font-medium font-mono text-[11px]">{phone}</span>
        </div>
      </div>

    </div>
  )
}