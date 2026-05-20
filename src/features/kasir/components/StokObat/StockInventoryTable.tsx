"use client"

import { useState, useMemo } from 'react';
import { 
  Search, 
  Pill, 
  AlertCircle,
  XCircle,
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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useRightPanel } from "../../context/right-panel-context";
import { InventoryFilter } from "./InventoryFilter";
import type { FilterState } from "./InventoryFilter";
// IMPORT WAREHOUSE SERVICE & REACT QUERY
import { useQuery } from '@tanstack/react-query';
import { warehouseService } from '../../services/warehouse.service';

export const StockInventoryTable = () => {
  const { setContent } = useRightPanel();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    statuses: [],
    types: [],
  });

  // FETCH DATA DARI WAREHOUSE SERVICE DENGAN REACT QUERY
  const { data: medicinesResponse, isLoading, error } = useQuery({
    queryKey: ['warehouseMedicines'],
    queryFn: () => warehouseService.getMedicinesList(),
    staleTime: 5 * 60 * 1000, // 5 menit
    gcTime: 10 * 60 * 1000,   // 10 menit
  });

  // Extract data array dari response
  const stockData = useMemo(() => {
    if (!medicinesResponse?.data) return [];
    return Array.isArray(medicinesResponse.data) ? medicinesResponse.data : [];
  }, [medicinesResponse]);

  const handleRowClick = (item: any) => {
    setContent('stock-detail', { stock: item });
  };

  // Handler saat dropdown filter diubah
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset halaman ke 1 saat filter berubah
  };

  // Helper function untuk menghitung status stok
  const getStockStatus = (stokSaatIni: number, stokMinimum: number): 'Tersedia' | 'Stok Menipis' | 'Stok Kritis' => {
    if (stokSaatIni === 0) return 'Stok Kritis';
    if (stokSaatIni < stokMinimum) return 'Stok Menipis';
    return 'Tersedia';
  };

  const getStatusColor = (status: 'Tersedia' | 'Stok Menipis' | 'Stok Kritis') => {
    switch (status) {
      case 'Stok Kritis':
        return { bg: 'bg-[#FEF2F2]', text: 'text-[#E62C2C]', icon: XCircle };
      case 'Stok Menipis':
        return { bg: 'bg-[#FFF9EB]', text: 'text-[#F2A618]', icon: AlertCircle };
      case 'Tersedia':
        return { bg: 'bg-[#DFF6F2]', text: 'text-[#3EB268]', icon: null };
    }
  };

  // Handler saat kolom pencarian diubah
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset halaman ke 1 saat mengetik pencarian baru
  };

  // OPTIMASI KINERJA: Proses searching & filtering di dalam useMemo
  const filteredData = useMemo(() => {
    let result = [...stockData];

    // Jalankan filter pencarian teks (ID atau Nama Obat)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.nama?.toLowerCase().includes(query) ||
        item.id?.toLowerCase().includes(query) ||
        item.kode?.toLowerCase().includes(query)
      );
    }

    // Jalankan filter Kategori Obat
    if (filters.categories && filters.categories.length > 0) {
      result = result.filter(item => filters.categories.includes(item.kategori));
    }

    // Jalankan filter Status Stok (Tersedia/Stok Menipis/Stok Kritis)
    if (filters.statuses && filters.statuses.length > 0) {
      result = result.filter(item => {
        const status = getStockStatus(item.stokSaatIni, item.stokMinimum);
        return filters.statuses.includes(status);
      });
    }

    // Jalankan filter Bentuk Sediaan / Tipe (dari lokasiGudang)
    if (filters.types && filters.types.length > 0) {
      result = result.filter(item => 
        item.lokasiGudang && filters.types.includes(item.lokasiGudang.tipe)
      );
    }

    return result;
  }, [stockData, searchQuery, filters]);

  // PAGINATION LOGIC
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  // HANDLING LOADING & ERROR SCREENS
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-[#DFE6EB] shadow-sm overflow-hidden w-full">
        {/* TOP BAR SKELETON */}
        <div className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between border-b">
          <Skeleton className="w-full md:max-w-md h-11 rounded-md bg-[#EFF4F8]" />
          <Skeleton className="w-32 h-11 rounded-md bg-[#EFF4F8]" />
        </div>

        {/* TABLE SKELETON */}
        <div className="overflow-x-auto w-full">
          <Table className="w-full table-fixed min-w-[800px]">
            <TableHeader>
              <TableRow className="bg-[#EFF4F8] hover:bg-[#EFF4F8] border-none">
                <TableHead className="pl-8 h-12 w-[12%]">
                  <Skeleton className="h-3 w-8 rounded-md bg-[#DFE6EB]" />
                </TableHead>
                <TableHead className="h-12 w-[28%]">
                  <Skeleton className="h-3 w-16 rounded-md bg-[#DFE6EB]" />
                </TableHead>
                <TableHead className="h-12 w-[10%]">
                  <Skeleton className="h-3 w-10 rounded-md bg-[#DFE6EB]" />
                </TableHead>
                <TableHead className="h-12 w-[12%]">
                  <Skeleton className="h-3 w-12 rounded-md bg-[#DFE6EB]" />
                </TableHead>
                <TableHead className="h-12 w-[10%]">
                  <Skeleton className="h-3 w-10 rounded-md bg-[#DFE6EB] mx-auto" />
                </TableHead>
                <TableHead className="h-12 w-[10%]">
                  <Skeleton className="h-3 w-10 rounded-md bg-[#DFE6EB] mx-auto" />
                </TableHead>
                <TableHead className="h-12 w-[13%]">
                  <Skeleton className="h-3 w-12 rounded-md bg-[#DFE6EB] ml-auto" />
                </TableHead>
                <TableHead className="pr-8 h-12 w-[15%]">
                  <Skeleton className="h-3 w-12 rounded-md bg-[#DFE6EB] mx-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(10)].map((_, i) => (
                <TableRow key={i} className="border-b border-[#DFE6EB]">
                  <TableCell className="pl-8 py-4">
                    <Skeleton className="h-3 w-12 rounded-md bg-[#EFF4F8]" />
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full bg-[#EFF4F8]" />
                      <Skeleton className="h-3 w-32 rounded-md bg-[#EFF4F8]" />
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-3 w-8 rounded-md bg-[#EFF4F8]" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-3 w-16 rounded-full bg-[#EFF4F8]" />
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <Skeleton className="h-3 w-8 rounded-md bg-[#EFF4F8] mx-auto" />
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <Skeleton className="h-3 w-8 rounded-md bg-[#EFF4F8] mx-auto" />
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <Skeleton className="h-3 w-20 rounded-md bg-[#EFF4F8] ml-auto" />
                  </TableCell>
                  <TableCell className="pr-8 py-4 text-center">
                    <Skeleton className="h-3 w-16 rounded-md bg-[#EFF4F8] mx-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-8 text-center text-red-600 font-semibold">
        Gagal terhubung ke layanan Warehouse: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-[#DFE6EB] shadow-sm overflow-hidden w-full">
      
      {/* TOP BAR: SEARCH & ACTIONS */}
      <div className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between border-b">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#67737C] group-focus-within:text-[#1B9C90] transition-colors" />
          <Input 
            placeholder="Cari Nama Obat atau Kode ID..." 
            className="pl-12 h-11 rounded-md bg-[#F9FEFC] border-[#DFE6EB] focus-visible:ring-[#1B9C90] text-sm font-medium text-[#13222D]"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <InventoryFilter onFilterChange={handleFilterChange} />
        </div>
      </div>

      {/* INVENTORY TABLE */}
      <div className="overflow-x-auto w-full">
        <Table className="w-full table-fixed min-w-[800px]">
          <TableHeader>
            <TableRow className="bg-[#EFF4F8] hover:bg-[#EFF4F8] border-none">
              <TableHead className="pl-8 text-[#13222D] font-bold h-12 text-left w-[12%]">ID</TableHead>
              <TableHead className="text-[#13222D] font-bold h-12 text-left w-[28%]">Nama</TableHead>
              <TableHead className="text-[#13222D] font-bold h-12 text-left w-[10%]">Tipe</TableHead>
              <TableHead className="text-[#13222D] font-bold h-12 text-left w-[12%]">Kategori</TableHead>
              <TableHead className="text-center text-[#13222D] font-bold h-12 w-[10%]">Stok</TableHead>
              <TableHead className="text-center text-[#13222D] font-bold h-12 w-[10%]">Satuan</TableHead>
              <TableHead className="text-right text-[#13222D] font-bold h-12 w-[13%]">Harga</TableHead>
              <TableHead className="pr-8 text-center text-[#13222D] font-bold h-12 w-[15%]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-xs font-bold text-[#67737C]">
                  Tidak ada data inventaris obat yang cocok dengan filter.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((item) => (
                <TableRow 
                  key={item.id} 
                  className="border-b border-[#DFE6EB] transition-colors group hover:bg-[#F9FEFC] cursor-pointer"
                  onClick={() => handleRowClick(item)}
                >
                  <TableCell className="pl-8 py-4 font-bold text-[#13222D] text-sm text-left">
                    {item.kode}
                  </TableCell>

                  <TableCell className="py-4 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#DFF6F2] text-[#1B9C90] flex items-center justify-center border border-[#DFE6EB] shrink-0">
                        <Pill className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-[#13222D] text-sm truncate">{item.nama}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-[#67737C] font-medium text-sm py-4 text-left">
                    {item.lokasiGudang?.tipe || '-'}
                  </TableCell>

                  <TableCell className="py-4 text-left">
                    <Badge variant="secondary" className="bg-[#EFF4F8] text-[#67737C] border-none font-bold rounded-full px-3 py-0.5 shadow-none text-[10px]">
                      {item.kategori}
                    </Badge>
                  </TableCell>

                  <TableCell className={cn(
                    "text-center font-bold text-sm py-4",
                    (() => {
                      const status = getStockStatus(item.stokSaatIni, item.stokMinimum);
                      return status === 'Stok Kritis' ? 'text-[#E62C2C]' : status === 'Stok Menipis' ? 'text-[#F2A618]' : 'text-[#13222D]';
                    })()
                  )}>
                    {item.stokSaatIni}
                  </TableCell>

                  <TableCell className="text-center text-[#67737C] font-medium text-sm py-4">
                    {item.satuan}
                  </TableCell>

                  <TableCell className="text-right font-bold text-[#13222D] text-sm py-4">
                    Rp {Number(item.hargaJual || 0).toLocaleString('id-ID')}
                  </TableCell>

                  <TableCell className="text-center py-4 pr-8">
                    {(() => {
                      const status = getStockStatus(item.stokSaatIni, item.stokMinimum);
                      const colors = getStatusColor(status);
                      const Icon = colors.icon;
                      return (
                        <Badge 
                          className={cn(
                            "rounded-full px-3 py-0.5 text-[10px] font-bold border-none shadow-none inline-flex items-center justify-center",
                            colors.bg,
                            colors.text
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            {Icon && <Icon className="w-3 h-3" />}
                            {status}
                          </div>
                        </Badge>
                      );
                    })()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION FOOTER DENGAN STATE DINAMIS */}
      <div className="p-4 flex items-center justify-between border-t border-[#DFE6EB] bg-white text-sm shrink-0">
        <p className="text-xs font-medium text-[#67737C] pl-4">
          Menampilkan <span className="font-bold text-[#13222D]">{filteredData.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredData.length)}</span> dari <span className="font-bold text-[#13222D]">{filteredData.length}</span> Obat
        </p>
        
        <div className="flex items-center gap-1.5 pr-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-8 h-8 rounded-md border-[#DFE6EB] text-[#67737C] hover:bg-[#EFF4F8]"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => (
            <Button 
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              variant={currentPage === i + 1 ? "default" : "ghost"}
              className={cn(
                "w-8 h-8 rounded-md font-bold text-xs shadow-none border-none",
                currentPage === i + 1 ? "bg-[#1B9C90] text-white hover:bg-[#1B9C90]" : "text-[#67737C] hover:bg-[#EFF4F8]"
              )}
            >
              {i + 1}
            </Button>
          ))}
          
          <Button 
            variant="outline" 
            size="icon" 
            className="w-8 h-8 rounded-md border-[#DFE6EB] text-[#67737C] hover:bg-[#EFF4F8]"
            disabled={currentPage === totalPages || filteredData.length === 0}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

    </div>
  );
};