"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { analitikService } from "@/features/analitik/services/analitik.service";
import { billingPosService } from "@/features/kasir/services/billing.pos.service";

// Import modular sub-components
import { PiutangSummaryCards } from "./Piutang/PiutangSummaryCards";
import { PiutangAgingChart } from "./chart/PiutangAgingChart";
import { PiutangBreakdown } from "./Piutang/PiutangBreakdown";
import { PiutangActionTable } from "./Piutang/PiutangActionTable";
import { PiutangAutoReminderMonitor } from "./Piutang/PiutangAutoReminderMonitor";

import { type LocalDaftarTransaksiBelumLunas } from "./Piutang/types";

export function PiutangReportSection() {
  // Queries
  const outstandingInvoicesQuery = useQuery({
    queryKey: ["outstandingInvoices"],
    queryFn: () => billingPosService.getOutstandingInvoices(),
    staleTime: 5 * 60 * 1000,
  });

  const revenueTrendQuery = useQuery({
    queryKey: ["revenueTrendData"],
    queryFn: () => analitikService.getRevenueTrend(),
    staleTime: 5 * 60 * 1000,
  });

  // Base state for dynamic updates (like WA send tracking)
  const [transactions, setTransactions] = useState<LocalDaftarTransaksiBelumLunas[]>([]);
  const [reminderStatuses, setReminderStatuses] = useState<Record<string, "idle" | "sending" | "sent" | "error">>({});
  const [autoLogs, setAutoLogs] = useState<string[]>([]);

  // Inline feedback notification state
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Fallback / mockup data as requested by USER
  const fallbackTransactions = useMemo<LocalDaftarTransaksiBelumLunas[]>(() => [
    { no_invoice: "INV-2026-001", pasien: "Budi Santoso", total_tagihan: 120000, hari_belum_lunas: 1, status_reminder: "Belum Dikirim", wa_number: "081234567890", insurance_type: "BPJS" },
    { no_invoice: "INV-2026-002", pasien: "Siti Aminah", total_tagihan: 100000, hari_belum_lunas: 2, status_reminder: "Belum Dikirim", wa_number: "082345678901", insurance_type: "UMUM" },
    { no_invoice: "INV-2026-003", pasien: "Ahmad Dahlan", total_tagihan: 60000, hari_belum_lunas: 3, status_reminder: "Belum Dikirim", wa_number: "083456789012", insurance_type: "UMUM" },
    { no_invoice: "INV-2026-004", pasien: "Dewi Lestari", total_tagihan: 40000, hari_belum_lunas: 5, status_reminder: "Belum Dikirim", wa_number: "084567890123", insurance_type: "UMUM" },
    { no_invoice: "INV-2026-005", pasien: "Eko Prasetyo", total_tagihan: 50000, hari_belum_lunas: 8, status_reminder: "Belum Dikirim", wa_number: "085678901234", insurance_type: "BPJS" },
    { no_invoice: "INV-2026-006", pasien: "Farhan Hakim", total_tagihan: 40000, hari_belum_lunas: 9, status_reminder: "Belum Dikirim", wa_number: "086789012345", insurance_type: "UMUM" },
    { no_invoice: "INV-2026-007", pasien: "Gita Gutawa", total_tagihan: 20000, hari_belum_lunas: 10, status_reminder: "Belum Dikirim", wa_number: "087890123456", insurance_type: "UMUM" },
    { no_invoice: "INV-2026-008", pasien: "Hendra Wijaya", total_tagihan: 10000, hari_belum_lunas: 12, status_reminder: "Belum Dikirim", wa_number: "088901234567", insurance_type: "BPJS" },
  ], []);

  // Initialize transactions state from query or fallback
  useEffect(() => {
    const apiData = outstandingInvoicesQuery.data?.data;
    if (apiData && apiData.length > 0) {
      // API returned valid active data from POS Outstanding
      const mapped = apiData.map((item: any) => ({
        no_invoice: `INV-2026-${item.id.split("-")[0].toUpperCase()}`,
        pasien: item.patient?.name || "Pasien",
        total_tagihan: item.remainingAmount || item.total || 0,
        hari_belum_lunas: item.daysPending || 1,
        status_reminder: "Belum Dikirim",
        wa_number: item.patient?.phone || `0812${String(Math.floor(10000000 + Math.random() * 90000000))}`,
        insurance_type: item.patient?.insuranceType || "UMUM"
      }));
      setTransactions(mapped);
    } else {
      // Empty API data or error -> use fallback data
      setTransactions(fallbackTransactions);
    }
  }, [outstandingInvoicesQuery.data, fallbackTransactions]);

  // Derived Metrik (Top Cards)
  const totalPiutang = useMemo(() => {
    if (transactions.length === 0) return 440000;
    return transactions.reduce((sum, item) => sum + item.total_tagihan, 0);
  }, [transactions]);

  const totalPendingTransactions = transactions.length;

  const averageDelayDays = useMemo(() => {
    if (transactions.length === 0) return 2;
    const sumDays = transactions.reduce((sum, item) => sum + item.hari_belum_lunas, 0);
    return Math.round(sumDays / transactions.length) || 2;
  }, [transactions]);

  // Total Pendapatan from API to calculate percentage
  const totalRevenue = useMemo(() => {
    return revenueTrendQuery.data?.data?.total_pendapatan_bulan_ini || 148500000;
  }, [revenueTrendQuery.data]);

  const piutangRatioPercentage = useMemo(() => {
    if (totalRevenue === 0) return 0.3;
    return Number(((totalPiutang / totalRevenue) * 100).toFixed(2));
  }, [totalPiutang, totalRevenue]);

  // Breakdown Penjamin Proportions (BPJS vs UMUM)
  const breakdownProportion = useMemo(() => {
    let umumAmount = 0;
    let bpjsAmount = 0;

    transactions.forEach(t => {
      const ins = t.insurance_type || "UMUM";
      if (ins.toUpperCase() === "BPJS") {
        bpjsAmount += t.total_tagihan;
      } else {
        umumAmount += t.total_tagihan;
      }
    });

    const total = umumAmount + bpjsAmount;
    if (total === 0) {
      return { umumPercent: 70, bpjsPercent: 30, umumVal: 308000, bpjsVal: 132000 };
    }

    const isFallback = transactions.length === fallbackTransactions.length &&
      transactions[0].no_invoice === fallbackTransactions[0].no_invoice;
    if (isFallback) {
      return { umumPercent: 70, bpjsPercent: 30, umumVal: 308000, bpjsVal: 132000 };
    }

    const umumPercent = Math.round((umumAmount / total) * 100);
    const bpjsPercent = 100 - umumPercent;
    return { umumPercent, bpjsPercent, umumVal: umumAmount, bpjsVal: bpjsAmount };
  }, [transactions, fallbackTransactions]);

  // Aging Schedule calculation: 1-2 Hari, 3-5 Hari, >7 Hari
  const agingData = useMemo(() => {
    let range1 = 0; // 1-2 Hari
    let range2 = 0; // 3-5 Hari
    let range3 = 0; // >7 Hari

    transactions.forEach(t => {
      if (t.hari_belum_lunas <= 2) {
        range1 += t.total_tagihan;
      } else if (t.hari_belum_lunas <= 5) {
        range2 += t.total_tagihan;
      } else {
        range3 += t.total_tagihan;
      }
    });

    if (range1 === 0 && range2 === 0 && range3 === 0) {
      return [
        { name: "1-2 Hari", amount: 220000 },
        { name: "3-5 Hari", amount: 100000 },
        { name: "> 7 Hari", amount: 120000 }
      ];
    }

    return [
      { name: "1-2 Hari", amount: range1 },
      { name: "3-5 Hari", amount: range2 },
      { name: "> 7 Hari", amount: range3 }
    ];
  }, [transactions]);

  // Top 3 Debtors
  const topDebtors = useMemo(() => {
    return [...transactions]
      .sort((a, b) => b.total_tagihan - a.total_tagihan)
      .slice(0, 3);
  }, [transactions]);

  // Logger helper
  const addAutoLog = (message: string) => {
    const time = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setAutoLogs(prev => [`[${time}] ${message}`, ...prev]);
  };

  // Send WhatsApp Reminder function
  const handleSendWa = async (invoice: LocalDaftarTransaksiBelumLunas) => {
    const id = invoice.no_invoice;
    setReminderStatuses(prev => ({ ...prev, [id]: "sending" }));

    try {
      const payload = {
        target: invoice.wa_number,
        nama_pasien: invoice.pasien,
        attachment_url: `https://klinik-pos.com/invoice/pdf/${invoice.no_invoice}`,
        filename: `${invoice.no_invoice}.pdf`,
        status_pembayaran: "Belum Lunas"
      };

      await analitikService.sendWaReminder(payload);

      setReminderStatuses(prev => ({ ...prev, [id]: "sent" }));
      setTransactions(prev =>
        prev.map(t => t.no_invoice === id ? { ...t, status_reminder: "Terkirim" } : t)
      );

      addAutoLog(`[Engine] WhatsApp berhasil dikirim ke ${invoice.pasien} (${invoice.no_invoice})`);

      setNotification({
        type: "success",
        message: `Reminder WhatsApp berhasil dikirim ke ${invoice.pasien} (${invoice.no_invoice})`
      });

      setTimeout(() => {
        setNotification(null);
      }, 4000);

    } catch (error) {
      console.error("Gagal mengirim reminder WA:", error);
      setReminderStatuses(prev => ({ ...prev, [id]: "error" }));

      addAutoLog(`[Engine] Gagal mengirim WhatsApp ke ${invoice.pasien} (${invoice.no_invoice})`);

      setNotification({
        type: "error",
        message: `Gagal mengirim reminder WA ke ${invoice.pasien}. Silakan coba lagi.`
      });

      setTimeout(() => {
        setNotification(null);
      }, 4000);
    }
  };

  // Update phone number handler
  const handleUpdatePhone = (invoiceId: string, newPhone: string) => {
    setTransactions(prev =>
      prev.map(t => t.no_invoice === invoiceId ? { ...t, wa_number: newPhone } : t)
    );

    addAutoLog(`[User] Memperbarui nomor WA invoice ${invoiceId} menjadi ${newPhone}`);

    setNotification({
      type: "success",
      message: `Nomor WhatsApp invoice ${invoiceId} berhasil diperbarui.`
    });
    setTimeout(() => setNotification(null), 3000);
  };

  // Simulation handler to add 5 mock bills to exceed threshold (>10)
  const handleAddMockInvoices = () => {
    const nextMockNum = transactions.filter(t => t.no_invoice.startsWith("INV-MOCK-")).length + 1;
    const newMocks: LocalDaftarTransaksiBelumLunas[] = [
      { no_invoice: `INV-MOCK-0${nextMockNum}`, pasien: "Joko Widodo", total_tagihan: 150000, hari_belum_lunas: 2, status_reminder: "Belum Dikirim", wa_number: "089988887777", insurance_type: "UMUM" },
      { no_invoice: `INV-MOCK-0${nextMockNum + 1}`, pasien: "Prabowo Subianto", total_tagihan: 200000, hari_belum_lunas: 1, status_reminder: "Belum Dikirim", wa_number: "089977776666", insurance_type: "BPJS" },
      { no_invoice: `INV-MOCK-0${nextMockNum + 2}`, pasien: "Megawati Soekarno", total_tagihan: 180000, hari_belum_lunas: 3, status_reminder: "Belum Dikirim", wa_number: "089966665555", insurance_type: "UMUM" },
      { no_invoice: `INV-MOCK-0${nextMockNum + 3}`, pasien: "Susilo Bambang Y.", total_tagihan: 250000, hari_belum_lunas: 2, status_reminder: "Belum Dikirim", wa_number: "089955554444", insurance_type: "BPJS" },
      { no_invoice: `INV-MOCK-0${nextMockNum + 4}`, pasien: "Abdurrahman Wahid", total_tagihan: 90000, hari_belum_lunas: 1, status_reminder: "Belum Dikirim", wa_number: "089944443333", insurance_type: "UMUM" },
    ];
    setTransactions(prev => [...prev, ...newMocks]);
    addAutoLog(`[User] Menambahkan 5 invoice simulasi. Jumlah antrean kini: ${transactions.length + 5}`);
  };

  // Background Auto-Reminder Logic: Triggered when queue size > 10 and bill age >= 24h (1 Day)
  useEffect(() => {
    if (transactions.length > 10) {
      // Filter out bills that are pending >= 1 day and are NOT sent/sending/error to avoid spamming
      const eligibleInvoices = transactions.filter(
        t => t.hari_belum_lunas >= 1 &&
             t.status_reminder !== "Terkirim" &&
             reminderStatuses[t.no_invoice] !== "sending" &&
             reminderStatuses[t.no_invoice] !== "sent" &&
             reminderStatuses[t.no_invoice] !== "error"
      );

      if (eligibleInvoices.length > 0) {
        addAutoLog(`[Engine] Antrean (${transactions.length} > 10). Memicu pengiriman otomatis untuk ${eligibleInvoices.length} tagihan overdue.`);
        
        eligibleInvoices.forEach(invoice => {
          addAutoLog(`[Engine] Auto-Send pemicu WA ke ${invoice.pasien} (${invoice.no_invoice})`);
          handleSendWa(invoice);
        });
      }
    }
  }, [transactions, reminderStatuses]);

  return (
    <div className="w-full space-y-6">
      
      {/* Dynamic Feedback Notification Bar */}
      {notification && (
        <div 
          className={cn(
            "p-4 rounded-2xl border flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4 duration-300",
            notification.type === "success" 
              ? "bg-[#DFF6F2] border-[#1B9C90]/30 text-[#1B9C90]" 
              : "bg-red-50 border-red-200 text-red-700"
          )}
        >
          <div className="flex items-center gap-3">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[#1B9C90]" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            )}
            <span className="text-xs sm:text-sm font-semibold">{notification.message}</span>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-xs font-bold hover:underline opacity-80 hover:opacity-100"
          >
            Tutup
          </button>
        </div>
      )}

      {/* 1. BAGIAN ATAS: 3 KARTU RINGKASAN UTAMA */}
      <PiutangSummaryCards
        totalPiutang={totalPiutang}
        totalPendingTransactions={totalPendingTransactions}
        averageDelayDays={averageDelayDays}
        piutangRatioPercentage={piutangRatioPercentage}
      />

      {/* 2. AUTO-REMINDER SYSTEM MONITOR & SIMULATOR */}
      <PiutangAutoReminderMonitor
        transactionsCount={transactions.length}
        autoLogs={autoLogs}
        onAddMockInvoices={handleAddMockInvoices}
        onClearLogs={() => setAutoLogs([])}
      />

      {/* 3. BAGIAN TENGAH: GRAFIK & BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <PiutangAgingChart agingData={agingData} />
        <PiutangBreakdown 
          breakdownProportion={breakdownProportion} 
          topDebtors={topDebtors} 
        />
      </div>

      {/* 4. ACTIONABLE TABLE: TABEL AKSI & REMINDER WA */}
      <PiutangActionTable
        transactions={transactions}
        reminderStatuses={reminderStatuses}
        onSendWa={handleSendWa}
        onUpdatePhone={handleUpdatePhone}
      />
    </div>
  );
}
