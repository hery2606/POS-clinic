import { PaymentPanel } from "../components/payment/PaymentPanel";
import { TransactionDetail } from "../components/RiwayatTransaksi/Transactiondetail";
import { PatientDetail } from "../components/dataPasien/PatientDetail";
import { NotificationPanel } from "../components/notification/NotificationPanel";
import { StockDetailView } from "../components/StokObat/StockDetailView";
import { useRightPanel } from "../context/right-panel-context";
import { useRightPanelTitle } from "@/hooks/useRightPanelTitle";
import { LayoutGrid } from "lucide-react";

export function RightPanel() {
  const { contentType, data, clearContent } = useRightPanel();
  const title = useRightPanelTitle(contentType);

  return (
    <aside className="w-100 border-l bg-white flex flex-col h-screen sticky top-0 overflow-hidden animate-in fade-in duration-500">
      {/* Header - Title */}
      {contentType && (
        <div className="px-6 py-6 border-b-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {contentType === "payment" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <PaymentPanel />
          </div>
        )}

        {contentType === "transaction-detail" && (
          <div className="flex-1 p-6 flex flex-col justify-center overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <TransactionDetail transaction={data} />
          </div>
        )}

        {contentType === "patient-detail" && (
          <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <PatientDetail patient={data} />
          </div>
        )}

        {contentType === "notification" && (
          <div className="flex-1 overflow-hidden flex">
            <NotificationPanel />
          </div>
        )}

        {contentType === "stock-detail" && (
          <div className="flex-1 overflow-y-auto">
            <StockDetailView 
              item={data.stock} 
              onBack={() => {
                clearContent();
              }}
            />
          </div>
        )}

        {!contentType && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 text-slate-400">
            <LayoutGrid className="w-12 h-12 opacity-50" />
            <p className="text-sm">Pilih data untuk melihat detail</p>
          </div>
        )}
      </div>
    </aside>
  );
}
