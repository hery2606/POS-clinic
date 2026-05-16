import React from 'react';
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

interface InvoiceReminder {
  patient: string;
  transactionDate: string;
  durationDays: number;
  billAmount: string;
  status: 'JATUH TEMPO' | 'PENDING';
}

const invoiceData: InvoiceReminder[] = [
  { 
    patient: 'Rina Melati', 
    transactionDate: '12 Nov 2023', 
    durationDays: 5, 
    billAmount: 'Rp 450.000', 
    status: 'JATUH TEMPO' 
  },
  { 
    patient: 'Doni Pratama', 
    transactionDate: '14 Nov 2023', 
    durationDays: 3, 
    billAmount: 'Rp 1.200.000', 
    status: 'PENDING' 
  },
  { 
    patient: 'Maya Sari', 
    transactionDate: '15 Nov 2023', 
    durationDays: 2, 
    billAmount: 'Rp 350.000', 
    status: 'PENDING' 
  },
];

interface InvoiceReminderTableProps {
  className?: string;
}

export const InvoiceReminderTable: React.FC<InvoiceReminderTableProps> = ({ className }) => {
  return (
    <div className={`bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full flex flex-col justify-between ${className}`}>
      <div className="flex-1 flex flex-col justify-between">
        <div className="p-6 border-b border-[#DFE6EB]">
          <h3 className="text-lg font-bold text-[#13222D]">
            Invoice & Reminder Tagihan
          </h3>
        </div>

        <div className="overflow-x-auto flex-1">
          <Table>
            <TableHeader>
              <TableRow className="bg-transparent hover:bg-transparent border-b border-[#DFE6EB]">
                <TableHead className="pl-8 text-[#67737C] font-bold h-12 text-left">Pasien</TableHead>
                <TableHead className="text-[#67737C] font-bold h-12 text-left">Tgl Transaksi</TableHead>
                <TableHead className="text-center text-[#67737C] font-bold h-12">Lama (Hari)</TableHead>
                <TableHead className="text-[#67737C] font-bold h-12 text-left">Tagihan</TableHead>
                <TableHead className="text-center text-[#67737C] font-bold h-12">Status</TableHead>
                <TableHead className="pr-8 text-center text-[#67737C] font-bold h-12">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceData.map((row, index) => (
                <TableRow 
                  key={index} 
                  className="border-b border-[#DFE6EB] last:border-none transition-colors hover:bg-[#F9FEFC]"
                >
                  <TableCell className="pl-8 py-5 font-bold text-[#13222D] text-sm text-left">
                    {row.patient}
                  </TableCell>

                  <TableCell className="text-[#67737C] font-medium text-sm py-5 text-left">
                    {row.transactionDate}
                  </TableCell>

                  <TableCell className="text-center text-[#67737C] font-medium text-sm py-5">
                    {row.durationDays}
                  </TableCell>

                  <TableCell className="font-bold text-[#13222D] text-sm py-5 text-left">
                    {row.billAmount}
                  </TableCell>

                  <TableCell className="text-center py-5">
                    <Badge 
                      className={cn(
                        "rounded-full px-3 py-1 text-[10px] font-bold border-none shadow-none uppercase tracking-wider",
                        row.status === 'JATUH TEMPO' 
                          ? "bg-red-50 text-[#E62C2C] hover:bg-red-50" 
                          : "bg-[#FFF9EB] text-[#F2A618] hover:bg-[#FFF9EB]"
                      )}
                    >
                      {row.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="pr-8 text-center py-5">
                    <Button 
                      variant="secondary" 
                      className="h-8 rounded-full px-4 text-xs font-bold bg-[#EFF4F8] hover:bg-[#DFE6EB] text-[#13222D] transition-colors"
                    >
                      Reminder
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};