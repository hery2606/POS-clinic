"use client";

import { Cpu, CheckCircle2, AlertTriangle, Trash2, Plus, Terminal } from "lucide-react";
import { Card,  CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PiutangAutoReminderMonitorProps {
  transactionsCount: number;
  autoLogs: string[];
  onAddMockInvoices: () => void;
  onClearLogs: () => void;
}

export function PiutangAutoReminderMonitor({
  transactionsCount,
  autoLogs,
  onAddMockInvoices,
  onClearLogs,
}: PiutangAutoReminderMonitorProps) {
  const isQueueMet = transactionsCount > 10;

  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <CardTitle className="text-base font-bold text-[#13222D] flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#1B9C90]" />
              Auto-Reminder System Monitor
            </CardTitle>
          </div>
          <p className="text-xs font-medium text-[#67737C]">
            Sistem pengiriman tagihan otomatis WhatsApp jika antrean menunggak melebihi kapasitas batas aman.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onAddMockInvoices}
            className="bg-[#1B9C90] hover:bg-[#157A71] text-white font-bold text-xs h-9 rounded-xl border-none shadow-none px-3.5 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Simulasi Tambah +5 Tagihan
          </Button>
          <Button
            variant="outline"
            onClick={onClearLogs}
            disabled={autoLogs.length === 0}
            className="h-9 px-3 rounded-xl border-[#DFE6EB] text-[#67737C] hover:bg-[#F4F7F9] disabled:opacity-40 flex items-center gap-1 text-xs font-bold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Status Indicators */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-[#F4F7F9] rounded-2xl p-4 border border-[#DFE6EB]/50 space-y-4">
            <h4 className="text-xs font-bold text-[#67737C] uppercase tracking-wide">
              Kriteria Pengaktifan Auto-Send
            </h4>
            
            <div className="space-y-3">
              {/* Rule 1: Queue > 10 */}
              <div className="flex items-start justify-between text-xs font-semibold gap-4">
                <div className="space-y-0.5">
                  <span className="text-[#13222D] block">Antrean Tagihan &gt; 10</span>
                  <span className="text-[10px] text-[#67737C] font-normal">
                    Jumlah tagihan belum lunas saat ini: <span className="font-bold text-[#13222D]">{transactionsCount}</span>
                  </span>
                </div>
                {isQueueMet ? (
                  <span className="bg-[#DFF6F2] text-[#1B9C90] text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Terpenuhi
                  </span>
                ) : (
                  <span className="bg-[#FFF8E6] text-[#F2A618] text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Kurang {11 - transactionsCount} Data
                  </span>
                )}
              </div>

              {/* Rule 2: Overdue >= 24h */}
              <div className="flex items-start justify-between text-xs font-semibold gap-4">
                <div className="space-y-0.5">
                  <span className="text-[#13222D] block">Umur Tagihan &ge; 24 Jam (1 Hari)</span>
                  <span className="text-[10px] text-[#67737C] font-normal">
                    Otomatis mengirim invoice yang menunggak 1 hari atau lebih.
                  </span>
                </div>
                <span className="bg-[#DFF6F2] text-[#1B9C90] text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Aktif
                </span>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border flex items-center gap-3 transition-colors ${
            isQueueMet 
              ? "bg-[#DFF6F2] border-[#1B9C90]/30 text-[#1B9C90]" 
              : "bg-[#FFF8E6] border-[#F2A618]/30 text-[#F2A618]"
          }`}>
            {isQueueMet ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-[#1B9C90] shrink-0" />
                <div className="text-xs font-bold">
                  Sistem Aktif: Auto-sender memproses pengiriman WhatsApp secara otomatis.
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-[#F2A618] shrink-0" />
                <div className="text-xs font-bold">
                  Standby: Menunggu jumlah antrean piutang melebihi 10 transaksi.
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Console/Log Terminal */}
        <div className="md:col-span-7 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#67737C] uppercase tracking-wide flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-[#1B9C90]" />
              Console Log Aktivitas Mesin
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              {autoLogs.length} Entri
            </span>
          </div>

          <div className="bg-[#13222D] rounded-2xl p-4 font-mono text-[10px] text-[#A5C0D3] h-40 overflow-y-auto space-y-1.5 shadow-inner border border-slate-800">
            {autoLogs.length === 0 ? (
              <div className="text-slate-500  text-xs h-full flex items-center justify-center">
                Belum ada aktivitas otomatisasi terdeteksi. Silakan tambah tagihan untuk simulasi.
              </div>
            ) : (
              autoLogs.map((log, index) => (
                <div key={index} className="leading-relaxed border-b border-slate-800/40 pb-1 last:border-0">
                  <span className="text-[#84DFD4]">{log.substring(0, 10)}</span>
                  <span className="text-white">{log.substring(10)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
