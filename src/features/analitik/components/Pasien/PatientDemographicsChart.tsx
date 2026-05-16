import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Menentukan total basis data pasien sebagai acuan perhitungan angka riil
const TOTAL_PATIENTS = 2000;

const ageData = [
  { name: 'Dewasa', percentage: 55 },
  { name: 'Lansia', percentage: 25 },
  { name: 'Anak-anak', percentage: 15 },
  { name: 'Balita', percentage: 5 },
];

const genderData = [
  { name: 'Perempuan', value: 65, color: '#1B9C90' },
  { name: 'Laki-laki', value: 35, color: '#DFF6F2' },
];

export const PatientDemographicsChart = () => {
  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm w-full max-w-3xl">
      {/* HEADER */}
      <div>
        <h3 className="text-lg font-bold text-[#13222D]">
          Demografi Pasien (Usia & Gender)
        </h3>
        <p className="text-xs font-medium text-[#67737C] mt-1">
          Total Basis Data: <span className="text-[#13222D] font-bold">{TOTAL_PATIENTS.toLocaleString('id-ID')} Pasien</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center justify-between mt-8">
        
        {/* LEFT COLUMN: AGE GROUPS PROGRESS BARS */}
        <div className="space-y-4 flex-1 w-full">
          {ageData.map((item) => {
            // Menghitung jumlah rion data asli berdasarkan persentase
            const exactCount = (item.percentage / 100) * TOTAL_PATIENTS;

            return (
              <div key={item.name} className="flex items-center gap-4">
                <span className="w-20 text-sm font-bold text-[#13222D]">
                  {item.name}
                </span>
                <div className="flex-1 h-3 bg-[#EFF4F8] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#1B9C90] rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                {/* Mengubah w-10 menjadi min-w-[95px] agar teks tambahan angka tidak patah ke bawah */}
                <span className="text-sm font-bold text-[#13222D] text-right whitespace-nowrap min-w-[95px]">
                  {item.percentage}% <span className="text-xs font-semibold text-[#67737C]">({exactCount.toLocaleString('id-ID')})</span>
                </span>
              </div>
            );
          })}
        </div>

        {/* VERTICAL DIVIDER */}
        <div className="hidden md:block w-[1px] h-32 bg-[#DFE6EB] self-center mx-2" />

        {/* RIGHT COLUMN: GENDER DONUT CHART & LEGEND */}
        <div className="flex flex-col items-center justify-center shrink-0 min-w-[200px] w-full md:w-auto">
          
          {/* DONUT CHART WITH INSIDE ICON */}
          <div className="relative w-28 h-28 flex-shrink-0 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={46}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* CENTER AVATAR/USERS ICON */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#67737C]" />
            </div>
          </div>

          {/* DYNAMIC SIDE-BY-SIDE LEGEND */}
          <div className="flex items-center justify-center gap-6 w-full text-left">
            {/* Perempuan */}
            {(() => {
              const pData = genderData[0];
              const pCount = (pData.value / 100) * TOTAL_PATIENTS;
              return (
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#13222D]">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1B9C90] shrink-0" />
                    {pData.name}
                  </div>
                  <span className="text-xs font-bold text-[#13222D] pl-4 mt-0.5 whitespace-nowrap">
                    {pData.value}% <span className="text-[10px] font-medium text-[#67737C]">({pCount.toLocaleString('id-ID')})</span>
                  </span>
                </div>
              );
            })()}

            {/* Laki-laki */}
            {(() => {
              const lData = genderData[1];
              const lCount = (lData.value / 100) * TOTAL_PATIENTS;
              return (
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#13222D]">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#DFF6F2] border border-[#DFE6EB] shrink-0" />
                    {lData.name}
                  </div>
                  <span className="text-xs font-bold text-[#13222D] pl-4 mt-0.5 whitespace-nowrap">
                    {lData.value}% <span className="text-[10px] font-medium text-[#67737C]">({lCount.toLocaleString('id-ID')})</span>
                  </span>
                </div>
              );
            })()}
          </div>

        </div>

      </div>
    </Card>
  );
};  