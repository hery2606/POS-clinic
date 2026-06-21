"use client";

import { useMemo } from "react";
import { Cpu, CheckCircle2, AlertTriangle, Trash2, Plus, Activity } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  // Optimasi pemisahan string penanda waktu "[HH:MM:SS]" secara aman menggunakan useMemo
  const parsedLogs = useMemo(() => {
    return autoLogs.map((log) => {
      const match = log.match(/^\[(.*?)\]\s(.*)/);
      return {
        time: match ? match[1] : "",
        message: match ? match[2] : log,
      };
    });
  }, [autoLogs]);

  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm">
      {/* Top Controller Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <CardTitle className="text-sm font-bold text-[#13222D] flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#1B9C90]" />
              Auto-Reminder System Monitor
            </CardTitle>
          </div>
          <p className="text-xs font-medium text-[#67737C]">
            Sistem pengiriman tagihan otomatis WhatsApp jika antrean menunggak melebihi kapasitas batas aman.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={onAddMockInvoices}
            className="bg-[#1B9C90] hover:bg-[#157A71] text-white font-bold text-xs h-9 rounded-xl border-none shadow-none px-3.5 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Simulasi Tambah +5 Tagihan
          </Button>
          <Button
            variant="outline"
            onClick={onClearLogs}
            disabled={autoLogs.length === 0}
            className="h-9 px-3 rounded-xl border-[#DFE6EB] text-[#67737C] hover:bg-[#F4F7F9] disabled:opacity-40 flex items-center gap-1 text-xs font-bold shadow-none cursor-pointer"
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
            <h4 className="text-[10px] font-bold text-[#67737C] uppercase tracking-wider">
              Kriteria Pengaktifan Auto-Send
            </h4>
            
            <div className="space-y-3">
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

          <div className={cn(
            "p-4 rounded-2xl border flex items-center gap-3 transition-colors text-xs font-bold",
            isQueueMet ? "bg-[#DFF6F2] border-[#1B9C90]/30 text-[#1B9C90]" : "bg-[#FFF8E6] border-[#F2A618]/30 text-[#F2A618]"
          )}>
            {isQueueMet ? (
              <>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Sistem Aktif: Auto-sender memproses pengiriman WhatsApp secara otomatis.</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Standby: Menunggu jumlah antrean piutang melebihi 10 transaksi.</span>
              </>
            )}
          </div>
        </div>

        {/* 🟢 REFACTORING RIGHT COLUMN: Interactive Timeline Log Feed */}
        <div className="md:col-span-7 flex flex-col space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-[#67737C] uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#1B9C90]" />
              Riwayat Aktivitas Sistem
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              {parsedLogs.length} Entri
            </span>
          </div>

          <div className="bg-white rounded-2xl h-44 overflow-y-auto border border-[#DFE6EB]/60 p-4">
            {parsedLogs.length === 0 ? (
              <div className="text-[#67737C] text-xs h-full flex flex-col items-center justify-center gap-1.5 text-center">
                <div className="w-8 h-8 rounded-full bg-[#F4F7F9] flex items-center justify-center mb-0.5">
                  <Activity className="w-4 h-4 text-[#A5C0D3]" />
                </div>
                <span className="font-semibold text-[#13222D]">Log Monitor Bersih</span>
                <span className="text-[10px] text-slate-400">Belum mendeteksi pergerakan trigger otomatis.</span>
              </div>
            ) : (
              <div className="relative border-l border-slate-100 pl-4 space-y-4">
                {parsedLogs.map((log, index) => (
                  <div key={index} className="relative text-xs animate-in fade-in slide-in-from-left-1 duration-150">
                    {/* Timeline Node Bullet */}
                    <span className="absolute -left-[21px] top-1 flex h-2 w-2 items-center justify-center rounded-full bg-white border border-[#1B9C90]" />
                    
                    <div className="flex flex-col gap-0.5 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-[#67737C] tracking-tight">
                          {log.time}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                          System Event
                        </span>
                      </div>
                      <p className="font-semibold text-[#13222D] leading-relaxed">
                        {log.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}