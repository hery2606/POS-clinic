import { TrendingUp, Trophy } from 'lucide-react';

interface PatientSpend {
  rank: number;
  id: string;
  name: string;
  amount: string;
  rawAmount: number;
}

const spendingData: PatientSpend[] = [
  { rank: 1, id: 'RM-00124', name: 'Budi Santoso', amount: 'Rp 4.250.000', rawAmount: 4250000 },
  { rank: 2, id: 'RM-00431', name: 'Siti Aminah', amount: 'Rp 3.800.000', rawAmount: 3800000 },
  { rank: 3, id: 'RM-01122', name: 'Maya Sari', amount: 'Rp 3.100.000', rawAmount: 3100000 },
  { rank: 4, id: 'RM-00921', name: 'Andi Wijaya', amount: 'Rp 2.900.000', rawAmount: 2900000 },
];

export const TopSpendingPatients = () => {
  const maxAmount = Math.max(...spendingData.map(p => p.rawAmount));

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
        {spendingData.map((patient) => {
          const barWidth = (patient.rawAmount / maxAmount) * 100;

          return (
            <div key={patient.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#67737C] min-w-[16px]">
                    #{patient.rank}
                  </span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#13222D] text-xs">
                        {patient.name}
                      </span>
                      {patient.rank === 1 && (
                        <Trophy className="w-3.5 h-3.5 text-[#F2A618]" />
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-[#67737C]">
                      {patient.id}
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