"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { analitikService } from "@/features/analitik/services/analitik.service";
import { billingPosService } from "@/features/kasir/services/billing.pos.service";
import { PiutangSummaryCards } from "./Piutang/PiutangSummaryCards";
import { PiutangAgingChart } from "./chart/PiutangAgingChart";
import { PiutangBreakdown } from "./Piutang/PiutangBreakdown";
import { PiutangActionTable } from "./Piutang/PiutangActionTable";
import { PiutangAutoReminderMonitor } from "./Piutang/PiutangAutoReminderMonitor";
import { type LocalDaftarTransaksiBelumLunas } from "./Piutang/types";

export function PiutangReportSection() {
  const qOut = useQuery({ queryKey: ["outstandingInvoices"], queryFn: () => billingPosService.getOutstandingInvoices(), staleTime: 300000 });
  const qRev = useQuery({ queryKey: ["revenueTrendData"], queryFn: () => analitikService.getRevenueTrend(), staleTime: 300000 });

  const [txs, setTxs] = useState<LocalDaftarTransaksiBelumLunas[]>([]);
  const [remStatus, setRemStatus] = useState<Record<string, "idle" | "sending" | "sent" | "error">>({});
  const [logs, setLogs] = useState<string[]>([]);
  const [notif, setNotif] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    setTxs(qOut.data?.data?.map((i: any) => ({
      no_invoice: `INV-2026-${i.id.split("-")[0].toUpperCase()}`,
      pasien: i.patient?.name || "Pasien",
      total_tagihan: i.remainingAmount || i.total || 0,
      hari_belum_lunas: i.daysPending || 1,
      status_reminder: "Belum Dikirim",
      wa_number: i.patient?.phone || `0812${Math.floor(10000000 + Math.random() * 90000000)}`,
      insurance_type: i.patient?.insuranceType || "UMUM"
    })) || []);
  }, [qOut.data]);

  const { totPiutang, avgDelay, aging, bpjsAmt, umumAmt } = useMemo(() => {
    let tp = 0, td = 0, r1 = 0, r2 = 0, r3 = 0, ba = 0, ua = 0;
    txs.forEach(t => {
      tp += t.total_tagihan; td += t.hari_belum_lunas;
      if (t.hari_belum_lunas <= 2) r1 += t.total_tagihan; else if (t.hari_belum_lunas <= 5) r2 += t.total_tagihan; else r3 += t.total_tagihan;
      (t.insurance_type || "UMUM").toUpperCase() === "BPJS" ? ba += t.total_tagihan : ua += t.total_tagihan;
    });
    return { totPiutang: tp, avgDelay: txs.length ? Math.round(td / txs.length) : 0, aging: [{ name: "1-2 Hari", amount: r1 }, { name: "3-5 Hari", amount: r2 }, { name: "> 7 Hari", amount: r3 }], bpjsAmt: ba, umumAmt: ua };
  }, [txs]);

  const totRev = qRev.data?.data?.total_pendapatan_bulan_ini || 0;
  const pRatio = totRev ? Number(((totPiutang / totRev) * 100).toFixed(2)) : 0;
  const bTotal = umumAmt + bpjsAmt;
  const breakdown = bTotal ? { umumPercent: Math.round((umumAmt / bTotal) * 100), bpjsPercent: 100 - Math.round((umumAmt / bTotal) * 100), umumVal: umumAmt, bpjsVal: bpjsAmt } : { umumPercent: 0, bpjsPercent: 0, umumVal: 0, bpjsVal: 0 };
  const topDebtors = [...txs].sort((a, b) => b.total_tagihan - a.total_tagihan).slice(0, 3);

  const addLog = (m: string) => setLogs(p => [`[${new Date().toLocaleTimeString("id-ID")}] ${m}`, ...p]);
  const showNotif = (type: "success" | "error", msg: string) => { setNotif({ type, msg }); setTimeout(() => setNotif(null), 4000); };

  const handleSendWa = async (t: LocalDaftarTransaksiBelumLunas) => {
    setRemStatus(p => ({ ...p, [t.no_invoice]: "sending" }));
    try {
      await analitikService.sendWaReminder({ target: t.wa_number, nama_pasien: t.pasien, attachment_url: `https://klinik-pos.com/invoice/pdf/${t.no_invoice}`, filename: `${t.no_invoice}.pdf`, status_pembayaran: "Belum Lunas" });
      setRemStatus(p => ({ ...p, [t.no_invoice]: "sent" }));
      setTxs(p => p.map(x => x.no_invoice === t.no_invoice ? { ...x, status_reminder: "Terkirim" } : x));
      addLog(`[Engine] WA terkirim ke ${t.pasien} (${t.no_invoice})`); showNotif("success", `WA terkirim ke ${t.pasien}`);
    } catch {
      setRemStatus(p => ({ ...p, [t.no_invoice]: "error" }));
      addLog(`[Engine] Gagal WA ke ${t.pasien} (${t.no_invoice})`); showNotif("error", `Gagal WA ke ${t.pasien}`);
    }
  };

  const addMocks = () => {
    const n = txs.filter(t => t.no_invoice.startsWith("INV-MOCK-")).length + 1;
    setTxs(p => [...p, 
      { no_invoice: `INV-MOCK-0${n}`, pasien: "Joko W", total_tagihan: 150000, hari_belum_lunas: 2, status_reminder: "Belum Dikirim", wa_number: "0899", insurance_type: "UMUM" },
      { no_invoice: `INV-MOCK-0${n + 1}`, pasien: "Prabowo S", total_tagihan: 200000, hari_belum_lunas: 1, status_reminder: "Belum Dikirim", wa_number: "0898", insurance_type: "BPJS" }
    ]);
    addLog(`[User] +2 Mock Invoices`);
  };

  useEffect(() => {
    if (txs.length > 10) {
      const elig = txs.filter(t => t.hari_belum_lunas >= 1 && t.status_reminder !== "Terkirim" && !["sending", "sent", "error"].includes(remStatus[t.no_invoice]));
      if (elig.length) { addLog(`[Engine] Antrean > 10. Memicu auto-send.`); elig.forEach(handleSendWa); }
    }
  }, [txs, remStatus]);

  return (
    <div className="w-full space-y-6">
      {notif && (
        <div className={cn("p-4 rounded-2xl border flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4", notif.type === "success" ? "bg-[#DFF6F2] border-[#1B9C90]/30 text-[#1B9C90]" : "bg-red-50 border-red-200 text-red-700")}>
          <div className="flex items-center gap-3">{notif.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}<span className="text-xs sm:text-sm font-semibold">{notif.msg}</span></div>
          <button onClick={() => setNotif(null)} className="text-xs font-bold hover:underline opacity-80 hover:opacity-100">Tutup</button>
        </div>
      )}

      <PiutangSummaryCards totalPiutang={totPiutang} totalPendingTransactions={txs.length} averageDelayDays={avgDelay} piutangRatioPercentage={pRatio} />
      <PiutangAutoReminderMonitor transactionsCount={txs.length} autoLogs={logs} onAddMockInvoices={addMocks} onClearLogs={() => setLogs([])} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <PiutangAgingChart agingData={aging} />
        <PiutangBreakdown breakdownProportion={breakdown} topDebtors={topDebtors} />
      </div>
      <PiutangActionTable transactions={txs} reminderStatuses={remStatus} onSendWa={handleSendWa} onUpdatePhone={(id, ph) => { setTxs(p => p.map(t => t.no_invoice === id ? { ...t, wa_number: ph } : t)); addLog(`[User] Update WA ${id} -> ${ph}`); showNotif("success", `WA ${id} diperbarui`); }} />
    </div>
  );
}