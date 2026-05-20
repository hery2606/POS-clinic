import { TrendingUp, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { analitikService } from '../../services/analitik.service';

interface PatientSpend {
  rank: number;
  id_pasien: string;
  nama_pasien: string;
  amount: string;
  rawAmount: number;
}

export const TopSpendingPatients = () => {
  const [patients, setPatients] = useState<PatientSpend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await analitikService.getPatientAnalytics();
        
        // Transform pasien_spend_tertinggi data
        const spendingPatients = response.data.pasien_spend_tertinggi.map(
          (patient, index) => ({
            rank: index + 1,
            id_pasien: patient.id_pasien,
            nama_pasien: patient.nama_pasien,
            amount: formatCurrency(patient.total_spend),
            rawAmount: patient.total_spend,
          })
        );

        setPatients(spendingPatients);
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
        <div className="flex items-center justify-between mb-8 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#FFF9EB] flex items-center justify-center border border-[#FFE6A8]">
              <TrendingUp className="w-5 h-5 text-[#F2A618]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#13222D]">
                Pasien Spend Tertinggi
              </h3>
              <p className="text-xs font-medium text-[#67737C]">
                Berdasarkan akumulasi transaksi billing
              </p>
            </div>
          </div>
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
        <div className="flex items-center justify-between mb-8 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#FFF9EB] flex items-center justify-center border border-[#FFE6A8]">
              <TrendingUp className="w-5 h-5 text-[#F2A618]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#13222D]">
                Pasien Spend Tertinggi
              </h3>
              <p className="text-xs font-medium text-[#67737C]">
                Berdasarkan akumulasi transaksi billing
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-5 flex-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-2.5 bg-gray-100 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const maxAmount = Math.max(...patients.map((p) => p.rawAmount), 1);

  return (
    <div className="w-full flex-1 flex flex-col justify-between overflow-hidden">
      {/* Header (Tetap di atas) */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-[#FFF9EB] flex items-center justify-center border border-[#FFE6A8]">
            <TrendingUp className="w-5 h-5 text-[#F2A618]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#13222D]">
              Pasien Spend Tertinggi
            </h3>
            <p className="text-xs font-medium text-[#67737C]">
              Berdasarkan akumulasi transaksi billing
            </p>
          </div>
        </div>
      </div>

      {/* List Progress (Bisa di-scroll secara independen jika melebihi batas tinggi) */}
      <div className="space-y-5 flex-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {patients.map((patient) => {
          const barWidth = (patient.rawAmount / maxAmount) * 100;

          return (
            <div key={patient.id_pasien} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#67737C] min-w-[16px]">
                    #{patient.rank}
                  </span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#13222D] text-xs">
                        {patient.nama_pasien}
                      </span>
                      {patient.rank === 1 && (
                        <Trophy className="w-3.5 h-3.5 text-[#F2A618]" />
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-[#67737C]">
                      {patient.id_pasien}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-[#13222D] text-xs">
                    {patient.amount}
                  </span>
                </div>
              </div>

              <div className="w-full h-2.5 bg-[#EFF4F8] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#F2A618] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};