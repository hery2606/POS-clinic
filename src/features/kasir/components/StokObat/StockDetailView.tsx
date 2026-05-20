import React, { useMemo } from 'react';
import { 
  Pill, 
  AlertCircle,
  Calendar, 
  Package, 
  Truck, 
  Layers
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';
import { warehouseService } from '../../services/warehouse.service';

interface StockDetailViewProps {
  item: {
    id: string;
    nama?: string;
    name?: string;
    satuan?: string;
    type?: string;
    kategori?: string;
    category?: string;
    stokSaatIni?: number;
    stock?: number;
    hargaJual?: string | number;
    price?: number;
    status?: string;
    lokasiGudang?: {
      kode: string;
      nama: string;
      tipe: string;
    } | null;
  };
  onBack: () => void;
}

export const StockDetailView: React.FC<StockDetailViewProps> = ({ item }) => {
  const minStockThreshold = 20;

  // Fetch detail data untuk history stok
  useQuery({
    queryKey: ['medicines'],
    queryFn: warehouseService.getMedicinesList,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Normalisasi data item untuk kompatibilitas
  const normalizedItem = useMemo(() => {
    const name = item.nama || item.name || '';
    const unit = item.satuan || item.type || '';
    const category = item.kategori || item.category || '';
    const stock = item.stokSaatIni ?? item.stock ?? 0;
    const price = typeof item.hargaJual === 'string' 
      ? parseInt(item.hargaJual, 10) 
      : item.price ?? 0;
    const status = item.status || (stock >= minStockThreshold ? 'Tersedia' : 'Stok Menipis');
    const locationName = item.lokasiGudang?.nama || 'Rak B-04 (Suhu Ruang)';
    const locationType = item.lokasiGudang?.tipe || 'B';

    return {
      id: item.id,
      name,
      unit,
      category,
      stock,
      price,
      status,
      locationName,
      locationType
    };
  }, [item]);


  return (
    <div className="w-full bg-white space-y-6 p-6">
      
      {/* SIMPLIFIED HEADER FOR RIGHT PANEL */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DFE6EB]">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-sm font-bold text-[#13222D]">{normalizedItem.name}</h2>
            <Badge 
              className={cn(
                "rounded-full px-2 py-0.5 text-[8px] font-bold border-none shadow-none inline-flex items-center gap-1",
                normalizedItem.status === 'Tersedia' ? "bg-[#DFF6F2] text-[#3EB268]" : "bg-[#FFF9EB] text-[#F2A618]"
              )}
            >
              {normalizedItem.status === 'Stok Menipis' && <AlertCircle className="w-3 h-3" />}
              {normalizedItem.status}
            </Badge>
          </div>
          <p className="text-[10px] font-medium text-[#67737C] mt-1">
            {normalizedItem.id} · {normalizedItem.category}
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
                <span className="font-bold text-[#13222D] mt-1 block">{normalizedItem.unit}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#67737C] uppercase block">Satuan Terkecil</span>
                <span className="font-bold text-[#13222D] mt-1 block">{normalizedItem.unit}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#67737C] uppercase block">Harga Jual per {normalizedItem.unit}</span>
                <span className="font-bold text-[#1B9C90] text-base mt-1 block">Rp {normalizedItem.price.toLocaleString('id-ID')}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#67737C] uppercase block">Lokasi Rak Penyimpanan</span>
                <span className="font-bold text-[#13222D] mt-1 block flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#67737C]" /> {normalizedItem.locationName}
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
                normalizedItem.stock < minStockThreshold ? "text-[#F2A618]" : "text-[#1B9C90]"
              )}>
                {normalizedItem.stock}
              </p>
              <p className="text-xs font-bold text-[#67737C] mt-2 uppercase tracking-wide">
                Total Jurnal Jual ({normalizedItem.unit})
              </p>
            </div>

            {/* Visual Bar Stock Threshold */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#67737C]">Status Batas Minimum</span>
                <span className="text-[#13222D] font-bold">{minStockThreshold} {normalizedItem.unit}</span>
              </div>
              <div className="w-full h-3 bg-[#EFF4F8] rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    normalizedItem.stock < minStockThreshold ? "bg-[#F2A618]" : "bg-[#1B9C90]"
                  )}
                  style={{ width: `${Math.min((normalizedItem.stock / 150) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[10px] font-medium text-[#67737C] leading-relaxed">
                *Jika stok berada di bawah {minStockThreshold} {normalizedItem.unit}, sistem otomatis akan memicu notifikasi peringatan Restock Obat.
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