"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Check,
  Send,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type LocalDaftarTransaksiBelumLunas } from "./types";

interface PiutangActionTableProps {
  transactions: LocalDaftarTransaksiBelumLunas[];
  reminderStatuses: Record<string, "idle" | "sending" | "sent" | "error">;
  onSendWa: (invoice: LocalDaftarTransaksiBelumLunas) => void;
  onUpdatePhone: (invoiceId: string, newPhone: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getFormattedDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export function PiutangActionTable({
  transactions,
  reminderStatuses,
  onSendWa,
  onUpdatePhone,
}: PiutangActionTableProps) {
  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingInvoice, setEditingInvoice] = useState<string | null>(null);
  const [tempPhone, setTempPhone] = useState<string>("");
  const itemsPerPage = 5;

  // Phone number inline editing helpers
  const startEditingPhone = (invoiceId: string, currentPhone: string) => {
    setEditingInvoice(invoiceId);
    setTempPhone(currentPhone);
  };

  const savePhone = (invoiceId: string) => {
    onUpdatePhone(invoiceId, tempPhone);
    setEditingInvoice(null);
  };

  // Search filter
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t =>
      t.pasien.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.no_invoice.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm]);

  // Pagination
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Helper to get range of visible pages (limit buttons on mobile)
  const getVisiblePages = () => {
    const range = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);
      
      if (start === 1) {
        end = maxVisible;
      } else if (end === totalPages) {
        start = totalPages - maxVisible + 1;
      }
      
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
    }
    return range;
  };

  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full flex flex-col justify-between">
      {/* Header Table */}
      <div className="p-4 sm:p-6 border-b border-[#DFE6EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-[#13222D]">
            Tabel Aksi Penagihan Piutang
          </h3>
          <p className="text-xs font-medium text-[#67737C]">
            Kirim pengingat tagihan pasien secara asinkron lewat WhatsApp CRM
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#67737C]" />
          <input
            type="text"
            placeholder="Cari pasien / no invoice..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 pl-10 pr-4 bg-[#F4F7F9] border-none text-xs font-medium text-[#13222D] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1B9C90] placeholder-[#67737C]"
          />
        </div>
      </div>

      {/* Table Workspace */}
      <div className="overflow-x-auto w-full">
        <Table className="w-full min-w-[900px] table-fixed">
          <TableHeader>
            <TableRow className="bg-[#F4F7F9] hover:bg-[#F4F7F9] border-none">
              <TableHead className="text-xs font-bold text-[#67737C] h-12 text-left pl-4 sm:pl-6 w-[12%]">TANGGAL</TableHead>
              <TableHead className="text-xs font-bold text-[#67737C] h-12 text-left w-[15%]">NO. INVOICE</TableHead>
              <TableHead className="text-xs font-bold text-[#67737C] h-12 text-left w-[18%]">NAMA PASIEN</TableHead>
              <TableHead className="text-xs font-bold text-[#67737C] h-12 text-left w-[13%]">SISA TAGIHAN</TableHead>
              <TableHead className="text-xs font-bold text-[#67737C] h-12 text-left w-[10%]">LAMA MENUNGGAK</TableHead>
              <TableHead className="text-xs font-bold text-[#67737C] h-12 text-left w-[18%]">NOMOR WHATSAPP</TableHead>
              <TableHead className="text-xs font-bold text-[#67737C] h-12 text-center pr-4 sm:pr-6 w-[14%]">AKSI REMINDER</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-xs font-medium text-[#67737C]">
                  Tidak ada data transaksi pending yang cocok dengan pencarian Anda.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((item) => {
                const status = reminderStatuses[item.no_invoice] || "idle";
                const isEditing = editingInvoice === item.no_invoice;

                return (
                  <TableRow
                    key={item.no_invoice}
                    className="border-b border-[#DFE6EB] last:border-none transition-colors hover:bg-[#F9FEFC]"
                  >
                    {/* Tanggal */}
                    <TableCell className="pl-4 sm:pl-6 py-4 text-xs font-bold text-[#13222D] text-left">
                      {getFormattedDate(item.hari_belum_lunas)}
                    </TableCell>

                    {/* No Invoice */}
                    <TableCell className="py-4 text-xs font-mono font-bold text-[#13222D] text-left">
                      {item.no_invoice}
                    </TableCell>

                    {/* Nama Pasien */}
                    <TableCell className="py-4 text-xs font-bold text-[#13222D] text-left truncate">
                      {item.pasien}
                    </TableCell>

                    {/* Sisa Tagihan */}
                    <TableCell className="py-4 text-xs font-bold text-[#1B9C90] text-left">
                      {formatCurrency(item.total_tagihan)}
                    </TableCell>

                    {/* Lama Menunggak */}
                    <TableCell className="py-4 text-left">
                      <Badge
                        className={cn(
                          "border-none shadow-none rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                          item.hari_belum_lunas <= 3
                            ? "bg-[#DFF6F2] text-[#1B9C90] hover:bg-[#DFF6F2]"
                            : item.hari_belum_lunas <= 7
                              ? "bg-[#FFF8E6] text-[#F2A618] hover:bg-[#FFF8E6]"
                              : "bg-red-50 text-[#E62C2C] hover:bg-red-50"
                        )}
                      >
                        {item.hari_belum_lunas} Hari
                      </Badge>
                    </TableCell>

                    {/* Nomor WA (Editable input field) */}
                    <TableCell className="py-4 text-left">
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <div className="flex items-center gap-1 w-full max-w-[170px]">
                            <input
                              type="text"
                              value={tempPhone}
                              onChange={(e) => setTempPhone(e.target.value)}
                              className="h-9 w-full border border-[#DFE6EB] rounded-xl px-3 text-xs font-bold focus:outline-none focus:border-[#1B9C90]"
                            />
                            <Button
                              size="icon"
                              className="h-9 w-9 bg-[#1B9C90] hover:bg-[#157A71] text-white rounded-xl shrink-0 border-none shadow-none flex items-center justify-center cursor-pointer"
                              onClick={() => savePhone(item.no_invoice)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 group">
                            <span className="text-xs font-bold text-[#67737C]">
                              {item.wa_number}
                            </span>
                            <button
                              onClick={() => startEditingPhone(item.no_invoice, item.wa_number)}
                              className="md:opacity-0 md:group-hover:opacity-100 transition-opacity p-2 hover:bg-[#EFF4F8] rounded-lg text-[#67737C] hover:text-[#13222D] flex items-center justify-center w-8 h-8 cursor-pointer"
                              title="Ubah nomor WhatsApp"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Aksi Reminder WA */}
                    <TableCell className="py-4 text-center pr-4 sm:pr-6">
                      {status === "sending" ? (
                        <Button
                          disabled
                          className="bg-[#13222D]/10 hover:bg-[#13222D]/10 text-[#67737C] font-bold text-xs h-9 rounded-xl border-none shadow-none px-4 flex items-center gap-2 mx-auto"
                        >
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Mengirim...</span>
                        </Button>
                      ) : status === "sent" || item.status_reminder === "Terkirim" ? (
                        <div className="flex items-center justify-center gap-1 text-[#1B9C90] font-bold text-xs bg-[#DFF6F2]/70 py-1.5 px-3 rounded-xl w-fit mx-auto border border-[#1B9C90]/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Terkirim</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => onSendWa(item)}
                          className="bg-[#1B9C90] hover:bg-[#157A71] text-white font-bold text-xs h-9 rounded-xl border-none shadow-none px-4 flex items-center gap-1.5 transition-colors mx-auto"
                        >
                          <Send className="w-3 h-3" />
                          <span>Kirim Reminder</span>
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

      {/* Footer Pagination */}
      <div className="px-4 py-4 sm:px-6 border-t border-[#DFE6EB] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F9FEFC]/30">
        <span className="text-xs font-medium text-[#67737C]">
          Menampilkan <span className="text-[#13222D] font-bold">
            {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, totalItems)}
          </span> dari <span className="text-[#13222D] font-bold">{totalItems}</span> data entri
        </span>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0 rounded-lg border-[#DFE6EB] text-[#67737C] disabled:opacity-40 hover:bg-[#F4F7F9]"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {getVisiblePages().map((page) => (
            <Button
              key={page}
              variant="outline"
              onClick={() => setCurrentPage(page)}
              className={cn(
                "h-8 px-3 rounded-lg text-xs font-bold border-none shadow-none",
                currentPage === page
                  ? "bg-[#13272F]/5 text-[#1B9C90]"
                  : "text-[#67737C] hover:bg-[#F4F7F9]"
              )}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0 rounded-lg border-[#DFE6EB] text-[#67737C] disabled:opacity-40 hover:bg-[#F4F7F9]"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
