"use client"

import { useState, useMemo } from 'react';
import { Search, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { analitikService } from '../../services/analitik.service';
import { useQuery } from '@tanstack/react-query';
import { PatientDetailModal } from './PatientDetailModal';
import { PatientFilter, type FilterState } from './PatientFilter';

export const PatientListTable = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    gender: [],
    hasBpjs: [],
  });
  const itemsPerPage = 10;

  // 1. INTEGRASI TANSTACK QUERY: Menggantikan useEffect & useState fetching manual
  const { data: rawPatients = [], isLoading, error } = useQuery({
    queryKey: ['patients'], 
    queryFn: async () => {
      const response = await analitikService.getAllPatients();
      return response.data?.data || [];
    },
    staleTime: 5 * 60 * 1000, // Cache selama 5 menit
    gcTime: 10 * 60 * 1000, // Keep cache selama 10 menit
  });

  // 2. USEMEMO UNTUK DATA TRANSFORM & FILTERING (Mencegah re-render berat)
  const filteredPatients = useMemo(() => {
    // Jalankan transformasi data dasar
    const transformed = rawPatients.map(patient => {
      const safeName = patient.namaLengkap || "Pasien Tanpa Nama";
      const initialLetter = safeName.split(' ')[0]?.charAt(0).toUpperCase() || 'P';

      return {
        ...patient,
        namaLengkap: safeName,
        initial: initialLetter,
        phone: patient.telepon || '-',
      };
    });

    let result = transformed;

    // Jalankan filter berdasarkan keyword pencarian
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(patient => 
        patient.namaLengkap.toLowerCase().includes(query) || 
        patient.noRm.toLowerCase().includes(query)
      );
    }

    // Filter Status (Aktif/Tidak Aktif)
    if (filters.status.length > 0) {
      result = result.filter(patient => {
        const status = patient.isActive ? 'AKTIF' : 'TIDAK AKTIF';
        return filters.status.includes(status);
      });
    }

    // Filter Gender (Laki-laki/Perempuan)
    if (filters.gender.length > 0) {
      result = result.filter(patient => {
        const gender = patient.jenisKelamin === 'LAKI_LAKI' ? 'LAKI_LAKI' : 'PEREMPUAN';
        return filters.gender.includes(gender);
      });
    }

    // Filter BPJS (Ada/Tidak Ada)
    if (filters.hasBpjs.length > 0) {
      result = result.filter(patient => {
        const hasBpjs = patient.noBpjs && patient.noBpjs !== 'null' ? 'ADA' : 'TIDAK_ADA';
        return filters.hasBpjs.includes(hasBpjs);
      });
    }

    return result;
  }, [rawPatients, search, filters]);

  // RESET PAGE KE 1 JIKA USER MENGETIK PENCARIAN BARU
  useMemo(() => {
    setCurrentPage(1);
  }, [search]);

  // 3. PAGINATION LOGIC
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleViewPatient = (patient: any) => {
    setSelectedPatient(patient);
    setIsDetailModalOpen(true);
  };

  const handleFilterChange = (type: keyof FilterState, value: string) => {
    setFilters(prev => {
      const current = prev[type];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setFilters({ status: [], gender: [], hasBpjs: [] });
    setCurrentPage(1);
  };

  // 4. SCREEN HANDLING: ERROR STATE
  if (error) {
    return (
      <div className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full">
        <div className="p-8 text-center text-red-600 font-semibold">
          Gagal Memuat Data Pasien: {(error as Error).message}
        </div>
      </div>
    );
  }

  // 5. SCREEN HANDLING: LOADING ANIMATION SKELETON
  if (isLoading) {
    return (
      <div className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full">
        <div className="p-8 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-slate-50 border border-slate-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full">
      {/* SEARCH & FILTER BAR */}
      <div className="p-6 flex flex-col gap-4 border-b border-[#DFE6EB]">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#67737C] group-focus-within:text-[#1B9C90] transition-colors" />
            <Input 
              placeholder="Cari nama pasien atau nomor RM..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-11 rounded-xl bg-[#F4F7F9] border-none focus-visible:ring-1 focus-visible:ring-[#1B9C90] text-sm font-medium text-[#13222D]"
            />
          </div>
          
          <PatientFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={clearAllFilters}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#EFF4F8] hover:bg-[#EFF4F8] border-none">
              <TableHead className="pl-8 text-[#67737C] font-bold h-12 text-left text-xs uppercase tracking-wider">Nama Pasien</TableHead>
              <TableHead className="text-[#67737C] font-bold h-12 text-left text-xs uppercase tracking-wider">No RM</TableHead>
              <TableHead className="text-[#67737C] font-bold h-12 text-left text-xs uppercase tracking-wider">Telepon</TableHead>
              <TableHead className="text-center text-[#67737C] font-bold h-12 text-xs uppercase tracking-wider">Status</TableHead>
              <TableHead className="pr-8 text-center text-[#67737C] font-bold h-12 text-xs uppercase tracking-wider">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-xs font-bold text-[#67737C]">
                  Tidak ada data pasien ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              currentPatients.map((patient) => (
                <TableRow 
                  key={patient.id} 
                  className="border-b border-[#DFE6EB] last:border-none transition-colors hover:bg-[#F9FEFC]"
                >
                  <TableCell className="pl-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#DFF6F2] text-[#00736A] flex items-center justify-center font-bold text-sm border border-[#DFE6EB]">
                        {patient.initial}
                      </div>
                      <span className="font-bold text-[#13222D] text-sm">
                        {patient.namaLengkap}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-[#13222D] font-medium text-sm py-4 text-left">
                    {patient.noRm}
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
                        patient.isActive
                          ? "bg-[#DFF6F2] text-[#1B9C90] hover:bg-[#DFF6F2]" 
                          : "bg-[#EFF4F8] text-[#67737C] hover:bg-[#EFF4F8]"
                      )}
                    >
                      {patient.isActive ? 'AKTIF' : 'TIDAK AKTIF'}
                    </Badge>
                  </TableCell>

                  <TableCell className="pr-8 text-center py-4">
                    <Button 
                      onClick={() => handleViewPatient(patient)}
                      className="h-8 rounded-xl px-5 text-xs font-bold bg-[#1B9C90] hover:bg-[#157A71] text-white border-none transition-colors"
                    >
                      Lihat
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="px-6 py-4 border-t border-[#DFE6EB] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F9FEFC]/30">
        <span className="text-xs font-medium text-[#67737C]">
          Menampilkan <span className="text-[#13222D] font-bold">{filteredPatients.length === 0 ? 0 : startIndex + 1} - {Math.min(endIndex, filteredPatients.length)}</span> dari <span className="text-[#13222D] font-bold">{filteredPatients.length}</span> data entri
        </span>
        
        <div className="flex items-center gap-1.5">
          <Button 
            variant="outline" 
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
            className="h-8 w-8 p-0 rounded-lg border-[#DFE6EB] text-[#67737C] disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => {
            const pageNum = i + 1;
            return (
              <Button 
                key={pageNum}
                variant="outline" 
                onClick={() => setCurrentPage(pageNum)}
                className={cn(
                  "h-8 px-3 rounded-lg text-xs font-bold border-none shadow-none transition-colors",
                  currentPage === pageNum
                    ? "bg-[#13272F]/5 text-[#1B9C90]"
                    : "text-[#67737C] hover:bg-[#F4F7F9]"
                )}
              >
                {pageNum}
              </Button>
            );
          })}
          <Button 
            variant="outline" 
            disabled={currentPage === totalPages || filteredPatients.length === 0}
            onClick={handleNextPage}
            className="h-8 w-8 p-0 rounded-lg border-[#DFE6EB] text-[#67737C] disabled:opacity-40 hover:bg-[#F4F7F9]"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* PATIENT DETAIL MODAL */}
      <PatientDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
        patientId={selectedPatient?.id}
      />
    </div>
  );
};