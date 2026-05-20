import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export const SecuritySettings = () => (
  <div className="space-y-6">
    <div className="bg-[#F9FEFC] border border-[#DFE6EB] rounded-lg p-6">
      <h3 className="text-lg font-bold text-[#13222D] mb-4">Keamanan Akun</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#13222D] mb-2">Password Saat Ini</label>
          <Input type="password" className="border-[#DFE6EB]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#13222D] mb-2">Password Baru</label>
          <Input type="password" className="border-[#DFE6EB]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#13222D] mb-2">Konfirmasi Password</label>
          <Input type="password" className="border-[#DFE6EB]" />
        </div>
      </div>
      <Separator className="my-6 bg-[#DFE6EB]" />
      <Button className="w-full bg-[#1B9C90] hover:bg-[#169B8A] text-white font-bold h-10 rounded-md">
        Ubah Password
      </Button>
    </div>

    <div className="bg-[#F9FEFC] border border-[#DFE6EB] rounded-lg p-6">
      <h3 className="text-lg font-bold text-[#13222D] mb-4">Autentikasi Dua Faktor</h3>
      <p className="text-[#67737C] mb-4">Tingkatkan keamanan akun dengan autentikasi dua faktor</p>
      <Button variant="outline" className="w-full border-[#DFE6EB] text-[#13222D] hover:bg-[#EFF4F8] font-bold h-10 rounded-md">
        Aktifkan 2FA
      </Button>
    </div>

    <div className="bg-[#FFF9EB] border border-[#F2A618]/30 rounded-lg p-4 flex gap-3">
      <span className="text-2xl">⚠️</span>
      <div>
        <p className="font-semibold text-[#13222D]">Perhatian Keamanan</p>
        <p className="text-sm text-[#67737C]">Jangan pernah bagikan password Anda kepada siapapun, termasuk admin sistem</p>
      </div>
    </div>
  </div>
);
