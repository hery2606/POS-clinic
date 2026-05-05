import { Card } from "@/components/ui/card";

export const QrisDisplay = () => {
  return (
    <Card className="mt-6 border-slate-100 rounded-[32px] p-8 flex flex-col items-center justify-center bg-slate-50/30">
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 border border-slate-100">
        {/* Placeholder QR Code - Kamu bisa gunakan library qrcode.react di sini */}
        <div className="w-40 h-40 bg-slate-100 flex items-center justify-center rounded-lg border-2 border-dashed border-slate-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center px-4">
            QRIS Code Generator
          </span>
        </div>
      </div>
      <p className="text-sm font-bold text-slate-500 text-center leading-relaxed max-w-50">
        Scan QRIS dengan aplikasi e-wallet atau M-Banking
      </p>
    </Card>
  );
};