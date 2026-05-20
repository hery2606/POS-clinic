"use client";

import { 
  Calendar, 
  User, 
  Printer, 
  Send, 
  FileText, 
  QrCode 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface TransactionDetailPanelProps {
  onDownloadPDF?: () => void;
  onPrintReceipt?: () => void;
  onSendWhatsApp?: () => void;
}

export function TransactionDetailPanel({
  onDownloadPDF,
  onPrintReceipt,
  onSendWhatsApp,
}: TransactionDetailPanelProps) {
  const items = [
    { name: "Konsultasi Dokter Umum", qty: 1, price: 150000 },
    { name: "Cek Darah Ringan", qty: 1, price: 250000 },
    { name: "Paracetamol 500mg", qty: 1, price: 50000 },
  ];

  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm w-full max-w-md space-y-6">
      
      {/* HEADER SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#13222D]">TRX-1092</h2>
          <Badge className="bg-[#DFF6F2] text-[#1B9C90] border-none shadow-none px-2.5 py-0.5 text-xs font-bold rounded-full">
            LUNAS
          </Badge>
        </div>
        
        <div className="space-y-2 text-xs font-medium text-[#67737C]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#67737C]/70" />
            <span>15 Nov 2023, 14:30</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#67737C]/70" />
            <span className="text-[#13222D] font-semibold">Budi Santoso</span>
          </div>
        </div>
      </div>

      <Separator className="bg-[#DFE6EB]" />

      {/* ITEMS LIST SECTION */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#13222D]">
          Rincian Layanan & Produk
        </h3>
        
        <div className="space-y-3.5">
          {items.map((item, index) => (
            <div key={index} className="flex items-start justify-between gap-4 text-sm">
              <div className="space-y-0.5">
                <p className="font-bold text-[#13222D]">{item.name}</p>
                <p className="text-xs font-medium text-[#67737C]">
                  {item.qty} x Rp {item.price.toLocaleString("id-ID")}
                </p>
              </div>
              <span className="font-bold text-[#13222D] shrink-0">
                Rp {(item.qty * item.price).toLocaleString("id-ID")}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-dashed border-[#DFE6EB] pt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between font-medium text-[#67737C]">
          <span>Subtotal</span>
          <span className="font-bold text-[#13222D]">Rp 450.000</span>
        </div>
        <div className="flex items-center justify-between font-medium text-[#67737C]">
          <span>Diskon/Promo</span>
          <span className="font-bold text-red-500">- Rp 0</span>
        </div>
        <div className="flex items-center justify-between font-medium text-[#67737C]">
          <span>Pajak (0%)</span>
          <span className="font-bold text-[#13222D]">Rp 0</span>
        </div>
      </div>

      <Separator className="bg-[#DFE6EB]" />

      {/* TOTAL PAYMENT */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold text-[#13222D]">Total Pembayaran</span>
        <span className="text-lg font-bold text-[#1B9C90]">Rp 450.000</span>
      </div>

      {/* PAYMENT METHOD BLOCK */}
      <div className="bg-[#F4F7F9] rounded-xl p-4 space-y-1.5 border border-[#DFE6EB]/40">
        <span className="text-[11px] font-semibold text-[#67737C] block">
          Metode Pembayaran
        </span>
        <div className="flex items-center gap-2 text-sm font-bold text-[#13222D]">
          <QrCode className="w-4 h-4 text-[#1B9C90]" />
          <span>QRIS</span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="space-y-2.5 pt-2">
        <Button
          onClick={onDownloadPDF}
          className="w-full bg-[#1B9C90] hover:bg-[#157A71] text-white font-bold h-11 px-4 rounded-xl flex items-center justify-center gap-2 border-none shadow-none transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span>Unduh Invoice (PDF)</span>
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onPrintReceipt}
            variant="outline"
            className="border-[#DFE6EB] text-[#13222D] hover:bg-[#F4F7F9] font-bold h-11 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-none"
          >
            <Printer className="w-4 h-4 text-[#67737C]" />
            <span>Cetak Struk</span>
          </Button>
          <Button
            onClick={onSendWhatsApp}
            variant="outline"
            className="border-[#DFE6EB] text-[#13222D] hover:bg-[#F4F7F9] font-bold h-11 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-none"
          >
            <Send className="w-4 h-4 text-[#67737C]" />
            <span>Kirim WA</span>
          </Button>
        </div>
      </div>

    </Card>
  );
}