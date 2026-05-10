import { 
  Search, 
  Filter, 
  Plus, 
  Pill, 
  AlertCircle,
  Edit,
  Trash2
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

const stockData = [
  { id: 'MD-001', name: 'Amoxicillin 500mg', type: 'Tablet', category: 'Antibiotik', stock: 120, unit: 'Strip', price: 25000, status: 'Tersedia' },
  { id: 'MD-002', name: 'Paracetamol Syrup', type: 'Sirup', category: 'Analgetik', stock: 15, unit: 'Botol', price: 15000, status: 'Stok Menipis' },
  { id: 'MD-003', name: 'Betadine Solution', type: 'Cair', category: 'Antiseptik', stock: 45, unit: 'Botol', price: 32000, status: 'Tersedia' },
  { id: 'MD-004', name: 'Vitamin C 1000mg', type: 'Tablet', category: 'Suplemen', stock: 200, unit: 'Box', price: 85000, status: 'Tersedia' },
  { id: 'MD-005', name: 'Amlodipine 5mg', type: 'Tablet', category: 'Hipertensi', stock: 8, unit: 'Strip', price: 12000, status: 'Stok Menipis' },
];

export const StockInventoryTable = () => {
  return (
    <div className="bg-white rounded-lg border border-[#DFE6EB] shadow-sm overflow-hidden">
      
      {/* TOP BAR: SEARCH & ACTIONS */}
      <div className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between border-b">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#67737C] group-focus-within:text-[#1B9C90] transition-colors" />
          <Input 
            placeholder="Cari Nama Obat atau Kode ID..." 
            className="pl-12 h-11 rounded-md bg-[#F9FEFC] border-[#DFE6EB] focus-visible:ring-[#1B9C90] text-sm font-medium"
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="h-11 px-4 gap-2 border-[#DFE6EB] font-bold text-[#13222D] hover:bg-[#EFF4F8]">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button className="h-11 px-6 gap-2 bg-[#1B9C90] hover:opacity-90 font-bold text-white shadow-lg shadow-[#1B9C90]/10">
            <Plus className="w-4 h-4" />
            Item Baru
          </Button>
        </div>
      </div>

      {/* INVENTORY TABLE */}
      <Table>
        <TableHeader>
          <TableRow className="bg-[#EFF4F8] hover:bg-[#EFF4F8] border-none">
            <TableHead className="pl-8 text-[#13222D] font-bold h-12">ID</TableHead>
            <TableHead className="text-[#13222D] font-bold h-12">Nama</TableHead>
            <TableHead className="text-[#13222D] font-bold h-12">Tipe</TableHead>
            <TableHead className="text-[#13222D] font-bold h-12">Kategori</TableHead>
            <TableHead className="text-center text-[#13222D] font-bold h-12">Stok</TableHead>
            <TableHead className="text-center text-[#13222D] font-bold h-12">Satuan</TableHead>
            <TableHead className="text-right text-[#13222D] font-bold h-12">Harga</TableHead>
            <TableHead className="text-center text-[#13222D] font-bold h-12">Status</TableHead>
            <TableHead className="pr-8 text-center text-[#13222D] font-bold h-12">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stockData.map((item) => (
            <TableRow 
              key={item.id} 
              className="border-b border-[#DFE6EB] transition-colors group hover:bg-[#F9FEFC]"
            >
              {/* ID */}
              <TableCell className="pl-8 py-4 font-bold text-[#13222D] text-sm">
                {item.id}
              </TableCell>

              {/* Nama */}
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#DFF6F2] text-[#1B9C90] flex items-center justify-center border border-[#DFE6EB]">
                    <Pill className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-[#13222D] text-sm">{item.name}</span>
                </div>
              </TableCell>

              {/* Tipe */}
              <TableCell className="text-[#67737C] font-medium text-sm py-4">
                {item.type}
              </TableCell>

              {/* Kategori */}
              <TableCell className="py-4">
                <Badge variant="secondary" className="bg-[#EFF4F8] text-[#67737C] border-none font-bold rounded-full px-3 py-0.5 shadow-none text-[10px]">
                  {item.category}
                </Badge>
              </TableCell>

              {/* Stok */}
              <TableCell className={cn(
                "text-center font-bold text-sm py-4",
                item.stock < 20 ? "text-[#F2A618]" : "text-[#13222D]"
              )}>
                {item.stock}
              </TableCell>

              {/* Satuan */}
              <TableCell className="text-center text-[#67737C] font-medium text-sm py-4">
                {item.unit}
              </TableCell>

              {/* Harga */}
              <TableCell className="text-right font-bold text-[#13222D] text-sm py-4">
                Rp {item.price.toLocaleString('id-ID')}
              </TableCell>

              {/* Status */}
              <TableCell className="text-center py-4">
                <Badge 
                  className={cn(
                    "rounded-full px-3 py-0.5 text-[10px] font-bold border-none shadow-none",
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

              {/* Aksi */}
              <TableCell className="pr-8 text-center py-4">
                <div className="flex items-center justify-center gap-1">
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-[#67737C] hover:text-[#1B9C90] hover:bg-[#DFF6F2]">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-[#67737C] hover:text-[#E62C2C] hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};