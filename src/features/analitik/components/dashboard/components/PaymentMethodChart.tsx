import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const paymentData = [
  { name: 'QRIS', value: 55, amount: 'Rp 68M', color: '#1B9C90', count: 1100 },
  { name: 'Debit', value: 25, amount: 'Rp 31M', color: '#F2A618', count: 500 },
  { name: 'Cash', value: 20, amount: 'Rp 25M', color: '#DFF6F2', count: 400 },
];

const patientData = [
  { name: 'Pasien Baru', percentage: 35, count: 1050, total: 3000 },
  { name: 'Pasien Lama', percentage: 65, count: 1950, total: 3000 },
];

interface PaymentMethodChartProps {
  className?: string;
}

export const PaymentMethodChart: React.FC<PaymentMethodChartProps> = ({ className }) => {
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
                <span className="text-sm font-bold text-[#13222D] block">QRIS 55%</span>
                <span className="text-xs text-[#67737C]">(1100 data)</span>
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