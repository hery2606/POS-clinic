import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Phone 
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRightPanel } from '../../context/right-panel-context';

interface Patient {
  id: string
  name: string
  gender: string
  age: number
  phone: string
  address?: string
  insurance: string
  lastVisit: string
  initial: string
  type: string
  highlighted?: boolean
}

const patients: Patient[] = [
  { 
    id: 'RM-098123', 
    name: 'Budi Santoso', 
    gender: 'L', 
    age: 45, 
    phone: '+62 812-3456-7890', 
    address: 'Jl. Melati No. 12, Sleman, Yogyakarta',
    insurance: 'BPJS', 
    lastVisit: '14 Ags 2023', 
    initial: 'BU', 
    type: 'success', 
    highlighted: true 
  },
  { 
    id: 'RM-098124', 
    name: 'Siti Aminah', 
    gender: 'P', 
    age: 32, 
    phone: '+62 856-7890-1234', 
    address: 'Jl. Cempaka No. 5, Yogyakarta',
    insurance: 'Mandiri', 
    lastVisit: '10 Ags 2023', 
    initial: 'SI', 
    type: 'warning' 
  },
  { 
    id: 'RM-098125', 
    name: 'Agus Pratama', 
    gender: 'L', 
    age: 28, 
    phone: '+62 813-4567-8901', 
    address: 'Jl. Merdeka No. 7, Sleman',
    insurance: 'Asuransi Astra', 
    lastVisit: '05 Ags 2023', 
    initial: 'AG', 
    type: 'info' 
  },
  { 
    id: 'RM-098126', 
    name: 'Rina Wijaya', 
    gender: 'P', 
    age: 50, 
    phone: '+62 811-2345-6789', 
    address: 'Jl. Sudirman No. 20, Yogyakarta',
    insurance: 'BPJS', 
    lastVisit: '22 Jul 2023', 
    initial: 'RI', 
    type: 'success' 
  },
  { 
    id: 'RM-098127', 
    name: 'Dodi Hermawan', 
    gender: 'L', 
    age: 38, 
    phone: '+62 812-9876-5432', 
    address: 'Jl. Ahmad Yani No. 15, Sleman',
    insurance: 'Mandiri', 
    lastVisit: '15 Jul 2023', 
    initial: 'DO', 
    type: 'warning' 
  },
];

