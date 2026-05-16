import { useState } from 'react';
import { 
  Search, 
  Pill, 
  AlertCircle,
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
import { useRightPanel } from "../../context/right-panel-context";
import { InventoryFilter } from "./InventoryFilter";
import type { FilterState } from "./InventoryFilter";

const stockData = [
  { id: 'MD-001', name: 'Amoxicillin 500mg', type: 'Tablet', category: 'Antibiotik', stock: 120, unit: 'Strip', price: 25000, status: 'Tersedia' },
  { id: 'MD-002', name: 'Paracetamol Syrup', type: 'Sirup', category: 'Analgetik', stock: 15, unit: 'Botol', price: 15000, status: 'Stok Menipis' },
  { id: 'MD-003', name: 'Betadine Solution', type: 'Cair', category: 'Antiseptik', stock: 45, unit: 'Botol', price: 32000, status: 'Tersedia' },
  { id: 'MD-004', name: 'Vitamin C 1000mg', type: 'Tablet', category: 'Suplemen', stock: 200, unit: 'Box', price: 85000, status: 'Tersedia' },
  { id: 'MD-005', name: 'Amlodipine 5mg', type: 'Tablet', category: 'Hipertensi', stock: 8, unit: 'Strip', price: 12000, status: 'Stok Menipis' },
];

export const StockInventoryTable = () => {
  const { setContent } = useRightPanel();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    statuses: [],
    types: [],
  });
  const [filteredData, setFilteredData] = useState(stockData);

  const handleRowClick = (item: typeof stockData[0]) => {
    setContent('stock-detail', { stock: item });
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // Reapply filters with updated filter state
    let result = stockData;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
      );
    }

    if (newFilters.categories && newFilters.categories.length > 0) {
      result = result.filter(item => newFilters.categories.includes(item.category));
    }

    if (newFilters.statuses && newFilters.statuses.length > 0) {
      result = result.filter(item => newFilters.statuses.includes(item.status));
    }

    if (newFilters.types && newFilters.types.length > 0) {
      result = result.filter(item => newFilters.types.includes(item.type));
    }

    setFilteredData(result);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    let result = stockData;

    if (value.trim()) {
      const query = value.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
      );
    }

    if (filters.categories && filters.categories.length > 0) {
      result = result.filter(item => filters.categories.includes(item.category));
    }

    if (filters.statuses && filters.statuses.length > 0) {
      result = result.filter(item => filters.statuses.includes(item.status));
    }

    if (filters.types && filters.types.length > 0) {
      result = result.filter(item => filters.types.includes(item.type));
    }

    setFilteredData(result);
  };

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
            {filteredData.map((item) => (
              <TableRow 
                key={item.id} 
                className="border-b border-[#DFE6EB] transition-colors group hover:bg-[#F9FEFC] cursor-pointer"
                onClick={() => handleRowClick(item)}
              >
                <TableCell className="pl-8 py-4 font-bold text-[#13222D] text-sm text-left">
                  {item.id}
                </TableCell>

                <TableCell className="py-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#DFF6F2] text-[#1B9C90] flex items-center justify-center border border-[#DFE6EB] shrink-0">
                      <Pill className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-[#13222D] text-sm truncate">{item.name}</span>
                  </div>
                </TableCell>

                <TableCell className="text-[#67737C] font-medium text-sm py-4 text-left">
                  {item.type}
                </TableCell>

                <TableCell className="py-4 text-left">
                  <Badge variant="secondary" className="bg-[#EFF4F8] text-[#67737C] border-none font-bold rounded-full px-3 py-0.5 shadow-none text-[10px]">
                    {item.category}
                  </Badge>
                </TableCell>

                <TableCell className={cn(
                  "text-center font-bold text-sm py-4",
                  item.stock < 20 ? "text-[#F2A618]" : "text-[#13222D]"
                )}>
                  {item.stock}
                </TableCell>

                <TableCell className="text-center text-[#67737C] font-medium text-sm py-4">
                  {item.unit}
                </TableCell>

                <TableCell className="text-right font-bold text-[#13222D] text-sm py-4">
                  Rp {item.price.toLocaleString('id-ID')}
                </TableCell>

                <TableCell className="text-center py-4 pr-8">
                  <Badge 
                    className={cn(
                      "rounded-full px-3 py-0.5 text-[10px] font-bold border-none shadow-none inline-flex items-center justify-center",
                      item.status === 'Tersedia' 
                        ? "bg-[#DFF6F2] text-[#3EB268]" 
                        : "bg-[#FFF9EB] text-[#F2A618]"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      {item.status === 'Stok Menipis' && <AlertCircle className="w-3 h-3" />}
                      {item.status}
                    </div>
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION FOOTER */}
      <div className="p-4 flex items-center justify-between border-t border-[#DFE6EB] bg-white text-sm shrink-0">
        <p className="text-xs font-medium text-[#67737C] pl-4">
          Menampilkan <span className="font-bold text-[#13222D]">1-{Math.min(5, filteredData.length)}</span> dari <span className="font-bold text-[#13222D]">{filteredData.length}</span> Obat
        </p>
        
        <div className="flex items-center gap-1.5 pr-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-8 h-8 rounded-md border-[#DFE6EB] text-[#67737C] hover:bg-[#EFF4F8]"
            disabled
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button 
            className="w-8 h-8 rounded-md bg-[#1B9C90] text-white font-bold text-xs border-none shadow-none"
          >
            1
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-8 h-8 rounded-md text-[#67737C] font-bold text-xs hover:bg-[#EFF4F8]"
          >
            2
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-8 h-8 rounded-md text-[#67737C] font-bold text-xs hover:bg-[#EFF4F8]"
          >
            3
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="w-8 h-8 rounded-md border-[#DFE6EB] text-[#67737C] hover:bg-[#EFF4F8]"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

    </div>
  );
};