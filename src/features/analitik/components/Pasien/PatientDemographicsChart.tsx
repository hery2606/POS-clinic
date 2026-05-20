"use client"

import {  useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { analitikService } from '../../services/analitik.service';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

// Kategori usia berdasarkan standar demografi Indonesia
const AGE_CATEGORIES = [
  { label: 'Balita', min: 0, max: 5 },
  { label: 'Anak-anak', min: 6, max: 11 },
  { label: 'Remaja', min: 12, max: 17 },
  { label: 'Dewasa', min: 18, max: 55 },
  { label: 'Lansia', min: 56, max: 150 },
];

interface AgeGroup {
  label: string;
  min: number;
  max: number;
  count: number;
  percentage: number;
}

interface GenderData {
  name: string;
  value: number;
  color: string;
}

const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return Math.max(0, age);
};

const categorizePatients = (patients: any[]): { ageGroups: AgeGroup[]; genderData: GenderData[] } => {
  const ageGroupCounts: { [key: string]: number } = {};
  let maleCount = 0;
  let femaleCount = 0;

  AGE_CATEGORIES.forEach(cat => {
    ageGroupCounts[cat.label] = 0;
  });

  patients.forEach(patient => {
    try {
      const age = calculateAge(patient.tanggalLahir);
      const category = AGE_CATEGORIES.find(cat => age >= cat.min && age <= cat.max);
      if (category) {
        ageGroupCounts[category.label]++;
      }

      if (patient.jenisKelamin === 'LAKI_LAKI') {
        maleCount++;
      } else if (patient.jenisKelamin === 'PEREMPUAN') {
        femaleCount++;
      }
    } catch (error) {
      console.warn(`Gagal memproses pasien ${patient.id}:`, error);
    }
  });

  const total = patients.length;
  
  const ageGroups: AgeGroup[] = AGE_CATEGORIES.map(cat => ({
    label: cat.label,
    min: cat.min,
    max: cat.max,
    count: ageGroupCounts[cat.label],
    percentage: total > 0 ? Math.round((ageGroupCounts[cat.label] / total) * 100) : 0,
  }));

  const genderData: GenderData[] = [
    { 
      name: 'Perempuan', 
      value: total > 0 ? Math.round((femaleCount / total) * 100) : 0, 
      color: '#1B9C90' 
    },
    { 
      name: 'Laki-laki', 
      value: total > 0 ? Math.round((maleCount / total) * 100) : 0, 
      color: '#DFF6F2' 
    },
  ];

  return { ageGroups, genderData };
};

export const PatientDemographicsChart = () => {
  // Gunakan useQuery untuk sinkronisasi cache dengan komponen lain
  const { data: patients = [], isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const response = await analitikService.getAllPatients();
      return response.data?.data || [];
    },
    staleTime: 5 * 60 * 1000, // Cache selama 5 menit
    gcTime: 10 * 60 * 1000, // Keep cache selama 10 menit
  });

  // Bungkus pengolahan data dengan useMemo agar tidak melakukan kalkulasi ulang saat re-render
  const { ageGroups, genderData, totalPatients } = useMemo(() => {
    const { ageGroups: groups, genderData: genders } = categorizePatients(patients);
    return {
      ageGroups: groups,
      genderData: genders,
      totalPatients: patients.length
    };
  }, [patients]);

  if (isLoading) {
    return (
      <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm w-full max-w-3xl">
        <div className="h-40 bg-gray-100 rounded-lg animate-pulse" />
      </Card>
    );
  }

  if (error || totalPatients === 0) {
    return (
      <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm w-full max-w-3xl">
        <p className="text-red-600 text-sm">Gagal memuat demografi: {error ? (error as Error).message : 'Tidak ada data'}</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm w-full max-w-3xl">
      <div>
        <h3 className="text-lg font-bold text-[#13222D]">
          Demografi Pasien (Usia & Gender)
        </h3>
        <p className="text-xs font-medium text-[#67737C] mt-1">
          Total Basis Data: <span className="text-[#13222D] font-bold">{totalPatients.toLocaleString('id-ID')} Pasien</span> dari RME Database
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center justify-between mt-8">
        
        {/* KOLOM KIRI: PROGRESS BARS KATEGORI USIA */}
        <div className="space-y-4 flex-1 w-full">
          {ageGroups.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              {/* Desain Label Modifikasi: Judul Kategori & Rentang Usia di Bawahnya */}
              <div className="w-24 flex flex-col justify-center shrink-0">
                <span className="text-sm font-bold text-[#13222D] leading-tight">
                  {item.label}
                </span>
                <span className="text-[11px] font-medium text-[#67737C] leading-none mt-0.5">
                  {item.label === 'Lansia' ? `> ${item.min} tahun` : `${item.min} - ${item.max} thn`}
                </span>
              </div>

              {/* Progress Bar Container */}
              <div className="flex-1 h-4 bg-[#EFF4F8] rounded-full overflow-hidden shadow-sm self-center">
                <div 
                  className="h-full bg-linear-to-r from-[#1B9C90] to-[#16a395] rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              {/* Persentase */}
              <span className="text-lg font-black text-[#1B9C90] text-right min-w-12.5 self-center">
                {item.percentage}%
              </span>

              {/* Jumlah Riil Pasien */}
              <span className="text-sm font-bold text-[#67737C] text-right min-w-10 self-center">
                ({item.count})
              </span>
            </div>
          ))}
        </div>

        <div className="hidden md:block w-px h-40 bg-[#DFE6EB] self-center mx-2" />

        {/* KOLOM KANAN: GENDER DONUT CHART & LEGEND */}
        <div className="flex flex-col items-center justify-center shrink-0 min-w-50 w-full md:w-auto">
          
          <div className="relative w-28 h-28 shrink-0 mb-4">
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
            <div className="absolute inset-0 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#67737C]" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 w-full text-left">
            {genderData.map((g, index) => {
              const count = Math.round((g.value / 100) * totalPatients);
              return (
                <div key={g.name} className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#13222D]">
                    <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", index === 0 ? "bg-[#1B9C90]" : "bg-[#DFF6F2] border border-[#DFE6EB]")} />
                    {g.name}
                  </div>
                  <span className="text-xs font-bold text-[#13222D] pl-4 mt-0.5 whitespace-nowrap">
                    {g.value}% <span className="text-[10px] font-medium text-[#67737C]">({count})</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </Card>
  );
};