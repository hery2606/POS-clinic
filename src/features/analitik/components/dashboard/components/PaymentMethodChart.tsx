'use client';

import React, { useEffect, useState } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { analitikService } from '@/features/analitik/services/analitik.service';

interface PaymentData {
  name: string;
  value: number;
  amount: string;
  color: string;
  count: number;
}

interface PaymentMethodChartProps {
  className?: string;
}

const colorPalette = [
  '#1B9C90', // Teal (QRIS)
  '#F2A618', // Orange/Amber (Debit)
  '#2297eb', // Blue (Cash)
  '#8E59FF', // Purple (Transfer)
  '#E62C2C', // Red (Lainnya)
  '#E62C9C', // Pink
  '#13222D', // Slate
  '#84DFD4', // Light Teal
];

const getColorForMethod = (method: string, index: number): string => {
  const norm = method.trim().toUpperCase();
  if (norm === 'QRIS') return '#1B9C90';
  if (norm === 'DEBIT') return '#F2A618';
  if (norm === 'CASH' || norm === 'TUNAI') return '#2297eb';
  if (norm === 'TRANSFER') return '#8E59FF';
  
  return colorPalette[index % colorPalette.length];
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    notation: 'compact',
    maximumFractionDigits: 0
  }).format(value);
};

const ChartSkeleton = () => (
  <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm w-full flex flex-col justify-between">
    <div>
      <Skeleton className="h-6 w-48 mb-6" />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-4">
        <div className="relative w-36 h-36 flex-shrink-0 mx-auto sm:mx-0">
          <Skeleton className="w-full h-full rounded-full" />
        </div>
        <div className="space-y-3 flex-1 w-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      </div>
    </div>
  </Card>
);

export const PaymentMethodChart: React.FC<PaymentMethodChartProps> = ({ className }) => {
  const [paymentData, setPaymentData] = useState<PaymentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await analitikService.getPaymentsAnalytics();
        
        if (response.status === 'success' && response.data) {
          const data = response.data;
          
          let persentaseMetode = data.persentase_metode || [];
          
          // Fallback: If empty, calculate from tren_metode_favorit
          if (persentaseMetode.length === 0 && data.tren_metode_favorit && data.tren_metode_favorit.length > 0) {
            // Find the most recent month with active transactions
            const activeMonth = [...data.tren_metode_favorit].reverse().find(
              m => (m.qris || 0) + (m.cash || 0) + (m.debit || 0) > 0
            );
            
            if (activeMonth) {
              const qrisVal = activeMonth.qris || 0;
              const cashVal = activeMonth.cash || 0;
              const debitVal = activeMonth.debit || 0;
              const total = qrisVal + cashVal + debitVal;
              
              if (total > 0) {
                persentaseMetode = [
                  { metode: 'QRIS', persentase: Math.round((qrisVal / total) * 1000) / 10, total_nominal: qrisVal },
                  { metode: 'CASH', persentase: Math.round((cashVal / total) * 1000) / 10, total_nominal: cashVal },
                  { metode: 'DEBIT', persentase: Math.round((debitVal / total) * 1000) / 10, total_nominal: debitVal }
                ].filter(item => item.total_nominal > 0);
              }
            }
          }
          
          if (persentaseMetode.length === 0) {
            setPaymentData([]);
          } else {
            // Map API data to PaymentData
            const mappedPaymentData: PaymentData[] = persentaseMetode.map((item, index) => ({
              name: item.metode,
              value: item.persentase,
              amount: formatCurrency(item.total_nominal),
              color: getColorForMethod(item.metode, index),
              count: Math.round(item.total_nominal / 10000) // Estimasi count dari nominal
            }));
            
            setPaymentData(mappedPaymentData);
          }
        }
      } catch (err) {
        console.error('Error fetching payments analytics:', err);
        setError('Gagal memuat data metode pembayaran');
        setPaymentData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (error) {
    return (
      <Card className={`bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm w-full flex flex-col justify-between ${className}`}>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </Card>
    );
  }

  const topMethod = paymentData[0];

  return (
    <Card className={`bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm w-full flex flex-col justify-between ${className}`}>
      <div>
        <h3 className="text-lg font-bold text-[#13222D] mb-6">
          Metode Pembayaran
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-4">
          {/* Donut Chart */}
          <div className="relative w-36 h-36 flex-shrink-0 mx-auto sm:mx-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData.length > 0 ? paymentData : [{ value: 1, color: '#F4F7F9' }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={62}
                  paddingAngle={paymentData.length > 0 ? 3 : 0}
                  dataKey="value"
                  isAnimationActive={paymentData.length > 0}
                >
                  {(paymentData.length > 0 ? paymentData : [{ color: '#F4F7F9' }]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#F4F7F9'} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                {topMethod ? (
                  <>
                    <span className="text-sm font-bold text-[#13222D] block">{topMethod.name} {topMethod.value}%</span>
                    <span className="text-xs text-[#67737C]">({topMethod.count} transaksi)</span>
                  </>
                ) : (
                  <span className="text-sm font-bold text-slate-300 block">N/A</span>
                )}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3 flex-1 w-full">
            {paymentData.length > 0 ? (
              paymentData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3.5 h-3.5 rounded-full shrink-0" 
                      style={{ backgroundColor: item.color }} 
                    />
                    <span className="font-semibold text-[#67737C]">{item.name}</span>
                  </div>
                  <span className="font-bold text-[#13222D]">{item.amount}</span>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium">
                Belum ada data pembayaran
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};