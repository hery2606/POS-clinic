"use client"

import React, { useEffect, useState } from 'react';
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
import { analitikService } from '../../services/analitik.service';

interface InvoiceReminder {
  no_invoice: string;
  pasien: string;
  hari_belum_lunas: number;
  total_tagihan: number;
  status_reminder: string;
}

interface InvoiceReminderTableProps {
  className?: string;
}

export const InvoiceReminderTable: React.FC<InvoiceReminderTableProps> = ({ className }) => {
  const [invoices, setInvoices] = useState<InvoiceReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await analitikService.getPendingInvoices();
        setInvoices(response.data.daftar_transaksi_belum_lunas);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching pending invoices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string, days: number) => {
    // If reminder hasn't been sent and days >= 5, mark as overdue
    if (status === 'Belum Dikirim' && days >= 5) {
      return {
        label: 'JATUH TEMPO',
        className: 'bg-red-50 text-[#E62C2C] hover:bg-red-50'
      };
    }
    return {
      label: 'PENDING',
      className: 'bg-[#FFF9EB] text-[#F2A618] hover:bg-[#FFF9EB]'
    };
  };

  if (error) {
    return (
      <div className={`bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full flex flex-col justify-between ${className}`}>
        <div className="p-6 border-b border-[#DFE6EB]">
          <h3 className="text-lg font-bold text-[#13222D]">
            Invoice & Reminder Tagihan
          </h3>
        </div>
        <div className="p-6 text-red-600 text-sm">
          Error: {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full flex flex-col justify-between ${className}`}>
        <div className="p-6 border-b border-[#DFE6EB]">
          <h3 className="text-lg font-bold text-[#13222D]">
            Invoice & Reminder Tagihan
          </h3>
        </div>
        <div className="p-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

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
                <TableHead className="text-[#67737C] font-bold h-12 text-left">No. Invoice</TableHead>
                <TableHead className="text-center text-[#67737C] font-bold h-12">Lama (Hari)</TableHead>
                <TableHead className="text-[#67737C] font-bold h-12 text-left">Tagihan</TableHead>
                <TableHead className="text-center text-[#67737C] font-bold h-12">Status</TableHead>
                <TableHead className="pr-8 text-center text-[#67737C] font-bold h-12">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((row, index) => {
                const statusBadge = getStatusBadge(row.status_reminder, row.hari_belum_lunas);
                return (
                  <TableRow 
                    key={index} 
                    className="border-b border-[#DFE6EB] last:border-none transition-colors hover:bg-[#F9FEFC]"
                  >
                    <TableCell className="pl-8 py-5 font-bold text-[#13222D] text-sm text-left">
                      {row.pasien}
                    </TableCell>

                    <TableCell className="text-[#67737C] font-medium text-sm py-5 text-left">
                      {row.no_invoice}
                    </TableCell>

                    <TableCell className="text-center text-[#67737C] font-medium text-sm py-5">
                      {row.hari_belum_lunas}
                    </TableCell>

                    <TableCell className="font-bold text-[#13222D] text-sm py-5 text-left">
                      {formatCurrency(row.total_tagihan)}
                    </TableCell>

                    <TableCell className="text-center py-5">
                      <Badge 
                        className={cn(
                          "rounded-full px-3 py-1 text-[10px] font-bold border-none shadow-none uppercase tracking-wider",
                          statusBadge.className
                        )}
                      >
                        {statusBadge.label}
                      </Badge>
                    </TableCell>

                    <TableCell className="pr-8 text-center py-5">
                      <Button 
                        variant="secondary" 
                        className="h-8 rounded-full px-4 text-xs font-bold bg-[#EFF4F8] hover:bg-[#DFE6EB] text-[#13222D] transition-colors"
                        disabled={row.status_reminder === 'Sudah Dikirim'}
                      >
                        {row.status_reminder === 'Sudah Dikirim' ? 'Terkirim' : 'Reminder'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};