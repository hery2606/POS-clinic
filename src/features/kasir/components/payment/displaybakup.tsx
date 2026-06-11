"use client"

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, RefreshCw, Clock } from "lucide-react";
import { paymentService } from "../../services/payment.service";

interface QrisDisplayProps {
  transactionId: string;
  amount: number;
  token?: string;
  qrUrl?: string;
  forceCheckTrigger?: number;
  qrContent?: string;
  onSuccess: (statusData: any) => void;
  onCancel: () => void;
}

export const QrisDisplay = ({
  transactionId,
  amount,
  token,
  qrUrl,
  qrContent,
  onSuccess,
  onCancel,
}: QrisDisplayProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed">("pending");
  const [timeLeft, setTimeLeft] = useState(900);
  const [checkingStatus, setCheckingStatus] = useState(false);
  
  const pollingIntervalRef = useRef<number | null>(null);

  const loadSnapScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).snap) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      const isProd = import.meta.env.PROD || import.meta.env.VITE_API_INTERNAL_URL?.includes("production");
      script.src = isProd
        ? "https://app.midtrans.com/snap/snap.js"
        : "https://app.sandbox.midtrans.com/snap/snap.js";

      const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "";
      if (clientKey) {
        script.setAttribute("data-client-key", clientKey);
      }

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckStatus = async (silent = false) => {
    if (!silent) setCheckingStatus(true);
    try {
      const response = await paymentService.checkStatus(transactionId);
      
      const rawStatus = response?.data?.status || response?.data?.transactionStatus;
      
      if (rawStatus) {
        const normalizedStatus = rawStatus.toLowerCase();
        if (
          normalizedStatus === "settlement" ||
          normalizedStatus === "success" ||
          normalizedStatus === "capture" ||
          normalizedStatus === "lunas"
        ) {
          setPaymentStatus("success");
          if (pollingIntervalRef.current) window.clearInterval(pollingIntervalRef.current);
          
          setTimeout(() => {
            onSuccess(response);
          }, 2000);
        } else if (
          normalizedStatus === "deny" ||
          normalizedStatus === "cancel" ||
          normalizedStatus === "expire" ||
          normalizedStatus === "failed"
        ) {
          setPaymentStatus("failed");
          if (pollingIntervalRef.current) window.clearInterval(pollingIntervalRef.current);
        }
      }
    } catch (err) {
      console.error("Gagal memeriksa status pembayaran:", err);
      if (!silent) setError("Gagal memeriksa status pembayaran. Silakan coba lagi.");
    } finally {
      if (!silent) setCheckingStatus(false);
    }
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setPaymentStatus("failed");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const initializePayment = async () => {
      setLoading(true);
      setError(null);

      try {
        if (token) {
          const scriptLoaded = await loadSnapScript();
          if (scriptLoaded && (window as any).snap) {
            (window as any).snap.embed(token, {
              embedId: "midtrans-snap-container",
              onSuccess: (result: any) => {
                console.log("Snap Success:", result);
                setPaymentStatus("success");
                onSuccess(result);
              },
              onPending: (result: any) => {
                console.log("Snap Pending:", result);
              },
              onError: (result: any) => {
                console.error("Snap Error:", result);
                setError("Terjadi kesalahan pada pembayaran Snap.");
              },
              onClose: () => {
                console.log("Snap Closed");
              },
            });
          } else {
            setError("Gagal memuat sistem pembayaran Midtrans Snap.");
          }
        }
      } catch (err) {
        console.error("Inisialisasi pembayaran gagal:", err);
        setError("Gagal memulai sistem pembayaran QRIS.");
      } finally {
        setLoading(false);
      }
    };

    initializePayment();

    pollingIntervalRef.current = window.setInterval(() => {
      handleCheckStatus(true);
    }, 5000);

    return () => {
      window.clearInterval(timer);
      if (pollingIntervalRef.current) window.clearInterval(pollingIntervalRef.current);
    };
  }, [token, transactionId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const qrImageSrc = qrUrl || (qrContent ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrContent)}` : null);

  return (
    <div className="flex flex-col items-center w-full mt-2">
      <div className="w-full flex justify-between items-center mb-6">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          ID: {transactionId}
        </span>
        <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {paymentStatus === "pending" && (
        <div className="w-full flex flex-col items-center">
          {token && (
            <div className="w-full flex flex-col items-center">
              {loading && (
                <div className="flex flex-col items-center justify-center min-h-[200px]">
                  <Loader2 className="w-10 h-10 text-[#1B9C90] animate-spin mb-3" />
                  <p className="text-xs font-semibold text-slate-400">Memuat Gerbang Pembayaran...</p>
                </div>
              )}
              <div 
                id="midtrans-snap-container" 
                className={`w-full min-h-[450px] border border-slate-100 rounded-2xl overflow-hidden shadow-inner bg-slate-50 transition-all duration-300 ${loading ? "opacity-0 h-0" : "opacity-100"}`}
              />
            </div>
          )}

          {!token && qrImageSrc && (
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-2xl shadow-md mb-6 border border-slate-100 relative group">
                <img 
                  src={qrImageSrc} 
                  alt="QRIS Code" 
                  className="w-48 h-48 object-contain transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center px-4">
                    Pindai untuk Membayar
                  </span>
                </div>
              </div>
              <p className="text-xs font-bold text-slate-600 text-center uppercase tracking-wider mb-2">
                Total QRIS: Rp {amount.toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-slate-400 text-center leading-relaxed max-w-xs">
                Silakan scan QRIS di atas dengan aplikasi e-wallet (Gopay, OVO, Dana, ShopeePay) atau M-Banking Anda.
              </p>
            </div>
          )}

          {!token && !qrImageSrc && !loading && (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
              <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
              <p className="text-sm font-bold text-slate-700">Kode QRIS Tidak Tersedia</p>
              <p className="text-xs text-slate-400 mt-1">Gagal membuat data pembayaran QRIS.</p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 w-full">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="text-xs font-bold text-red-700">{error}</span>
            </div>
          )}

          <div className="w-full grid grid-cols-2 gap-3 mt-6 border-t border-slate-100 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="h-11 rounded-xl border-slate-200 text-slate-600 font-bold text-xs"
            >
              Kembali
            </Button>
            <Button
              onClick={() => handleCheckStatus()}
              disabled={checkingStatus}
              className="h-11 rounded-xl bg-[#1B9C90] hover:bg-[#158076] text-white font-bold text-xs flex items-center justify-center gap-1.5 border-none shadow-sm shadow-[#1B9C90]/10"
            >
              {checkingStatus ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              Cek Status
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};