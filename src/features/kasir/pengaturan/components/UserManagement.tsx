import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const UserManagement = () => (
  <div className="space-y-6">
    <Button className="bg-[#1B9C90] hover:bg-[#169B8A] text-white font-bold h-10 rounded-md">
      + Tambah Pengguna Baru
    </Button>

    <div className="space-y-3">
      {[
        { name: 'Andi Pratama', role: 'Admin', status: 'Aktif', email: 'andi@klinik.com' },
        { name: 'Siti Nurhaliza', role: 'Cashier', status: 'Aktif', email: 'siti@klinik.com' },
        { name: 'Budi Santoso', role: 'Cashier', status: 'Nonaktif', email: 'budi@klinik.com' },
      ].map((user) => (
        <div key={user.name} className="bg-[#F9FEFC] border border-[#DFE6EB] rounded-lg p-4 flex items-center justify-between">
          <div className="flex-1">
            <p className="font-semibold text-[#13222D]">{user.name}</p>
            <p className="text-sm text-[#67737C]">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-[#EFF4F8] text-[#1B9C90] border-none">{user.role}</Badge>
              <Badge className={cn(
                "border-none",
                user.status === 'Aktif'
                  ? "bg-[#DFF6F2] text-[#1B9C90]"
                  : "bg-[#F9F9F9] text-[#67737C]"
              )}>
                {user.status}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-[#DFE6EB] text-[#67737C]">
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-200 text-red-500 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
