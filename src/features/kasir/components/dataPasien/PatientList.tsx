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
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
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
          <Button variant="outline" className="h-11 px-4 gap-2 border-gray-200 font-semibold text-gray-700">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button className="h-11 px-6 gap-2 bg-green-600 hover:bg-green-700 font-semibold text-white">
            <Plus className="w-4 h-4" />
            Pasien Baru
          </Button>
        </div>
      </div>

      {/* PATIENT TABLE */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="pl-8 text-gray-700 font-semibold h-12">No. RM</TableHead>
            <TableHead className="text-gray-700 font-semibold h-12">Nama Pasien</TableHead>
            <TableHead className="text-center text-gray-700 font-semibold h-12">L/P (Usia)</TableHead>
            <TableHead className="text-gray-700 font-semibold h-12">No. HP</TableHead>
            <TableHead className="text-center text-gray-700 font-semibold h-12">Penjamin</TableHead>
            <TableHead className="text-center text-gray-700 font-semibold h-12">Kunjungan Terakhir</TableHead>
            <TableHead className="pr-8 text-center text-gray-700 font-semibold h-12">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => {
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
                {/* No RM */}
                <TableCell className="pl-8 py-4 font-medium text-gray-900">
                  {patient.id}
                </TableCell>

                {/* Nama Pasien */}
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-[10px] font-bold border border-green-100">
                      {patient.initial}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{patient.name}</span>
                      <span className="text-[11px] text-gray-500">{patient.id}</span>
                    </div>
                  </div>
                </TableCell>

                {/* L/P (Usia) */}
                <TableCell className="text-center text-gray-900 font-medium py-4">
                  {patient.gender} ({patient.age})
                </TableCell>

                {/* No HP */}
                <TableCell className="py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm">{patient.phone}</span>
                  </div>
                </TableCell>

                {/* Penjamin */}
                <TableCell className="text-center py-4">
                  <Badge 
                    className={cn(
                      "rounded-full px-3 py-0.5 text-[10px] font-semibold border shadow-none",
                      patient.insurance === 'BPJS' && "bg-green-50 text-green-700 border-green-100",
                      patient.insurance === 'Mandiri' && "bg-orange-50 text-orange-700 border-orange-100",
                      patient.insurance === 'Asuransi Astra' && "bg-blue-50 text-blue-700 border-blue-100"
                    )}
                  >
                    {patient.insurance}
                  </Badge>
                </TableCell>

                {/* Kunjungan Terakhir */}
                <TableCell className="text-center text-gray-900 font-medium py-4">
                  {patient.lastVisit}
                </TableCell>

                {/* Aksi */}
                <TableCell className="pr-8 text-center py-4">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-200 text-gray-500">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
};