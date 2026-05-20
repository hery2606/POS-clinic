import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface RegionData {
  name: string;
  count: number;
  isHighlighted?: boolean;
}

const topRegions: RegionData[] = [
  { name: 'Kec. Kebayoran', count: 420 },
  { name: 'Kec. Mampang', count: 285 },
  { name: 'Kec. Cilandak', count: 190 },
  { name: 'Kec. Pasar Minggu', count: 145, isHighlighted: true }, // Pin berwarna hijau/teal di gambar
  { name: 'Kec. Pancoran', count: 98 },
];

export const PatientOriginCard = () => {
  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm w-full max-w-md flex flex-col justify-between">
      <div>
        {/* SECTION ATAS: RATA-RATA JEDA KUNJUNGAN */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#13222D]">
            Rata-rata Jeda Kunjungan
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-[#1B9C90] tracking-tight">
              45
            </span>
            <span className="text-sm font-bold text-[#67737C]">
              Hari
            </span>
          </div>
        </div>

        <Separator className="bg-[#DFE6EB] my-5" />

        {/* SECTION BAWAH: PETA ASAL WILAYAH */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-[#67737C] uppercase tracking-wider">
            Peta Asal Wilayah (Top 5)
          </h4>
          
          <div className="space-y-3.5">
            {topRegions.map((region, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2.5">
                  <MapPin 
                    className={cn(
                      "w-4 h-4 shrink-0", 
                      region.isHighlighted ? "text-[#1B9C90]" : "text-[#67737C]"
                    )} 
                  />
                  <span className="font-semibold text-[#13222D]">
                    {region.name}
                  </span>
                </div>
                <span className="font-bold text-[#13222D]">
                  {region.count.toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};