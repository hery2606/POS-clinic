import { Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LoyalPatient {
  id: string;
  name: string;
  initial: string;
  visits: number;
  totalSpent: string;
}

const loyalPatients: LoyalPatient[] = [
  { id: 'RM-00124', name: 'Budi Santoso', initial: 'B', visits: 12, totalSpent: 'Rp 4.250.000' },
  { id: 'RM-00431', name: 'Siti Aminah', initial: 'S', visits: 9, totalSpent: 'Rp 3.800.000' },
  { id: 'RM-00892', name: 'Ahmad Rizal', initial: 'A', visits: 8, totalSpent: 'Rp 2.100.000' },
];

export const LoyalPatientCard = () => {
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
          Top 3
        </Badge>
      </div>

      {/* List Pasien (Mengisi sisa area & bisa di-scroll secara independen jika penuh) */}
      <div className="space-y-4 flex-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {loyalPatients.map((patient) => (
          <div 
            key={patient.id} 
            className="flex items-center justify-between p-4 bg-white border border-[#DFE6EB] hover:border-[#1B9C90]/30 rounded-2xl transition-all shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#DFF6F2] text-[#1B9C90] flex items-center justify-center font-bold text-base border border-[#DFE6EB]">
                {patient.initial}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#13222D] text-sm">
                  {patient.name}
                </span>
                <span className="text-xs font-medium text-[#67737C]">
                  {patient.id}
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-[#1B9C90]">
                {patient.visits} Kunjungan
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