import { useRightPanel } from '@/features/kasir/context/right-panel-context';
import { cn } from '@/lib/utils';

export interface PaymentHeaderProps {
  className?: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const PaymentHeader = ({ className }: PaymentHeaderProps) => {
  const { data } = useRightPanel();

  const patientName = data?.patientName || 'Nama Pasien';
  const total = data?.total || 0;

  return (
    <div className={cn(
      "bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 rounded-[16px]",
      className
    )}>
      <div className="p-6 space-y-4">
        {/* Patient Name */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Nama Pasien
          </p>
          <p className="text-lg font-bold text-slate-900">
            {patientName}
          </p>
        </div>

        {/* Total Payment */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Total Pembayaran
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#29B5A8]">
              {formatCurrency(total)}
            </span>
            {total > 0 && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                Siap Dibayar
              </span>
            )}
          </div>
        </div>

        {/* Payment Source Info */}
        {data?.source && (
          <div className="pt-4 border-t border-slate-100">
            <span className={cn(
              "inline-block px-3 py-1 rounded-full text-xs font-semibold",
              data.source === 'obat'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-emerald-100 text-emerald-700'
            )}>
              {data.source === 'obat' ? '💊 Pembayaran Obat' : '🏥 Pembayaran Medis'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
