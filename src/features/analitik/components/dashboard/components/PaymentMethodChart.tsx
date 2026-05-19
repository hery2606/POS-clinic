'use client';

import React, { useEffect, useState } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { analitikService } from '../../services/analitik.service';

interface PaymentData {
  name: string;
  value: number;
  amount: string;
  color: string;
  count: number;
}

interface PatientData {
  name: string;
  percentage: number;
  count: number;
  total: number;
}

interface PaymentMethodChartProps {
  className?: string;
}

const colorMap: { [key: string]: string } = {
  'QRIS': '#1B9C90',
  'Debit': '#F2A618',
  'Cash': '#DFF6F2',
};

const defaultPaymentData: PaymentData[] = [
  { name: 'QRIS', value: 55, amount: 'Rp 68M', color: '#1B9C90', count: 1100 },
  { name: 'Debit', value: 25, amount: 'Rp 31M', color: '#F2A618', count: 500 },
  { name: 'Cash', value: 20, amount: 'Rp 25M', color: '#DFF6F2', count: 400 },
];

const defaultPatientData: PatientData[] = [
  { name: 'Pasien Baru', percentage: 35, count: 1050, total: 3000 },
  { name: 'Pasien Lama', percentage: 65, count: 1950, total: 3000 },
];

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
    <div>
      <Separator className="bg-[#DFE6EB] my-6" />
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="text-center">
            <Skeleton className="h-4 w-20 mx-auto mb-2" />
            <Skeleton className="h-6 w-16 mx-auto mb-1" />
            <Skeleton className="h-3 w-24 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  </Card>
);

export const PaymentMethodChart: React.FC<PaymentMethodChartProps> = ({ className }) => {
  const [paymentData, setPaymentData] = useState<PaymentData[]>(defaultPaymentData);
  const [patientData, setPatientData] = useState<PatientData[]>(defaultPatientData);
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
          
          // Map API data to PaymentData
          const mappedPaymentData: PaymentData[] = data.persentase_metode.map((item) => ({
            name: item.metode,
            value: item.persentase,
            amount: formatCurrency(item.total_nominal),
            color: colorMap[item.metode] || '#999999',
            count: Math.round(item.total_nominal / 10000) // Estimasi count dari nominal
          }));
          
          setPaymentData(mappedPaymentData);
          
          // Gunakan default patient data karena API tidak menyediakan data pasien
          setPatientData(defaultPatientData);
        }
      } catch (err) {
        console.error('Error fetching payments analytics:', err);
        setError('Gagal memuat data metode pembayaran');
        setPaymentData(defaultPaymentData);
        setPatientData(defaultPatientData);
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
          Metode Pembayaran & Pasien
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-4">
          {/* Donut Chart */}
          <div className="relative w-36 h-36 flex-shrink-0 mx-auto sm:mx-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={62}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-sm font-bold text-[#13222D] block">{topMethod.name} {topMethod.value}%</span>
                <span className="text-xs text-[#67737C]">({topMethod.count} transaksi)</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3 flex-1 w-full">
            {paymentData.map((item, index) => (
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
            ))}
          </div>
        </div>
      </div>

      <div>
        <Separator className="bg-[#DFE6EB] my-6" />
        <div className="grid grid-cols-2 gap-4 text-center">
          {patientData.map((item, index) => (
            <div key={index}>
              <p className="text-xs font-semibold text-[#67737C] mb-1">{item.name}</p>
              <p className="text-2xl font-bold text-[#1B9C90]">{item.percentage}%</p>
              <p className="text-xs text-[#67737C]">({item.count.toLocaleString('id-ID')} data)</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};