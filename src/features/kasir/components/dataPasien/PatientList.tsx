import { useState } from 'react';
import { 
  Search, 
  Phone,
  ChevronLeft,
  ChevronRight
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
import { PatientFilter } from './PatientFilter';
import type { FilterState } from './PatientFilter';

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
  const [filteredPatients, setFilteredPatients] = useState(patients)

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

  const handleApplyFilter = (filters: FilterState) => {
    let result = patients
    
    // Filter by gender - convert L/P to LAKI_LAKI/PEREMPUAN for comparison
    if (filters.genders && filters.genders.length > 0) {
      result = result.filter(p => {
        const patientGender = p.gender === 'L' ? 'LAKI_LAKI' : 'PEREMPUAN'
        return filters.genders.includes(patientGender)
      })
    }
    
    // Filter by insurance
    if (filters.insurances && filters.insurances.length > 0) {
      result = result.filter(p => filters.insurances.includes(p.insurance))
    }
    
    // Filter by visits (would need date comparison in real implementation)
    // For now, we'll skip this as it requires actual date data
    
    setFilteredPatients(result)
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden w-full">
      {/* HEADER: SEARCH & ACTIONS */}
      <div className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between border-b">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
          <Input 
            placeholder="Cari Nama / No. Rekam Medis..." 
            className="pl-12 h-11 rounded-md bg-gray-50 border-gray-200 focus-visible:ring-green-600"
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <PatientFilter onFilterChange={handleApplyFilter} />
        </div>
      </div>

      {/* PATIENT TABLE */}
      <div className="overflow-x-auto w-full">
        <Table className="w-full table-fixed min-w-[850px]">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="pl-8 text-gray-700 font-semibold h-12 text-left w-[15%]">No. RM</TableHead>
              <TableHead className="text-gray-700 font-semibold h-12 text-left w-[28%]">Nama Pasien</TableHead>
              <TableHead className="text-center text-gray-700 font-semibold h-12 w-[12%]">L/P (Usia)</TableHead>
              <TableHead className="text-gray-700 font-semibold h-12 text-left w-[18%]">No. HP</TableHead>
              <TableHead className="text-center text-gray-700 font-semibold h-12 w-[15%]">Penjamin</TableHead>
              <TableHead className="pr-8 text-center text-gray-700 font-semibold h-12 w-[12%]">Kunjungan Terakhir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => {
              const isActive = activePatientId === patient.id
              return (
                <TableRow 
                  key={patient.id} 
                  className={cn(
                    "transition-colors cursor-pointer hover:bg-gray-50 border-b",
                    isActive ? "bg-green-50/50" : ""
                  )}
                  onClick={() => handlePatientClick(patient)}
                >
                  <TableCell className="pl-8 py-4 font-medium text-gray-900 text-left">
                    {patient.id}
                  </TableCell>

                  <TableCell className="py-4 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-[10px] font-bold border border-green-100 shrink-0">
                        {patient.initial}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-gray-900 truncate">{patient.name}</span>
                        <span className="text-[11px] text-gray-500">{patient.id}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-center text-gray-900 font-medium py-4">
                    {patient.gender} ({patient.age})
                  </TableCell>

                  <TableCell className="py-4 text-left">
                    <div className="flex items-center gap-2 text-gray-600</div>">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="text-sm">{patient.phone}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center py-4">
                    <Badge 
                      className={cn(
                        "rounded-full px-3 py-0.5 text-[10px] font-semibold border shadow-none inline-flex items-center justify-center",
                        patient.insurance === 'BPJS' && "bg-green-50 text-green-700 border-green-100",
                        patient.insurance === 'Mandiri' && "bg-orange-50 text-orange-700 border-orange-100",
                        patient.insurance === 'Asuransi Astra' && "bg-blue-50 text-blue-700 border-blue-100"
                      )}
                    >
                      {patient.insurance}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center text-gray-900 font-medium py-4 pr-8">
                    {patient.lastVisit}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION FOOTER */}
      <div className="p-4 flex items-center justify-between border-t border-gray-100 bg-white text-sm shrink-0">
        <p className="text-xs font-medium text-gray-500 pl-4">
          Menampilkan <span className="font-bold text-gray-900">1-5</span> dari <span className="font-bold text-gray-900">1.240</span> Pasien
        </p>
        
        <div className="flex items-center gap-1.5 pr-4">
          <Button variant="outline" size="icon" className="w-8 h-8 rounded-md border-gray-200 text-gray-400 hover:bg-gray-50" disabled>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button className="w-8 h-8 rounded-md bg-green-600 text-white font-bold text-xs border-none shadow-none hover:bg-green-700">1</Button>
          <Button variant="ghost" className="w-8 h-8 rounded-md text-gray-400 font-bold text-xs hover:bg-gray-50">2</Button>
          <Button variant="ghost" className="w-8 h-8 rounded-md text-gray-400 font-bold text-xs hover:bg-gray-50">3</Button>
          <Button variant="outline" size="icon" className="w-8 h-8 rounded-md border-gray-200 text-gray-400 hover:bg-gray-50">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};