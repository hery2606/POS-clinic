"use client";

import { useMemo, useState } from 'react';
import { Search, Phone, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { analitikService } from '../../services/analitik.service';
import { useQuery } from '@tanstack/react-query';
import { PatientDetailModal } from './PatientDetailModal';
import { PatientFilter, type FilterState } from './PatientFilter';
import { type PatientData } from '../../types/patient.types';

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

  // 🟢 PERBAIKAN 1: Masukkan state page, search, dan filter ke queryKey agar otomatis re-fetch saat berubah
  const { data: apiResponse, isLoading, error, isFetching } = useQuery({
    queryKey: ['patients', currentPage, search, filters], 
    queryFn: async () => {
      // Menyiapkan query params terstruktur untuk dikirim ke backend Railway kamu
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: search.trim() || undefined,
        // Kirim nilai join string jika array filter memiliki isi pilihan
        status: filters.status.length > 0 ? filters.status.join(',') : undefined,
        gender: filters.gender.length > 0 ? filters.gender.join(',') : undefined,
        hasBpjs: filters.hasBpjs.length > 0 ? filters.hasBpjs.join(',') : undefined,
      };

      const response = await analitikService.getAllPatients(params);
      return response.data; // Mengambil full data payload beserta metadata pagination dari server
    },
    staleTime: 30 * 1000, // Durasi cache pendek untuk analitik real-time
  });

  // 🟢 PERBAIKAN 2: Data & Metadata langsung diambil dari response server paginated
  // Fallback ke array kosong jika data awal belum termuat
  const patientsData = apiResponse?.data || []; 
  
  // Ekstraksi info pagination dari backend (sesuaikan dengan key objek meta dari backend kamu)
  const totalPages = apiResponse?.meta?.totalPages || 1;
  const totalItems = apiResponse?.meta?.total || patientsData.length;
  
  // Transformasi ringan visual (Initial & Phone formatting) per 10 item aktif saja
  const currentPatients = useMemo(() => {
    return patientsData.map((patient: PatientData) => {
      const safeName = patient.namaLengkap || "Pasien Tanpa Nama";
      return {
        ...patient,
        namaLengkap: safeName,
        initial: safeName.split(' ')[0]?.charAt(0).toUpperCase() || 'P',
        phone: patient.telepon || '-',
      };
    });
  }, [patientsData]);

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
    setCurrentPage(1); // Balik ke halaman pertama jika filter diganti
  };

  const clearAllFilters = () => {
    setFilters({ status: [], gender: [], hasBpjs: [] });
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full">
        <div className="p-8 text-center text-red-600 font-semibold">
          Gagal Memuat Data Pasien: {(error as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full relative">
      {/* SEARCH & FILTER BAR */}
      <div className="p-6 flex flex-col gap-4 border-b border-[#DFE6EB]">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#67737C] group-focus-within:text-[#1B9C90] transition-colors" />
            <Input 
              placeholder="Cari nama pasien atau nomor RM..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // Reset ke halaman 1 saat mengetik kata kunci baru
              }}
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

      <div className="overflow-x-auto min-h-[200px] relative">
        {/* Loading overlay halus untuk menandakan re-fetching background saat pindah halaman/filter */}
        {isFetching && !isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all">
            <Loader2 className="w-8 h-8 text-[#1B9C90] animate-spin" />
          </div>
        )}

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
            {isLoading ? (
              // 🟢 PERBAIKAN: Skeleton Loading agar seragam dengan komponen lain
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={`skeleton-${idx}`} className="border-b border-[#DFE6EB] transition-colors">
                  <TableCell className="pl-8 py-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-left">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="py-4 text-left">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#67737C] opacity-30" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <Skeleton className="h-5 w-16 mx-auto rounded-full" />
                  </TableCell>
                  <TableCell className="pr-8 text-center py-4">
                    <Skeleton className="h-8 w-16 mx-auto rounded-xl" />
                  </TableCell>
                </TableRow>
              ))
            ) : currentPatients.length === 0 ? (
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
                      className="h-8 rounded-xl px-5 text-xs font-bold bg-[#1B9C90] hover:bg-[#157A71] text-white border-none transition-colors outline-none shadow-none cursor-pointer"
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

      {/* FOOTER PAGINATION CONTROL */}
      <div className="px-6 py-4 border-t border-[#DFE6EB] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F9FEFC]/30">
        <span className="text-xs font-medium text-[#67737C]">
          Menampilkan <span className="text-[#13222D] font-bold">
            {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, totalItems)}
          </span> dari <span className="text-[#13222D] font-bold">{totalItems}</span> data entri
        </span>
        
        <div className="flex items-center gap-1.5">
          <Button 
            variant="outline" 
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
            className="h-8 w-8 p-0 rounded-lg border-[#DFE6EB] text-[#67737C] disabled:opacity-40 shadow-none hover:bg-slate-50 cursor-pointer"
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
                  "h-8 px-3 rounded-lg text-xs font-bold border-none shadow-none transition-colors cursor-pointer",
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
            disabled={currentPage === totalPages || currentPatients.length === 0}
            onClick={handleNextPage}
            className="h-8 w-8 p-0 rounded-lg border-[#DFE6EB] text-[#67737C] disabled:opacity-40 hover:bg-[#F4F7F9] shadow-none cursor-pointer"
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