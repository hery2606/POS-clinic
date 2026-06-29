import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const dt = [
  { n: 'Kec. Kebayoran', c: 420 },
  { n: 'Kec. Mampang', c: 285 },
  { n: 'Kec. Cilandak', c: 190 },
  { n: 'Kec. Pasar Minggu', c: 145, h: true },
  { n: 'Kec. Pancoran', c: 98 },
];

export const PatientOriginCard = () => (
  <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm w-full max-w-md flex flex-col justify-between">
    <div>
      <div className="space-y-3"><h3 className="text-lg font-bold text-[#13222D]">Rata-rata Jeda Kunjungan</h3><div className="flex items-baseline gap-2"><span className="text-4xl font-extrabold text-[#1B9C90] tracking-tight">45</span><span className="text-sm font-bold text-[#67737C]">Hari</span></div></div>
      <Separator className="bg-[#DFE6EB] my-5" />
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-[#67737C] uppercase tracking-wider">Peta Asal Wilayah (Top 5)</h4>
        <div className="space-y-3.5">
          {dt.map((x, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2.5"><MapPin className={`w-4 h-4 shrink-0 ${x.h ? "text-[#1B9C90]" : "text-[#67737C]"}`} /><span className="font-semibold text-[#13222D]">{x.n}</span></div>
              <span className="font-bold text-[#13222D]">{x.c.toLocaleString('id-ID')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </Card>
);