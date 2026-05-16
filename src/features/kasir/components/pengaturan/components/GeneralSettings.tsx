import { Input } from '@/components/ui/input';

export const GeneralSettings = () => (
  <div className="space-y-6">
    <div className="bg-[#F9FEFC] border border-[#DFE6EB] rounded-lg p-6">
      <h3 className="text-lg font-bold text-[#13222D] mb-4">Informasi Klinik</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#13222D] mb-2">Nama Klinik</label>
          <Input
            defaultValue="Klinik Mitra Sehat"
            className="border-[#DFE6EB] focus-visible:ring-[#1B9C90]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#13222D] mb-2">Jam Operasional</label>
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="08:00" className="border-[#DFE6EB]" />
            <Input placeholder="17:00" className="border-[#DFE6EB]" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#13222D] mb-2">Waktu Zone</label>
          <select className="w-full px-3 py-2 border border-[#DFE6EB] rounded-md text-[#13222D] focus:outline-none focus:ring-2 focus:ring-[#1B9C90]">
            <option>UTC +7:00 (Waktu Indonesia Barat)</option>
            <option>UTC +8:00 (Waktu Indonesia Tengah)</option>
            <option>UTC +9:00 (Waktu Indonesia Timur)</option>
          </select>
        </div>
      </div>
    </div>

    <div className="bg-[#F9FEFC] border border-[#DFE6EB] rounded-lg p-6">
      <h3 className="text-lg font-bold text-[#13222D] mb-4">Tampilan Sistem</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-[#13222D]">Mode Gelap</p>
            <p className="text-sm text-[#67737C]">Aktifkan mode gelap untuk kenyamanan mata</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-[#DFE6EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1B9C90] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B9C90]"></div>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-[#13222D]">Suara Notifikasi</p>
            <p className="text-sm text-[#67737C]">Mainkan suara untuk notifikasi penting</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-[#DFE6EB] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1B9C90] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B9C90]"></div>
          </label>
        </div>
      </div>
    </div>
  </div>
);
