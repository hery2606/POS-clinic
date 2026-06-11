"use client";

import { useEffect, useState, useRef } from "react";
import { paymentService } from "../../../services/payment.service";

interface QrisPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  invoiceId: string;
  qrisData: {
    transactionId: string;
    amount: number;
    token?: string;
    qrUrl?: string;
    qrContent?: string;
  } | null;
  onPaymentSuccess: (amount: number) => void;
}

export const QrisPaymentModal = ({
  isOpen,
  onClose,
  qrisData,
  onPaymentSuccess,
}: QrisPaymentModalProps) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const pollingRef = useRef<number | null>(null);

  // Load script snap.js resmi dari Sandbox Midtrans
  useEffect(() => {
    if ((window as any).snap) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "";
    if (clientKey) {
      script.setAttribute("data-client-key", clientKey);
    }

    script.onload = () => setScriptLoaded(true);
    script.onerror = () => console.error("Gagal memuat SDK Midtrans Snap UI");
    
    document.body.appendChild(script);
  }, []);

  // Handler utama saat transaksi sukses terdeteksi (baik dari callback maupun polling)
  const handleSuccessTrigger = () => {
    if (pollingRef.current) {
      window.clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    // Tutup pop-up snap secara paksa lewat global object Midtrans jika masih menggantung
    if ((window as any).snap && typeof (window as any).snap.hide === "function") {
      (window as any).snap.hide();
    }
    onClose();
    if (qrisData) {
      onPaymentSuccess(qrisData.amount);
    }
  };

  // Setup pemicu Jendela Melayang Snap Pop-up
  useEffect(() => {
    if (isOpen && qrisData?.token && scriptLoaded && (window as any).snap) {
      
      (window as any).snap.pay(qrisData.token, {
        onSuccess: (result: any) => {
          console.log("Midtrans Pop-up Sukses Terbayar:", result);
          handleSuccessTrigger();
        },
        onPending: (result: any) => {
          console.log("Transaksi Tertunda (Pending):", result);
          onClose();
        },
        onError: (result: any) => {
          console.error("Metode Pembayaran Gagal diakses:", result);
          onClose();
        },
        onClose: () => {
          console.log("Pengguna menutup pop-up Midtrans.");
          if (pollingRef.current) {
            window.clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          onClose();
        },
      });

      // 🟢 TRICK PRESENTASI: Jalankan Background Polling Status otomatis setiap 3 detik
      // Jika status berubah jadi lunas di server, pop-up langsung menutup otomatis tanpa bolak-balik web
      pollingRef.current = window.setInterval(async () => {
        try {
          const response = await paymentService.checkStatus(qrisData.transactionId);
          const rawStatus = response?.data?.status || response?.data?.transactionStatus;
          
          if (rawStatus) {
            const normalizedStatus = rawStatus.toLowerCase();
            if (
              normalizedStatus === "settlement" ||
              normalizedStatus === "success" ||
              normalizedStatus === "capture" ||
              normalizedStatus === "lunas"
            ) {
              console.log("🟢 Polling mendeteksi transaksi LUNAS di server!");
              handleSuccessTrigger();
            }
          }
        } catch (err) {
          console.error("Gagal melakukan auto-check status via polling modal:", err);
        }
      }, 3000);
    }

    return () => {
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [isOpen, qrisData, scriptLoaded]);

  return null;
};