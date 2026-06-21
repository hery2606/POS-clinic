"use client";

import { useState, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Loader2, 
  Edit2, 
  Check, 
  Send, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { type LocalDaftarTransaksiBelumLunas } from '../laporan/Piutang/types';

interface InvoiceReminderTableProps {
  invoices: LocalDaftarTransaksiBelumLunas[];
  reminderStatuses: Record<string, "idle" | "sending" | "sent" | "error">;
  onSendWa: (invoice: LocalDaftarTransaksiBelumLunas) => void;
  onUpdatePhone: (invoiceId: string, newPhone: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0);
};

const getFormattedDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export function InvoiceReminderTable({
  invoices,
  reminderStatuses,
  onSendWa,
  onUpdatePhone
}: InvoiceReminderTableProps) {
  // Pagination & Editing Inline State
  const [currentPage, setCurrentPage] = useState(1);
  const [editingInvoice, setEditingInvoice] = useState<string | null>(null);
  const [tempPhone, setTempPhone] = useState<string>("");
  const itemsPerPage = 5;

  const startEditingPhone = (invoiceId: string, currentPhone: string) => {
    setEditingInvoice(invoiceId);
    setTempPhone(currentPhone);
  };

  const savePhone = (invoiceId: string) => {
    onUpdatePhone(invoiceId, tempPhone);
    setEditingInvoice(null);
  };

  const getStatusBadge = (status: string, days: number) => {
    const normalized = status?.toLowerCase();
    if (normalized === 'sudah dikirim' || normalized === 'terkirim') {
      return {
        label: 'TERKIRIM',
        className: 'bg-[#DFF6F2] text-[#1B9C90]'
      };
    }
    if (days >= 5) {
      return {
        label: 'JATUH TEMPO',
        className: 'bg-red-50 text-[#E62C2C]'
      };
    }
    return {
      label: 'PENDING',
      className: 'bg-[#FFF9EB] text-[#F2A618]'
    };
  };

  // Pagination Logic
  const totalItems = invoices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return invoices.slice(startIndex, startIndex + itemsPerPage);
  }, [invoices, currentPage]);

  return (
    <div className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full flex flex-col justify-between">
      <div className="overflow-x-auto">
        {/* 🟢 PERBAIKAN RESPONSIVE: Mengurangi min-width agar pas di laptop, dan scroll hanya muncul di layar kecil */}
        <Table className="w-full min-w-[768px]">
          <TableHeader>
            <TableRow className="bg-[#F4F7F9] hover:bg-[#F4F7F9] border-none whitespace-nowrap">
              <TableHead className="pl-8 text-[#67737C] font-bold h-12 text-left text-xs w-[12%]">TANGGAL</TableHead>
              <TableHead className="text-[#67737C] font-bold h-12 text-left text-xs w-[15%]">NO. INVOICE</TableHead>
              <TableHead className="text-[#67737C] font-bold h-12 text-left text-xs w-[18%]">PASIEN</TableHead>
              <TableHead className="text-[#67737C] font-bold h-12 text-left text-xs w-[15%]">TAGIHAN</TableHead>
              <TableHead className="text-center text-[#67737C] font-bold h-12 text-xs w-[12%]">LAMA TERTUNDA</TableHead>
              <TableHead className="text-[#67737C] font-bold h-12 text-left text-xs w-[16%]">NOMOR WA</TableHead>
              <TableHead className="pr-8 text-center text-[#67737C] font-bold h-12 text-xs w-[12%]">AKSI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs font-bold text-slate-400">
                  Tidak ada data invoice tertunda.
                </TableCell>
              </TableRow>
            ) : (
              paginatedInvoices.map((row) => {
                const statusBadge = getStatusBadge(row.status_reminder, row.hari_belum_lunas);
                const status = reminderStatuses[row.no_invoice] || "idle";
                const isEditing = editingInvoice === row.no_invoice;
                const isSent = row.status_reminder === 'Sudah Dikirim' || row.status_reminder === 'Terkirim' || status === 'sent';

                return (
                  <TableRow 
                    key={row.no_invoice} 
                    className="border-b border-[#DFE6EB] last:border-none transition-colors hover:bg-[#F9FEFC]"
                  >
                    {/* Tanggal */}
                    <TableCell className="pl-8 py-4 text-xs font-bold text-[#13222D] text-left">
                      {getFormattedDate(row.hari_belum_lunas)}
                    </TableCell>

                    {/* No Invoice */}
                    <TableCell className="py-4 text-xs font-mono font-bold text-[#13222D] text-left">
                      {row.no_invoice}
                    </TableCell>

                    {/* Pasien */}
                    <TableCell className="py-4 text-xs font-bold text-[#13222D] text-left truncate">
                      {row.pasien}
                    </TableCell>

                    {/* Tagihan */}
                    <TableCell className="py-4 text-xs font-bold text-[#1B9C90] text-left">
                      {formatCurrency(row.total_tagihan)}
                    </TableCell>

                    {/* Lama Menunggak */}
                    <TableCell className="py-4 text-center">
                      <Badge className={cn(
                        "rounded-full px-2.5 py-0.5 text-[9px] font-black border-none shadow-none uppercase tracking-wider",
                        statusBadge.className
                      )}>
                        {row.hari_belum_lunas} Hari
                      </Badge>
                    </TableCell>

                    {/* Nomor WA (Editable Input) */}
                    <TableCell className="py-4 text-left">
                      {isEditing ? (
                        <div className="flex items-center gap-1 w-full max-w-[160px]">
                          <input 
                            type="text" 
                            value={tempPhone} 
                            onChange={(e) => setTempPhone(e.target.value)} 
                            className="h-7 w-full border border-[#DFE6EB] rounded px-2 text-xs font-bold focus:outline-none focus:border-[#1B9C90]" 
                          />
                          <Button 
                            size="icon" 
                            className="h-7 w-7 bg-[#1B9C90] text-white rounded shrink-0 border-none shadow-none cursor-pointer" 
                            onClick={() => savePhone(row.no_invoice)}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group">
                          <span className="text-xs font-bold text-[#67737C]">{row.wa_number}</span>
                          <button 
                            onClick={() => startEditingPhone(row.no_invoice, row.wa_number)} 
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#EFF4F8] rounded text-[#67737C]"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </TableCell>

                    {/* Aksi */}
                    <TableCell className="pr-8 text-center py-4">
                      {status === "sending" ? (
                        <Button 
                          disabled 
                          className="h-8 rounded-xl px-4 text-xs font-bold bg-[#13222D]/10 text-[#67737C] shadow-none border-none outline-none mx-auto flex items-center gap-1.5"
                        >
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>Kirim...</span>
                        </Button>
                      ) : isSent ? (
                        <div className="flex items-center justify-center gap-1 text-[#1B9C90] font-bold text-xs bg-[#DFF6F2]/70 py-1.5 px-3 rounded-xl w-fit mx-auto border border-[#1B9C90]/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Terkirim</span>
                        </div>
                      ) : (
                        <Button 
                          className="h-8 rounded-xl px-4 text-xs font-bold bg-[#1B9C90] hover:bg-[#157A71] text-white shadow-none border-none outline-none cursor-pointer mx-auto flex items-center gap-1.5"
                          onClick={() => onSendWa(row)}
                        >
                          <Send className="w-3 h-3" />
                          <span>Reminder</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-[#DFE6EB] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F9FEFC]/30">
        <span className="text-xs font-semibold text-[#67737C]">
          Menampilkan <span className="text-[#13222D] font-bold">
            {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, totalItems)}
          </span> dari <span className="text-[#13222D] font-bold">{totalItems}</span> invoice
        </span>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0 rounded-lg border-[#DFE6EB] text-[#67737C] disabled:opacity-40 hover:bg-[#F4F7F9]"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant="outline"
              onClick={() => setCurrentPage(i + 1)}
              className={cn(
                "h-8 px-3 rounded-lg text-xs font-bold border-none shadow-none",
                currentPage === i + 1
                  ? "bg-[#13222D]/5 text-[#1B9C90]"
                  : "text-[#67737C] hover:bg-[#F4F7F9]"
              )}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0 rounded-lg border-[#DFE6EB] text-[#67737C] disabled:opacity-40 hover:bg-[#F4F7F9]"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}