export const PatientList = () => {
  const { setContent } = useRightPanel()
  const [activePatientId, setActivePatientId] = useState(
    () => patients.find((patient) => patient.highlighted)?.id ?? null
  )

  const handlePatientClick = (patient: Patient) => {
    setActivePatientId(patient.id)
    const patientData = {
      id: patient.id,
      name: patient.name,
      gender: patient.gender,
      age: patient.age,
      phone: patient.phone,
      address: patient.address,
      insurance: patient.insurance,
      lastVisit: patient.lastVisit,
      initial: patient.initial,
      bloodType: 'O+',
      allergy: 'Antibiotik',
    }
    
    setContent('patient-detail', patientData)
  }

  return (
    <div className="bg-[#F9FEFC] min-h-screen p-6">
      <div className="bg-white rounded-[20px] border border-[#DFE6EB] shadow-sm overflow-hidden">
        
        {/* TOP BAR: SEARCH & ACTIONS */}
        <div className="p-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-lg group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#67737C] group-focus-within:text-[#1B9C90] transition-colors" />
            <Input 
              placeholder="Cari Nama / No. Rekam Medis..." 
              className="pl-12 h-14 rounded-full bg-[#F9FEFC] border-[#DFE6EB] focus-visible:ring-[#1B9C90] text-sm font-medium"
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <Button variant="outline" className="rounded-full h-14 px-6 gap-2 border-[#DFE6EB] font-bold text-[#13222D] hover:bg-[#EFF4F8]">
              <Filter className="w-5 h-5" />
              Filter
            </Button>
            <Button className="rounded-full h-14 px-8 gap-2 bg-[#1B9C90] hover:opacity-90 font-bold text-white shadow-lg shadow-[#1B9C90]/20">
              <Plus className="w-5 h-5" />
              Pasien Baru
            </Button>
          </div>
        </div>

        {/* PATIENT TABLE */}
        <div className="px-4 pb-8">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="pl-6 text-[11px] font-bold text-[#67737C] uppercase tracking-widest">No. RM</TableHead>
                <TableHead className="text-[11px] font-bold text-[#67737C] uppercase tracking-widest">Nama Pasien</TableHead>
                <TableHead className="text-[11px] font-bold text-[#67737C] uppercase tracking-widest text-center">L/P (Usia)</TableHead>
                <TableHead className="text-[11px] font-bold text-[#67737C] uppercase tracking-widest">No. HP</TableHead>
                <TableHead className="text-[11px] font-bold text-[#67737C] uppercase tracking-widest text-center">Penjamin</TableHead>
                <TableHead className="text-[11px] font-bold text-[#67737C] uppercase tracking-widest text-center">Kunjungan Terakhir</TableHead>
                <TableHead className="pr-6 text-[11px] font-bold text-[#67737C] uppercase tracking-widest text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => {
                const isActive = activePatientId === patient.id
                return (
                <TableRow 
                  key={patient.id} 
                  className={cn(
                    "border-none transition-colors group cursor-pointer hover:bg-[#DFF6F2]/30",
                    isActive ? "bg-[#DFF6F2]/50 shadow-[inset_0_0_0_1px_rgba(27,156,144,0.2)] rounded-2xl" : ""
                  )}
                  onClick={() => handlePatientClick(patient)}
                >
                  {/* No RM */}
                  <TableCell className="pl-6 py-6 font-bold text-[#13222D] text-sm">
                    {patient.id}
                  </TableCell>

                  {/* Nama Pasien */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#DFF6F2] text-[#1B9C90] flex items-center justify-center text-xs font-bold border border-[#DFE6EB]">
                        {patient.initial}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#13222D] text-sm">{patient.name}</span>
                          {isActive && (
                            <span className="rounded-full bg-[#1B9C90]/10 px-2 py-0.5 text-[10px] font-bold text-[#1B9C90]">
                              Aktif
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#67737C] font-medium">{patient.id}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* L/P (Usia) */}
                  <TableCell className="text-center text-[#13222D] font-bold text-sm">
                    {patient.gender} ({patient.age})
                  </TableCell>

                  {/* No HP */}
                  <TableCell>
                    <div className="flex items-center gap-2 text-[#67737C]">
                      <Phone className="w-4 h-4 text-[#DFE6EB]" />
                      <span className="text-sm font-medium">{patient.phone}</span>
                    </div>
                  </TableCell>

                  {/* Penjamin */}
                  <TableCell className="text-center">
                    <Badge 
                      className={cn(
                        "rounded-full px-4 py-1 text-[10px] font-bold border shadow-none",
                        patient.insurance === 'BPJS' && "bg-[#DFF6F2] text-[#1B9C90] border-[#DFE6EB]",
                        patient.insurance === 'Mandiri' && "bg-[#FFF9EB] text-[#F2A618] border-[#FFE6A8]",
                        patient.insurance === 'Asuransi Astra' && "bg-[#F0FDF4] text-[#3EB268] border-[#DCFCE7]"
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          patient.insurance === 'BPJS' ? "bg-[#1B9C90]" : patient.insurance === 'Mandiri' ? "bg-[#F2A618]" : "bg-[#3EB268]"
                        )} />
                        {patient.insurance}
                      </div>
                    </Badge>
                  </TableCell>

                  {/* Kunjungan Terakhir */}
                  <TableCell className="text-center text-[#13222D] font-bold text-sm">
                    {patient.lastVisit}
                  </TableCell>

                  {/* Aksi */}
                  <TableCell className="pr-6 text-center">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#EFF4F8] text-[#67737C]">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
