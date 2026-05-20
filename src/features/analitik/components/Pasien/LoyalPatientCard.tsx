"use client"

import { Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { analitikService } from '../../services/analitik.service';

interface LoyalPatient {
  id_pasien: string;
  nama_pasien: string;
  initial: string;
  kunjungan_terbanyak: number;
  totalSpent?: string;
}

export const LoyalPatientCard = () => {
  const [patients, setPatients] = useState<LoyalPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await analitikService.getPatientAnalytics();
        
        // Transform pasien_paling_loyal data
        const loyalPatients = response.data.pasien_paling_loyal.map((patient) => {
          // Find spending data for this patient
          const spendingData = response.data.pasien_spend_tertinggi.find(
            (p) => p.id_pasien === patient.id_pasien
          );
          
          return {
            id_pasien: patient.id_pasien,
            nama_pasien: patient.nama_pasien,
            initial: patient.nama_pasien.split(' ')[0].charAt(0).toUpperCase(),
            kunjungan_terbanyak: patient.kunjungan_terbanyak,
            totalSpent: spendingData ? formatCurrency(spendingData.total_spend) : 'Rp 0',
          };
        });

        setPatients(loyalPatients);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching patient analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(1)}K`;
    }
    return `Rp ${amount}`;
  };

  if (error) {
    return (
      <div className="w-full flex-1 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#1B9C90]" />
            <h3 className="text-lg font-bold text-[#13222D]">
              Pasien Loyal (AI Insight)
            </h3>
          </div>
          <Badge className="bg-[#DFF6F2] text-[#1B9C90] hover:bg-[#DFF6F2] rounded-full px-3 py-1 text-xs font-bold border-none shadow-none">
            Top 3
          </Badge>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          Error: {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full flex-1 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#1B9C90]" />
            <h3 className="text-lg font-bold text-[#13222D]">
              Pasien Loyal (AI Insight)
            </h3>
          </div>
          <Badge className="bg-[#DFF6F2] text-[#1B9C90] hover:bg-[#DFF6F2] rounded-full px-3 py-1 text-xs font-bold border-none shadow-none">
            Top 3
          </Badge>
        </div>
        <div className="space-y-4 flex-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col justify-between overflow-hidden">
      {/* Header (Tetap di atas / tidak ikut scroll) */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#1B9C90]" />
          <h3 className="text-lg font-bold text-[#13222D]">
            Pasien Loyal (AI Insight)
          </h3>
        </div>
        <Badge className="bg-[#DFF6F2] text-[#1B9C90] hover:bg-[#DFF6F2] rounded-full px-3 py-1 text-xs font-bold border-none shadow-none">
          Top {patients.length}
        </Badge>
      </div>

      {/* List Pasien (Mengisi sisa area & bisa di-scroll secara independen jika penuh) */}
      <div className="space-y-4 flex-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {patients.map((patient) => (
          <div 
            key={patient.id_pasien} 
            className="flex items-center justify-between p-4 bg-white border border-[#DFE6EB] hover:border-[#1B9C90]/30 rounded-2xl transition-all shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#DFF6F2] text-[#1B9C90] flex items-center justify-center font-bold text-base border border-[#DFE6EB]">
                {patient.initial}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#13222D] text-sm">
                  {patient.nama_pasien}
                </span>
                <span className="text-xs font-medium text-[#67737C]">
                  {patient.id_pasien}
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-[#1B9C90]">
                {patient.kunjungan_terbanyak} Kunjungan
              </p>
              <p className="text-xs font-medium text-[#67737C]">
                Total: {patient.totalSpent}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};