import React from 'react';
import { 
  Pill, 
  AlertCircle,
  Calendar, 
  Package, 
  Truck, 
  Layers,
  History,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface StockDetailViewProps {
  item: {
    id: string;
    name: string;
    type: string;
    category: string;
    stock: number;
    unit: string;
    price: number;
    status: string;
  };
  onBack: () => void;
}

// Data dummy tambahan untuk riwayat mutasi stok obat
const stockHistoryDummy = [
  { tanggal: '10 Mei 2026, 10:20', tipe: 'MASUK', jumlah: 50, keterangan: 'Penerimaan dari Supplier PT. Kimia Farma', oleh: 'Ahmad Rizal' },
  { tanggal: '08 Mei 2026, 14:15', tipe: 'KELUAR', jumlah: 2, keterangan: 'Resep Pembayaran INV-230814-001', oleh: 'Siti Aminah' },
  { tanggal: '05 Mei 2026, 09:00', tipe: 'KELUAR', jumlah: 5, keterangan: 'Pemberian Unit IGD', oleh: 'Budi Santoso' },
];

export const StockDetailView: React.FC<StockDetailViewProps> = ({ item }) => {
  const minStockThreshold = 20; // Batas minimum stok

  return (
    <div className="w-full bg-white space-y-6 p-6">
      
      {/* SIMPLIFIED HEADER FOR RIGHT PANEL */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DFE6EB]">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-sm font-bold text-[#13222D]">{item.name}</h2>
            <Badge 
              className={cn(
                "rounded-full px-2 py-0.5 text-[8px] font-bold border-none shadow-none inline-flex items-center gap-1",
                item.status === 'Tersedia' ? "bg-[#DFF6F2] text-[#3EB268]" : "bg-[#FFF9EB] text-[#F2A618]"
              )}
            >
              {item.status === 'Stok Menipis' && <AlertCircle className="w-3 h-3" />}
              {item.status}
            </Badge>
          </div>
          <p className="text-[10px] font-medium text-[#67737C] mt-1">
            {item.id} · {item.category}
          </p>
        </div>
      </div>

      {/* CONTENT SYSTEM - SIMPLIFIED FOR RIGHT PANEL */}
      <div className="grid grid-cols-1 gap-4">
        
        {/* LEFT COLUMN: MAIN INFORMATION & HISTORY (8 SPAN) */}
        <div className="space-y-4">
          
          {/* Card 1: Detail Informasi */}
          <Card className="bg-white p-6 rounded-[24px] border border-[#DFE6EB] shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-[#13222D] uppercase tracking-wider border-b border-[#DFE6EB] pb-3 flex items-center gap-2">
              <Pill className="w-4 h-4 text-[#1B9C90]" /> Informasi Fisik & Spesifikasi
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 text-sm">
              <div>
                <span className="text-[11px] font-bold text-[#67737C] uppercase block">Bentuk Sediaan / Tipe</span>
                <span className="font-bold text-[#13222D] mt-1 block">{item.type}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#67737C] uppercase block">Satuan Terkecil</span>
                <span className="font-bold text-[#13222D] mt-1 block">{item.unit}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#67737C] uppercase block">Harga Jual per {item.unit}</span>
                <span className="font-bold text-[#1B9C90] text-base mt-1 block">Rp {item.price.toLocaleString('id-ID')}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#67737C] uppercase block">Lokasi Rak Penyimpanan</span>
                <span className="font-bold text-[#13222D] mt-1 block flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#67737C]" /> Rak B-04 (Suhu Ruang)
                </span>
              </div>
            </div>

            <Separator className="bg-[#EFF4F8]" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 text-sm">
              <div>
                <span className="text-[11px] font-bold text-[#67737C] uppercase block">Produsen / Supplier Utama</span>
                <span className="font-bold text-[#13222D] mt-1 block flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#67737C]" /> PT. Kimia Farma Tbk.
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#67737C] uppercase block">Nomor Bets / Batch No</span>
                <span className="font-mono font-bold text-[#13222D] mt-1 block">BATCH-2026A9X</span>
              </div>
            </div>
          </Card>

          {/* Card 2: Riwayat Pergerakan Stok */}
          <Card className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#DFE6EB]">
              <h3 className="text-sm font-bold text-[#13222D] uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-[#1B9C90]" /> Log Mutasi & Pergerakan Stok
              </h3>
            </div>
            
            <div className="overflow-x-auto w-full">
              <Table className="w-full table-fixed min-w-[700px]">
                <TableHeader>
                  <TableRow className="bg-[#EFF4F8] hover:bg-[#EFF4F8] border-none">
                    <TableHead className="pl-8 text-[#13222D] font-bold h-11 text-left w-[25%]">Tanggal & Waktu</TableHead>
                    <TableHead className="text-[#13222D] font-bold h-11 text-center w-[15%]">Tipe</TableHead>
                    <TableHead className="text-[#13222D] font-bold h-11 text-center w-[15%]">Jumlah</TableHead>
                    <TableHead className="text-[#13222D] font-bold h-11 text-left w-[30%]">Keterangan / Aktivitas</TableHead>
                    <TableHead className="pr-8 text-[#13222D] font-bold h-11 text-left w-[15%]">Oleh</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockHistoryDummy.map((log, index) => (
                    <TableRow key={index} className="border-b border-[#DFE6EB] last:border-none transition-colors hover:bg-[#F9FEFC]">
                      <TableCell className="pl-8 py-4 text-xs font-semibold text-[#67737C] text-left">
                        {log.tanggal}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <Badge 
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[9px] font-bold border-none shadow-none uppercase inline-flex items-center gap-1",
                            log.tipe === 'MASUK' ? "bg-[#DFF6F2] text-[#1B9C90]" : "bg-red-50 text-[#E62C2C]"
                          )}
                        >
                          {log.tipe === 'MASUK' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {log.tipe}
                        </Badge>
                      </TableCell>
                      <TableCell className={cn(
                        "text-center font-bold text-sm py-4",
                        log.tipe === 'MASUK' ? "text-[#1B9C90]" : "text-[#13222D]"
                      )}>
                        {log.tipe === 'MASUK' ? `+${log.jumlah}` : `-${log.jumlah}`} {item.unit}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-[#13222D] text-left truncate">
                        {log.keterangan}
                      </TableCell>
                      <TableCell className="pr-8 text-xs font-bold text-[#13222D] text-left">
                        {log.oleh}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: STOCK METRICS CARD (4 SPAN) */}
        <div className="space-y-4">
          
          {/* Card Ringkasan Kuantitas */}
          <Card className="bg-white p-6 rounded-[24px] border border-[#DFE6EB] shadow-sm space-y-6">
            <h4 className="text-[10px] font-bold text-[#67737C] uppercase tracking-wider">
              Kuantitas Riil Saat Ini
            </h4>
            
            <div className="text-center py-4 bg-[#F9FEFC] rounded-2xl border border-[#DFE6EB]">
              <p className={cn(
                "text-5xl font-extrabold tracking-tight",
                item.stock < minStockThreshold ? "text-[#F2A618]" : "text-[#1B9C90]"
              )}>
                {item.stock}
              </p>
              <p className="text-xs font-bold text-[#67737C] mt-2 uppercase tracking-wide">
                Total Jurnal Jual ({item.unit})
              </p>
            </div>

            {/* Visual Bar Stock Threshold */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#67737C]">Status Batas Minimum</span>
                <span className="text-[#13222D] font-bold">{minStockThreshold} {item.unit}</span>
              </div>
              <div className="w-full h-3 bg-[#EFF4F8] rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    item.stock < minStockThreshold ? "bg-[#F2A618]" : "bg-[#1B9C90]"
                  )}
                  style={{ width: `${Math.min((item.stock / 150) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[10px] font-medium text-[#67737C] leading-relaxed">
                *Jika stok berada di bawah {minStockThreshold} {item.unit}, sistem otomatis akan memicu notifikasi peringatan Restock Obat.
              </p>
            </div>
          </Card>

          {/* Card Parameter Validitas Tanggal */}
          <Card className="bg-white p-6 rounded-[24px] border border-[#DFE6EB] shadow-sm space-y-4">
            <h4 className="text-[10px] font-bold text-[#67737C] uppercase tracking-wider">
              Masa Kedaluwarsa & Update
            </h4>
            
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-[#E62C2C] mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-[#67737C] uppercase">Tanggal Kedaluwarsa (ED)</p>
                <p className="text-sm font-bold text-[#E62C2C] mt-0.5">24 Desember 2028</p>
              </div>
            </div>

            <Separator className="bg-[#EFF4F8]" />

            <div className="flex items-start gap-3">
              <Package className="w-4 h-4 text-[#67737C] mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-[#67737C] uppercase">Pembaruan Sistem Terakhir</p>
                <p className="text-xs font-bold text-[#13222D] mt-0.5">Hari ini, 09:12 WIB</p>
              </div>
            </div>
          </Card>

        </div>
      </div>

    </div>
  );
};