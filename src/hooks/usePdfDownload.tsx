import { useState, type RefObject } from "react";

interface UsePdfDownloadProps {
  chartRefs: {
    chartArea: RefObject<HTMLDivElement | null>;
    chartBarMixed: RefObject<HTMLDivElement | null>;
    chartBarStacked: RefObject<HTMLDivElement | null>;
  };
  data: any;
}

export const usePdfDownload = ({ chartRefs, data }: UsePdfDownloadProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const captureChart = async (
    ref: RefObject<HTMLDivElement | null>,
    layoutType: "wide" | "half" = "wide"
  ): Promise<string | undefined> => {
    if (!ref.current) return undefined;
    try {
      // Tentukan dimensi ideal yang konsisten (tidak tergantung resolusi layar user)
      const idealWidth = layoutType === "wide" ? 1100 : 600;
      const idealHeight = 320;

      // Cek apakah di dalam ref terdapat PaymentMethodChart (memiliki legend di luar wrapper chart)
      const hasPaymentLegend = ref.current.querySelector('.space-y-3.flex-1.w-full') !== null;
      const chartContainer = hasPaymentLegend
        ? (ref.current.querySelector('.recharts-responsive-container')?.parentElement?.parentElement as HTMLElement)
        : (ref.current.querySelector('.recharts-responsive-container')?.parentElement as HTMLElement) || ref.current;

      // 1. Simpan styles asli dari elemen aktif
      const originalStyleWidth = chartContainer.style.width;
      const originalStyleHeight = chartContainer.style.height;
      const originalStyleMaxWidth = chartContainer.style.maxWidth;
      const originalStylePosition = chartContainer.style.position;

      // 2. Simpan styles asli dari elemen donut jika ada
      let originalDonutWidth = "";
      let originalDonutHeight = "";
      const donutWrapper = ref.current.querySelector('.relative.w-36.h-36') as HTMLElement;
      if (hasPaymentLegend && donutWrapper) {
        originalDonutWidth = donutWrapper.style.width;
        originalDonutHeight = donutWrapper.style.height;
      }

      // 3. Paksa ukuran ideal pada DOM aktif secara langsung agar Recharts mendeteksi ukuran baru via ResizeObserver
      chartContainer.style.setProperty("width", `${idealWidth}px`, "important");
      if (!hasPaymentLegend) {
        chartContainer.style.setProperty("height", `${idealHeight}px`, "important");
      }
      chartContainer.style.setProperty("max-width", "none", "important");

      if (hasPaymentLegend && donutWrapper) {
        donutWrapper.style.setProperty("width", "180px", "important");
        donutWrapper.style.setProperty("height", "180px", "important");
      }

      // 4. Beri jeda kecil (150ms) agar Recharts melakukan render ulang (reflow/recalculate SVG paths)
      await new Promise((resolve) => setTimeout(resolve, 150));

      // 5. Lakukan penangkapan screenshot menggunakan html2canvas-pro secara dinamis
      const html2canvas = (await import("html2canvas-pro")).default;
      const canvas = await html2canvas(chartContainer, {
        scale: 2.5, // Kualitas HD
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const dataUrl = canvas.toDataURL("image/png");

      // 6. Kembalikan styles asli dari DOM aktif
      chartContainer.style.width = originalStyleWidth;
      chartContainer.style.height = originalStyleHeight;
      chartContainer.style.maxWidth = originalStyleMaxWidth;
      chartContainer.style.position = originalStylePosition;

      if (hasPaymentLegend && donutWrapper) {
        donutWrapper.style.width = originalDonutWidth;
        donutWrapper.style.height = originalDonutHeight;
      }

      return dataUrl;
    } catch (err) {
      console.warn("⚠️ Gagal menangkap gambar chart:", err);
      return undefined;
    }
  };

  const downloadPdf = async () => {
    if (isLoading || !data.isReady) return;
    setIsLoading(true);

    try {
      console.log("🔄 Memulai pengambilan screenshot chart...");
      // Ambil gambar secara berurutan dengan tipe layout ideal masing-masing
      const chartBarStacked = await captureChart(chartRefs.chartBarStacked, 'half');
      const chartBarMixed = await captureChart(chartRefs.chartBarMixed, 'half');

      console.log("📄 Memulai generasi dokumen PDF formal...");
      const [{ pdf }, { DashboardPdfTemplate }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("../features/analitik/components/print/dashboard-pdf-template")
      ]);

      const doc = (
        <DashboardPdfTemplate
          data={data}
          charts={{
            chartBarMixed,
            chartBarStacked,
          }}
        />
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.width = "0px";
      iframe.style.height = "0px";
      iframe.style.border = "none";
      iframe.style.top = "-9999px";
      iframe.src = url;
      document.body.appendChild(iframe);

      iframe.onload = () => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.warn("Gagal membuka print dialog lewat iframe:", e);
          window.open(url, "_blank");
        }
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
        }, 3000);
      };
      console.log("✅ Print preview laporan PDF berhasil dimuat!");
    } catch (error) {
      console.error("❌ Gagal mengunduh laporan PDF:", error);
      alert("Gagal mengunduh laporan PDF. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return { downloadPdf, isLoading };
};
