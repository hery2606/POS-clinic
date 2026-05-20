"use client";

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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  patientName: string;
  date: string;
  total: number;
  method: string;
  status: "Sukses" | "Pending" | "Gagal";
}

const dummyTransactions: Transaction[] = [
  { id: "TX-002841", patientName: "Budi Santoso", date: "18 Mei 2026, 14:20", total: 4200000, method: "QRIS", status: "Sukses" },
  { id: "TX-002840", patientName: "Siti Aminah", date: "18 Mei 2026, 11:15", total: 3800000, method: "Transfer Bank", status: "Sukses" },
  { id: "TX-002839", patientName: "Andi Wijaya", date: "17 Mei 2026, 16:45", total: 2900000, method: "Tunai", status: "Sukses" },
  { id: "TX-002838", patientName: "Rina Permata", date: "17 Mei 2026, 09:30", total: 150000, method: "QRIS", status: "Pending" },
  { id: "TX-002837", patientName: "Ahmad Faisal", date: "16 Mei 2026, 10:00", total: 450000, method: "Transfer Bank", status: "Gagal" },
];

export function TransactionTable() {
  return (
    <div className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full">
      
      {/* HEADER TABLE SECTION */}
      <div className="p-6 border-b border-[#DFE6EB] flex items-baseline gap-2">
        <h3 className="text-base font-bold text-[#13222D]">
          Daftar Transaksi
        </h3>
        <span className="text-xs font-medium text-[#67737C]">
          Menampilkan 5 dari 842 data
        </span>
      </div>

      {/* TABLE ELEMENT */}
      <div className="overflow-x-auto w-full">
        <Table className="w-full min-w-200 table-fixed">
          <TableHeader>
            <TableRow className="bg-[#F4F7F9] hover:bg-[#F4F7F9] border-none">
              <TableHead className="pl-6 text-xs font-bold text-[#67737C] h-12 w-[15%] text-left">ID TRANSAKSI</TableHead>
              <TableHead className="text-xs font-bold text-[#67737C] h-12 w-[25%] text-left">NAMA PASIEN</TableHead>
              <TableHead className="text-xs font-bold text-[#67737C] h-12 w-[20%] text-left">TANGGAL</TableHead>
              <TableHead className="text-xs font-bold text-[#67737C] h-12 w-[15%] text-left">TOTAL</TableHead>
              <TableHead className="text-xs font-bold text-[#67737C] h-12 w-[13%] text-left">METODE</TableHead>
              <TableHead className="pr-6 text-xs font-bold text-[#67737C] h-12 w-[12%] text-left">STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyTransactions.map((tx) => (
              <TableRow 
                key={tx.id} 
                className="border-b border-[#DFE6EB] last:border-none transition-colors hover:bg-[#F9FEFC] cursor-pointer"
              >
                <TableCell className="pl-6 py-4 text-xs font-bold text-[#13222D] text-left">
                  {tx.id}
                </TableCell>
                <TableCell className="py-4 text-sm font-semibold text-[#13222D] text-left truncate">
                  {tx.patientName}
                </TableCell>
                <TableCell className="py-4 text-xs font-medium text-[#67737C] text-left">
                  {tx.date}
                </TableCell>
                <TableCell className="py-4 text-sm font-bold text-[#13222D] text-left">
                  Rp {tx.total.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="py-4 text-xs font-semibold text-[#13222D] text-left">
                  {tx.method}
                </TableCell>
                <TableCell className="pr-6 py-4 text-left">
                  <Badge
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-bold border-none shadow-none inline-flex items-center justify-center",
                      tx.status === "Sukses" && "bg-[#DFF6F2] text-[#1B9C90]",
                      tx.status === "Pending" && "bg-[#FFF9EB] text-[#F2A618]",
                      tx.status === "Gagal" && "bg-red-50 text-red-500"
                    )}
                  >
                    {tx.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* FOOTER PAGINATION BLOCK */}
      <div className="px-6 py-4 border-t border-[#DFE6EB] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F9FEFC]/30">
        <span className="text-xs font-medium text-[#67737C]">
          Menampilkan <span className="text-[#13222D] font-bold">1 - 5</span> dari <span className="text-[#13222D] font-bold">48</span> data entri
        </span>
        
        <div className="flex items-center gap-1.5">
          <Button 
            variant="outline" 
            disabled 
            className="h-8 w-8 p-0 rounded-lg border-[#DFE6EB] text-[#67737C] disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            className="h-8 px-3 rounded-lg text-xs font-bold bg-[#13272F]/5 border-none text-[#1B9C90] shadow-none"
          >
            1
          </Button>
          <Button 
            variant="outline" 
            className="h-8 px-3 rounded-lg text-xs font-bold border-none text-[#67737C] hover:bg-[#F4F7F9] shadow-none"
          >
            2
          </Button>
          <Button 
            variant="outline" 
            className="h-8 px-3 rounded-lg text-xs font-bold border-none text-[#67737C] hover:bg-[#F4F7F9] shadow-none"
          >
            3
          </Button>
          <Button 
            variant="outline" 
            className="h-8 w-8 p-0 rounded-lg border-[#DFE6EB] text-[#67737C] hover:bg-[#F4F7F9]"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}