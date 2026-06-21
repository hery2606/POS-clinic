import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { KpiCards } from "@/features/analitik/components/dashboard/KPICards";
import { AiInsightBanner } from "@/features/analitik/components/dashboard/components/AiInsightBanner";
import { ChartBarMixed } from "@/features/analitik/components/dashboard/components/ChartBarMixed";
import { ChartBarStacked } from "@/features/analitik/components/dashboard/components/ChartBarStacked";
import { PaymentMethodChart } from "@/features/analitik/components/dashboard/components/PaymentMethodChart";
import { InvoiceReminderTable } from "@/features/analitik/components/dashboard/InvoiceReminderTable";
import { ChartAreaInteractive } from "@/features/analitik/components/dashboard/components/ChartAreaInteractive";
import { Card } from "@/components/ui/card";
import { analitikService } from "@/features/analitik/services/analitik.service";
import { type LocalDaftarTransaksiBelumLunas } from "@/features/analitik/components/laporan/Piutang/types";

export const DashboardPage = () => {
  // Queries
  const pendingInvoicesQuery = useQuery({
    queryKey: ["pendingInvoices"],
    queryFn: () => analitikService.getPendingInvoices(),
    staleTime: 5 * 60 * 1000,
  });

  const [invoices, setInvoices] = useState<LocalDaftarTransaksiBelumLunas[]>([]);
  const [reminderStatuses, setReminderStatuses] = useState<Record<string, "idle" | "sending" | "sent" | "error">>({});

  useEffect(() => {
    const dataApi: any = pendingInvoicesQuery.data;
    const daftar = dataApi?.daftar_transaksi_belum_lunas || dataApi?.data?.daftar_transaksi_belum_lunas || [];

    if (daftar && daftar.length > 0) {
      const mapped: LocalDaftarTransaksiBelumLunas[] = daftar.map((item: any) => ({
        no_invoice: item.no_invoice,
        pasien: item.pasien,
        total_tagihan: item.sisa_tagihan || 0,
        hari_belum_lunas: item.hari_belum_lunas || 0,
        status_reminder: item.status_reminder || "Belum Dikirim",
        wa_number: item.wa_number || `0812${String(Math.floor(10000000 + Math.random() * 90000000))}`,
        insurance_type: item.insurance_type || "UMUM"
      }));
      setInvoices(mapped);
    } else {
      setInvoices([]);
    }
  }, [pendingInvoicesQuery.data]);

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
      setInvoices(prev =>
        prev.map(t => t.no_invoice === id ? { ...t, status_reminder: "Terkirim" } : t)
      );
    } catch (error) {
      console.error("Gagal mengirim reminder WA:", error);
      setReminderStatuses(prev => ({ ...prev, [id]: "error" }));
    }
  };

  const handleUpdatePhone = (invoiceId: string, newPhone: string) => {
    setInvoices(prev =>
      prev.map(t => t.no_invoice === invoiceId ? { ...t, wa_number: newPhone } : t)
    );
  };

  return (
    <div className="min-h-screen  p-6">
      {/* AI Insight Banner */}
      <div className="mb-8">
        <AiInsightBanner />
        <div className="mt-6">
          <ChartAreaInteractive />
        </div>
      </div>

      {/* KPI Card */}
      <div>
        <h2 className="text-xl font-bold text-[#13222D] mb-4">Metrik Utama</h2>
        <KpiCards />
      </div>

      {/* Bar Charts - 2 Columns */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm">
          <ChartBarStacked />
        </Card>
        <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm">
          <ChartBarMixed />
        </Card>
      </div>
      <div className="mt-12 grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <div className="xl:col-span-5 flex">
          <PaymentMethodChart />
        </div>
        <div className="xl:col-span-7 flex">
          {pendingInvoicesQuery.isLoading ? (
            <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm w-full flex items-center justify-center min-h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin text-[#1B9C90]" />
            </Card>
          ) : pendingInvoicesQuery.error ? (
            <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm w-full flex items-center justify-center min-h-[300px] text-red-500 font-bold">
              Gagal memuat data invoice tertunda.
            </Card>
          ) : (
            <InvoiceReminderTable
              invoices={invoices}
              reminderStatuses={reminderStatuses}
              onSendWa={handleSendWa}
              onUpdatePhone={handleUpdatePhone}
            />
          )}
        </div>
      </div>
    </div>
  );
};
