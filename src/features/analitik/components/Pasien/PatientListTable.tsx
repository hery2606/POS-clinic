import { useState } from 'react';
import { Search, Filter, Phone,ChevronLeft, ChevronRight } from 'lucide-react';
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

interface Patient {
  id: string;
  name: string;
  phone: string;
  status: 'AKTIF' | 'TIDAK AKTIF';
  initial: string;
}

const patientsData: Patient[] = [
  { id: 'RM-00124', name: 'Budi Santoso', phone: '0812-3456-7890', status: 'AKTIF', initial: 'B' },
  { id: 'RM-00125', name: 'Doni Pratama', phone: '0812-9876-5432', status: 'TIDAK AKTIF', initial: 'D' },
  { id: 'RM-00431', name: 'Siti Aminah', phone: '0813-1122-3344', status: 'AKTIF', initial: 'S' },
  { id: 'RM-00562', name: 'Maya Sari', phone: '0856-4455-6677', status: 'AKTIF', initial: 'M' },
  { id: 'RM-00891', name: 'Andi Wijaya', phone: '0811-9988-7766', status: 'AKTIF', initial: 'A' },
];

export const PatientListTable = () => {
  const [search, setSearch] = useState('');

  const filteredPatients = patientsData.filter(patient => 
    patient.name.toLowerCase().includes(search.toLowerCase()) || 
    patient.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full">
      <div className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-[#DFE6EB]">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#67737C] group-focus-within:text-[#1B9C90] transition-colors" />
          <Input 
            placeholder="Cari nama pasien atau nomor RM..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-11 rounded-md bg-[#F9FEFC] border-[#DFE6EB] focus-visible:ring-[#1B9C90] text-sm font-medium text-[#13222D]"
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="h-11 px-4 gap-2 border-[#DFE6EB] font-bold text-[#13222D] hover:bg-[#EFF4F8] rounded-md">
            <Filter className="w-4 h-4 text-[#67737C]" />
            Filter
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#EFF4F8] hover:bg-[#EFF4F8] border-none">
              <TableHead className="pl-8 text-[#67737C] font-bold h-12 text-left">Nama Pasien</TableHead>
              <TableHead className="text-[#67737C] font-bold h-12 text-left">No RM</TableHead>
              <TableHead className="text-[#67737C] font-bold h-12 text-left">Telepon</TableHead>
              <TableHead className="text-center text-[#67737C] font-bold h-12">Status</TableHead>
              <TableHead className="pr-8 text-center text-[#67737C] font-bold h-12">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient, index) => (
              <TableRow 
                key={index} 
                className="border-b border-[#DFE6EB] last:border-none transition-colors hover:bg-[#F9FEFC]"
              >
                <TableCell className="pl-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#DFF6F2] text-[#00736A] flex items-center justify-center font-bold text-sm border border-[#DFE6EB]">
                      {patient.initial}
                    </div>
                    <span className="font-bold text-[#13222D] text-sm">
                      {patient.name}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-[#13222D] font-medium text-sm py-4 text-left">
                  {patient.id}
                </TableCell>

                <TableCell className="text-[#67737C] font-medium text-sm py-4 text-left">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#67737C]" />
                    <span>{patient.phone}</span>
                  </div>
                </TableCell>

                <TableCell className="text-center py-4">
                  <Badge 
                    className={cn(
                      "rounded-full px-3 py-0.5 text-[10px] font-bold border-none shadow-none uppercase tracking-wider",
                      patient.status === 'AKTIF' 
                        ? "bg-[#DFF6F2] text-[#1B9C90] hover:bg-[#DFF6F2]" 
                        : "bg-[#EFF4F8] text-[#67737C] hover:bg-[#EFF4F8]"
                    )}
                  >
                    {patient.status}
                  </Badge>
                </TableCell>

                <TableCell className="pr-8 text-center py-4">
                  <Button 
                    className="h-8 rounded-full px-5 text-xs font-bold bg-[#1B9C90] hover:opacity-90 text-white border-none transition-colors"
                  >
                    Lihat
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* FOOTER PAGINATION BLOCK */}
      <div className="px-6 py-4 border-t border-[#DFE6EB] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F9FEFC]/30">
        <span className="text-xs font-medium text-[#67737C]">
          Menampilkan <span className="text-[#13222D] font-bold">1 - 5</span> dari <span className="text-[#13222D] font-bold">48</span> data entri
        </span>
        
        <div className="flex items-center gap-1.5">
          <Button 
            variant="outline" 
            disabled 
            className="h-8 w-8 p-0 rounded-lg border-[#DFE6EB] text-[#67737C] disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            className="h-8 px-3 rounded-lg text-xs font-bold bg-[#13272F]/5 border-none text-[#1B9C90] shadow-none"
          >
            1
          </Button>
          <Button 
            variant="outline" 
            className="h-8 px-3 rounded-lg text-xs font-bold border-none text-[#67737C] hover:bg-[#F4F7F9] shadow-none"
          >
            2
          </Button>
          <Button 
            variant="outline" 
            className="h-8 px-3 rounded-lg text-xs font-bold border-none text-[#67737C] hover:bg-[#F4F7F9] shadow-none"
          >
            3
          </Button>
          <Button 
            variant="outline" 
            className="h-8 w-8 p-0 rounded-lg border-[#DFE6EB] text-[#67737C] hover:bg-[#F4F7F9]"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};