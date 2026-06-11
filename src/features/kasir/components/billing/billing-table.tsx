"use client";

import { Stethoscope, Copy } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { type BillingTransactionItem } from '@/features/kasir/types/billing.types';

interface BillingTableProps {
  selectedPatient: BillingTransactionItem | null;
}

export function BillingTable({ selectedPatient }: BillingTableProps) {
  const subtotal = selectedPatient?.subtotal || 0;
  const total = selectedPatient?.total || 0;
  const paidAmount = selectedPatient?.paidAmount || 0;
  const remainingAmount = selectedPatient?.remainingAmount || 0;

  const handleCopyTotal = () => {
    const text = `Rp ${total.toLocaleString('id-ID')}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <Table>
        <TableHeader>
          <TableRow className="bg-linear-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <TableHead className="text-slate-700 font-semibold">Deskripsi Layanan</TableHead>
            <TableHead className="text-center text-slate-700 font-semibold">Qty</TableHead>
            <TableHead className="text-right text-slate-700 font-semibold">Subtotal</TableHead>
            <TableHead className="text-right text-slate-700 font-semibold">Sudah Dibayar</TableHead>
            <TableHead className="text-right text-slate-700 font-semibold">Sisa Tagihan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!selectedPatient ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center">
                <p className="text-slate-500 text-sm">Silakan pilih pasien untuk melihat detail billing</p>
              </TableCell>
            </TableRow>
          ) : (
            <TableRow className="border-b border-slate-100 transition-colors hover:bg-slate-50 bg-white">
              <TableCell className="py-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-[#29B5A8]" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 text-sm">Bundling Tindakan & Perawatan RME</p>
                    <p className="text-xs text-gray-500 mt-0.5">Akumulasi {selectedPatient.itemCount} item pemeriksaan</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center py-4 font-medium text-gray-900 text-sm">
                1
              </TableCell>
              <TableCell className="text-right py-4 text-gray-900 text-sm font-medium">
                Rp {subtotal.toLocaleString('id-ID')}
              </TableCell>
              <TableCell className="text-right py-4 text-emerald-600 text-sm font-semibold">
                Rp {paidAmount.toLocaleString('id-ID')}
              </TableCell>
              <TableCell className="text-right py-4 text-red-500 text-sm font-semibold">
                Rp {remainingAmount.toLocaleString('id-ID')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter className="bg-linear-to-r from-slate-50 to-slate-100 border-t border-slate-200">
          <TableRow>
            <TableCell colSpan={4} className="text-right py-4">
              <span className="font-semibold text-gray-700">Total Tagihan Akhir</span>
            </TableCell>
            <TableCell className="text-right py-4">
              <div className="flex items-center justify-end gap-2 group">
                <span className="text-lg font-bold text-[#29B5A8]">
                  Rp {total.toLocaleString('id-ID')}
                </span>
                <button
                  onClick={handleCopyTotal}
                  disabled={!selectedPatient}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded disabled:opacity-0"
                  title="Salin ke clipboard"
                >
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}