import React from 'react';
import { 
  X,
  Sparkles, 
  TrendingUp, 
  Pill, 
  CreditCard, 
  AlertTriangle, 
  Bell, 
  Package, 
  Gift, 
  Download 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VisualSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisualSummaryModal: React.FC<VisualSummaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown as any);
    return () => document.removeEventListener('keydown', handleKeyDown as any);
  }, []);

  return (
    <div 
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    >
      {/* Modal Content */}
      <div className="w-full max-w-6xl max-h-[95vh] bg-white rounded-[32px] border border-[#DFE6EB] shadow-xl overflow-hidden flex flex-col">
        
        {/* HEADER */}
        <div className="flex-shrink-0 p-6 border-b border-[#DFE6EB] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1B9C90] text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#13222D]">Visual Summary AI</h2>
              <p className="text-xs font-medium text-[#67737C]">Analisis Otomatis Kinerja Klinik Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full hover:bg-[#EFF4F8] text-[#67737C] h-9 w-9 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY - Scrollable */}
        <ScrollArea className="flex-1 w-full">
          <div className="p-8 space-y-8 bg-[#F9FEFC]">
              
              {/* RINGKASAN BISNIS */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-[#13222D]">Ringkasan Bisnis</h3>
                <p className="text-md font-medium text-[#67737C] leading-relaxed">
                  Kondisi pendapatan klinik minggu ini menunjukkan tren positif dengan peningkatan 12% dibanding periode sebelumnya. 
                  Penjualan paling kuat didorong oleh tingginya permintaan untuk Obat Paracetamol dan layanan Konsultasi Umum. 
                  Dari sisi pasien, terdapat dominasi signifikan pada pasien lama (65%) yang menunjukkan retensi yang baik. 
                  Namun, dari sisi keuangan, status piutang sebesar Rp 15M (dengan 3 invoice telah jatuh tempo) memerlukan tindakan 
                  penagihan segera agar arus kas tetap stabil dan tidak mengganggu operasional klinik.
                </p>
              </div>

              {/* GRID SECTIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* INSIGHT UTAMA */}
                <div className="bg-white p-6 rounded-[24px] border border-[#DFE6EB] space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 pb-2">
                    <TrendingUp className="w-4 h-4 text-[#1B9C90]" />
                    <h4 className="text-md font-bold text-[#13222D] uppercase tracking-wider">Insight Utama</h4>
                </div>

                <div className="space-y-4">
                  {/* Item 1 */}
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#DFF6F2] text-[#1B9C90] flex items-center justify-center shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-md font-bold text-[#13222D]">Pendapatan Naik 12%</p>
                      <p className="text-[13px] font-medium text-[#67737C]">Dibanding minggu lalu, mencapai Rp 124M bulan ini.</p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#DFF6F2] text-[#1B9C90] flex items-center justify-center shrink-0">
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-md font-bold text-[#13222D]">Layanan & Obat Terlaris</p>
                      <p className="text-[13px] font-medium text-[#67737C]">Konsultasi Dokter Umum dan Paracetamol 500mg.</p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#DFF6F2] text-[#1B9C90] flex items-center justify-center shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-md font-bold text-[#13222D]">Metode Pembayaran Dominan</p>
                      <p className="text-[13px] font-medium text-[#67737C]">QRIS mencakup 55% dari total transaksi (Rp 68M).</p>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-red-50 text-[#E62C2C] flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-md font-bold text-[#13222D]">Piutang Signifikan</p>
                      <p className="text-[13px] font-medium text-[#67737C]">Total Rp 15M dengan beberapa invoice telah jatuh tempo.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* REKOMENDASI TINDAKAN */}
              <div className="bg-white p-6 rounded-[24px] border border-[#DFE6EB] space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-2">
                  <Sparkles className="w-4 h-4 text-[#1B9C90]" />
                  <h4 className="text-md font-bold text-[#13222D] uppercase tracking-wider">Rekomendasi Tindakan</h4>
                </div>

                <div className="space-y-3">
                  {/* Card 1 */}
                  <div className="p-4 bg-[#FFF9EB] border border-[#FFE6A8] rounded-2xl flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-[#F2A618] flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-md font-bold text-[#13222D]">Percepat penagihan invoice</p>
                      <p className="text-[13px] font-medium text-[#67737C]">Kirim reminder ke Rina Melati dan 2 pasien lainnya yang jatuh tempo.</p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="p-4 bg-[#DFF6F2] border border-[#B8EBE5] rounded-2xl flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#1B9C90]/10 text-[#1B9C90] flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-md font-bold text-[#13222D]">Tingkatkan stok produk X</p>
                      <p className="text-[13px] font-medium text-[#67737C]">Stok Paracetamol 500mg dan Amoxicillin mendekati batas minimum.</p>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="p-4 bg-[#DFF6F2] border border-[#B8EBE5] rounded-2xl flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#1B9C90]/10 text-[#1B9C90] flex items-center justify-center shrink-0">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-md font-bold text-[#13222D]">Program Loyalti Pasien</p>
                      <p className="text-[13px] font-medium text-[#67737C]">Tawarkan paket check-up untuk 35% pasien baru agar menjadi pasien rutin.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </ScrollArea>

        {/* FOOTER */}
        <div className="flex-shrink-0 p-6 border-t border-[#DFE6EB] bg-white flex justify-end gap-3">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="rounded-full h-11 px-6 font-bold text-[#67737C] hover:bg-[#EFF4F8]"
          >
            Tutup
          </Button>
          <Button 
            className="rounded-full h-11 px-6 bg-[#1B9C90] hover:opacity-90 font-bold text-white flex items-center gap-2 border-none shadow-lg shadow-[#1B9C90]/10"
          >
            <Download className="w-4 h-4" />
            Unduh PDF
          </Button>
        </div>

      </div>
    </div>
  );
};