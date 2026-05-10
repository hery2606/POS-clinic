import { 
  ArrowLeft, 
  Edit3, 
  Pill, 
  History, 
  Package, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  MoreVertical,
  Plus,
  Minus,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const StockDetail = () => {
  return (
    <div className="min-h-screen bg-[#F9FEFC] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 1. HEADER & ACTIONS */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full bg-white border border-[#DFE6EB] text-[#67737C]">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[#13222D]">Detail Item Obat</h1>
              <p className="text-sm font-medium text-[#67737C]">Informasi spesifikasi dan manajemen stok</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-full h-12 px-6 border-[#DFE6EB] font-bold text-[#13222D]">
              <FileText className="w-4 h-4 mr-2" />
              Laporan Stok
            </Button>
            <Button className="rounded-full h-12 px-6 gap-2 bg-[#1B9C90] hover:opacity-90 font-bold text-white shadow-lg shadow-[#1B9C90]/10">
              <Edit3 className="w-4 h-4" />
              Edit Data
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: PRODUCT SUMMARY (4 COLUMNS) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-[32px] border-[#DFE6EB] bg-white p-8 shadow-sm">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-[24px] bg-[#DFF6F2] flex items-center justify-center border border-[#DFE6EB]">
                  <Pill className="w-10 h-10 text-[#1B9C90]" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-[#13222D]">Amoxicillin 500mg</h2>
                  <p className="text-sm font-medium text-[#67737C]">Antibiotik • MD-001</p>
                  <Badge className="mt-2 rounded-full bg-[#DFF6F2] text-[#3EB268] border-none font-bold px-4 shadow-none">
                    Tersedia
                  </Badge>
                </div>
              </div>

              <Separator className="my-8 bg-[#DFE6EB]" />

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-bold text-[#67737C] uppercase tracking-widest mb-1">Stok Saat Ini</p>
                  <p className="text-2xl font-bold text-[#13222D]">120 <span className="text-sm font-medium text-[#67737C]">Strip</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#67737C] uppercase tracking-widest mb-1">Min. Stok</p>
                  <p className="text-2xl font-bold text-[#F2A618]">20 <span className="text-sm font-medium text-[#67737C]">Strip</span></p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center p-4 bg-[#F9FEFC] rounded-2xl border border-[#DFE6EB]">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-[#1B9C90]" />
                    <span className="text-sm font-bold text-[#13222D]">Harga Jual</span>
                  </div>
                  <span className="text-sm font-bold text-[#13222D]">Rp 25.000</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#F9FEFC] rounded-2xl border border-[#DFE6EB]">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[#E62C2C]" />
                    <span className="text-sm font-bold text-[#13222D]">Kedaluwarsa</span>
                  </div>
                  <span className="text-sm font-bold text-[#13222D]">12 Des 2025</span>
                </div>
              </div>
            </Card>

            {/* QUICK ACTIONS */}
            <div className="bg-white p-6 rounded-[32px] border border-[#DFE6EB] space-y-4 shadow-sm">
              <p className="text-xs font-bold text-[#13222D] mb-2 px-2 uppercase tracking-widest">Update Cepat</p>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="rounded-2xl h-14 border-[#DFE6EB] hover:bg-[#DFF6F2] hover:text-[#1B9C90] font-bold gap-2">
                  <Plus className="w-4 h-4" /> Stok Masuk
                </Button>
                <Button variant="outline" className="rounded-2xl h-14 border-[#DFE6EB] hover:bg-red-50 hover:text-[#E62C2C] font-bold gap-2">
                  <Minus className="w-4 h-4" /> Opname
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: STOCK MOVEMENT HISTORY (8 COLUMNS) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* STATS OVERVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 rounded-[24px] border-[#DFE6EB] shadow-none flex items-center gap-4 bg-white">
                <div className="w-12 h-12 rounded-full bg-[#DFF6F2] flex items-center justify-center text-[#1B9C90]">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#67737C] uppercase">Keluar (30 Hari)</p>
                  <p className="text-lg font-bold text-[#13222D]">450 Strip</p>
                </div>
              </Card>
              <Card className="p-6 rounded-[24px] border-[#DFE6EB] shadow-none flex items-center gap-4 bg-white">
                <div className="w-12 h-12 rounded-full bg-[#EFF4F8] flex items-center justify-center text-[#67737C]">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#67737C] uppercase">Terakhir Masuk</p>
                  <p className="text-lg font-bold text-[#13222D]">12 Mei 2024</p>
                </div>
              </Card>
              <Card className="p-6 rounded-[24px] border-[#DFE6EB] shadow-none flex items-center gap-4 bg-white">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-[#F2A618]">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#67737C] uppercase">Saran Re-Order</p>
                  <p className="text-lg font-bold text-[#13222D]">5 Hari lagi</p>
                </div>
              </Card>
            </div>

            {/* MOVEMENT TABLE */}
            <Card className="rounded-[32px] border-[#DFE6EB] bg-white overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[#DFE6EB] flex items-center justify-between">
                <h3 className="font-bold text-[#13222D] flex items-center gap-2">
                  <History className="w-5 h-5 text-[#67737C]" />
                  Riwayat Aktivitas Stok
                </h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="pl-8 text-[11px] font-bold text-[#67737C] uppercase tracking-widest">Tanggal</TableHead>
                    <TableHead className="text-[11px] font-bold text-[#67737C] uppercase tracking-widest">Keterangan</TableHead>
                    <TableHead className="text-[11px] font-bold text-[#67737C] uppercase tracking-widest text-center">Jumlah</TableHead>
                    <TableHead className="text-[11px] font-bold text-[#67737C] uppercase tracking-widest text-center">Sisa Stok</TableHead>
                    <TableHead className="pr-8 text-[11px] font-bold text-[#67737C] uppercase tracking-widest text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { date: '14 Ags 2023', desc: 'Penjualan - Kasir (INV-001)', change: '-10', result: '120', type: 'out' },
                    { date: '12 Ags 2023', desc: 'Penerimaan Supplier (PO-22)', change: '+50', result: '130', type: 'in' },
                    { date: '05 Ags 2023', desc: 'Penjualan - Kasir (INV-002)', change: '-5', result: '80', type: 'out' },
                    { date: '01 Ags 2023', desc: 'Stok Opname Bulanan', change: '+2', result: '85', type: 'in' },
                  ].map((log, i) => (
                    <TableRow key={i} className="border-none hover:bg-[#F9FEFC] transition-colors group">
                      <TableCell className="pl-8 py-5 text-sm font-medium text-[#13222D]">{log.date}</TableCell>
                      <TableCell className="text-sm font-bold text-[#13222D]">{log.desc}</TableCell>
                      <TableCell className="text-center">
                        <span className={cn(
                          "font-bold",
                          log.type === 'in' ? "text-[#3EB268]" : "text-[#E62C2C]"
                        )}>
                          {log.change}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-bold text-[#13222D]">{log.result}</TableCell>
                      <TableCell className="pr-8 text-center">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#EFF4F8] text-[#67737C]">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};