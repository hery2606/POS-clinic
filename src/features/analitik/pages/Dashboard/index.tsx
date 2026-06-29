import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { KpiCards } from "@/features/analitik/components/dashboard/KPICards";
import { AiInsightBannerV2 } from "@/features/analitik/components/dashboard/components/AiInsightBannerV2";
import { ChartBarMixed } from "@/features/analitik/components/dashboard/components/ChartBarMixed";
import { ChartBarStacked } from "@/features/analitik/components/dashboard/components/ChartBarStacked";
import { PaymentMethodChart } from "@/features/analitik/components/dashboard/components/PaymentMethodChart";
import { InvoiceReminderTable } from "@/features/analitik/components/dashboard/InvoiceReminderTable";
import { ChartAreaInteractive } from "@/features/analitik/components/dashboard/components/ChartAreaInteractive";
import { Card } from "@/components/ui/card";
import { analitikService } from "@/features/analitik/services/analitik.service";
import { type LocalDaftarTransaksiBelumLunas } from "@/features/analitik/components/laporan/Piutang/types";
import { useDashboardPdfData } from "@/features/analitik/hooks/useDashboardPdfData";
import { usePdfDownload } from "@/hooks/usePdfDownload.tsx";

export const DashboardPage = () => {
  const context = useOutletContext<any>();
  const y = String(new Date().getFullYear());
  
  const filters = {
    selectedPeriod: context?.selectedPeriod ?? "daily",
    monthlyYear: context?.monthlyYear ?? y,
    startMonth: context?.startMonth ?? "3",
    endMonth: context?.endMonth ?? "6",
    startYear: context?.startYear ?? String(+y - 1),
    endYear: context?.endYear ?? y,
  };

  const refs = { chartArea: useRef<HTMLDivElement>(null), chartBarMixed: useRef<HTMLDivElement>(null), chartBarStacked: useRef<HTMLDivElement>(null) };
  const [activeLabel, setActiveLabel] = useState("Hari Ini (Aktif)");
  const dashboardPdfData = useDashboardPdfData(activeLabel, filters);
  const { downloadPdf, isLoading: isPdfLoading } = usePdfDownload({ chartRefs: refs, data: dashboardPdfData });

  // ponytail: consolidate global event dispatches
  useEffect(() => {
    const d = (n: string, detail: any) => window.dispatchEvent(new CustomEvent(n, { detail }));
    d("dashboard-pdf-loading", { loading: isPdfLoading });
    d("dashboard-pdf-ready", { isReady: dashboardPdfData.isReady });
  }, [isPdfLoading, dashboardPdfData.isReady]);

  useEffect(() => {
    const onTrigger = (e: any) => {
      setActiveLabel(e.detail?.periodLabel || "Hari Ini (Aktif)");
      setTimeout(downloadPdf, 150);
    };
    window.addEventListener("trigger-dashboard-pdf-download", onTrigger);
    return () => window.removeEventListener("trigger-dashboard-pdf-download", onTrigger);
  }, [downloadPdf]);

  const { data: rawInvoices, isLoading: invoicesLoading, error: invoicesError } = useQuery({
    queryKey: ["pendingInvoices"],
    queryFn: analitikService.getPendingInvoices,
    staleTime: 300000,
  });

  const [invoices, setInvoices] = useState<LocalDaftarTransaksiBelumLunas[]>([]);
  const [statuses, setStatuses] = useState<Record<string, any>>({});

  useEffect(() => {
    const d: any = rawInvoices;
    const items = d?.daftar_transaksi_belum_lunas || d?.data?.daftar_transaksi_belum_lunas || [];
    setInvoices(items.map((i: any) => ({
      no_invoice: i.no_invoice, pasien: i.pasien,
      total_tagihan: i.sisa_tagihan || 0, hari_belum_lunas: i.hari_belum_lunas || 0,
      status_reminder: i.status_reminder || "Belum Dikirim",
      wa_number: i.wa_number || "081200001111", // ponytail: static mock over randomizer Math.floor
      insurance_type: i.insurance_type || "UMUM"
    })));
  }, [rawInvoices]);

  const handleSendWa = async (i: LocalDaftarTransaksiBelumLunas) => {
    setStatuses(p => ({ ...p, [i.no_invoice]: "sending" }));
    try {
      await analitikService.sendWaReminder({
        target: i.wa_number, nama_pasien: i.pasien, status_pembayaran: "Belum Lunas",
        attachment_url: `https://klinik-pos.com/invoice/pdf/${i.no_invoice}`, filename: `${i.no_invoice}.pdf`,
      });
      setStatuses(p => ({ ...p, [i.no_invoice]: "sent" }));
      setInvoices(p => p.map(t => t.no_invoice === i.no_invoice ? { ...t, status_reminder: "Terkirim" } : t));
    } catch {
      setStatuses(p => ({ ...p, [i.no_invoice]: "error" }));
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mb-8">
        <AiInsightBannerV2 />
        <div className="mt-6" ref={refs.chartArea}><ChartAreaInteractive filters={filters} /></div>
      </div>

      <h2 className="text-xl font-bold text-[#13222D] mb-4">Metrik Utama</h2>
      <KpiCards filters={filters} />

      {/* ponytail: removed wrapper divs by passing ref directly to shadcn Card */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card ref={refs.chartBarStacked} className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm"><ChartBarStacked filters={filters} /></Card>
        <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm"><ChartBarMixed filters={filters} /></Card>
      </div>

      <div className="mt-12 grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <div className="xl:col-span-5 flex" ref={refs.chartBarMixed}><PaymentMethodChart filters={filters} /></div>
        <div className="xl:col-span-7 flex">
          {invoicesLoading ? (
            <Card className="bg-white rounded-[24px] border-[#DFE6EB] p-6 shadow-sm w-full flex items-center justify-center min-h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin text-[#1B9C90]" />
            </Card>
          ) : invoicesError ? (
            <Card className="bg-white rounded-[24px] border-[#DFE6EB] p-6 shadow-sm w-full flex items-center justify-center min-h-[300px] text-red-500 font-bold">
              Gagal memuat data invoice tertunda.
            </Card>
          ) : (
            <InvoiceReminderTable
              invoices={invoices} reminderStatuses={statuses}
              onSendWa={handleSendWa} onUpdatePhone={(id, wa) => setInvoices(p => p.map(t => t.no_invoice === id ? { ...t, wa_number: wa } : t))}
            />
          )}
        </div>
      </div>
    </div>
  );
};
