import { useState } from 'react';
import { 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface NotificationItem {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'success' | 'warning' | 'error' | 'info';
  category: 'sistem' | 'transaksi';
  unread: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    title: 'Resi Terkirim (WhatsApp)',
    description: 'Resi untuk INV-230814-001 telah berhasil dikirim ke +62 812-3456-7890.',
    time: 'BARU SAJA',
    type: 'success',
    category: 'transaksi',
    unread: true,
  },
  {
    id: 2,
    title: 'Stok Obat Menipis',
    description: 'Stok Paracetamol 500mg tersisa 15 strip. Segera lakukan restock.',
    time: '10 MENIT YANG LALU',
    type: 'warning',
    category: 'sistem',
    unread: true,
  },
  {
    id: 3,
    title: 'Sinkronisasi BPJS Berhasil',
    description: 'Data klaim untuk pasien Siti Aminah (RM-098124) telah disinkronkan ke V-Claim.',
    time: '1 JAM YANG LALU',
    type: 'info',
    category: 'sistem',
    unread: false,
  },
  {
    id: 4,
    title: 'Gagal Sinkronisasi WMS',
    description: 'Sistem gagal memotong stok untuk transaksi INV-230814-002. Silakan coba lagi.',
    time: '2 JAM YANG LALU',
    type: 'error',
    category: 'sistem',
    unread: false,
  },
  {
    id: 5,
    title: 'Update Sistem',
    description: 'Pembaruan modul kasir v2.4 telah berhasil diaplikasikan.',
    time: 'KEMARIN, 08:00',
    type: 'info',
    category: 'sistem',
    unread: false,
  },
];

export const NotificationPanel = () => {
  const [activeTab, setActiveTab] = useState<'semua' | 'sistem' | 'transaksi'>('semua');
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'semua') return true;
    return n.category === activeTab;
  });

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return <Check className="w-4 h-4 text-[#1B9C90]" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-[#F2A618]" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-[#E62C2C]" />;
      case 'info':
        return <CheckCircle2 className="w-4 h-4 text-[#1B9C90]" />;
      default:
        return <RefreshCw className="w-4 h-4 text-[#67737C]" />;
    }
  };

  const getIconBg = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return 'bg-[#DFF6F2] border-[#DFE6EB]';
      case 'warning':
        return 'bg-[#FFF9EB] border-[#FFE6A8]';
      case 'error':
        return 'bg-[#FEF2F2] border-[#FEE2E2]';
      case 'info':
        return 'bg-[#DFF6F2] border-[#DFE6EB]';
      default:
        return 'bg-[#EFF4F8] border-[#DFE6EB]';
    }
  };

  return (
    <div className="w-full bg-white flex flex-col h-full overflow-hidden flex-1">
      {/* TABS CONTROLLER */}
      <div className="px-6 py-4 shrink-0">
        <div className="flex bg-[#EFF4F8] p-1 rounded-full w-full">
          {(['semua', 'sistem', 'transaksi'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 text-xs font-bold py-2.5 rounded-full transition-all capitalize",
                activeTab === tab 
                  ? "bg-white text-[#13222D] shadow-sm" 
                  : "text-[#67737C] hover:text-[#13222D]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* NOTIFICATION SCROLL CONTAINER */}
      <ScrollArea className="flex-1 px-6 bg-white">
        <div className="space-y-3 py-2">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "p-4 rounded-[20px] border transition-all flex gap-3.5 relative",
                notification.unread
                  ? "bg-[#DFF6F2]/20 border-[#1B9C90]/30 shadow-sm"
                  : "bg-white border-[#DFE6EB]"
              )}
            >
              {/* Left Dynamic Badge Circle Icon */}
              <div className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center border shrink-0 mt-0.5",
                getIconBg(notification.type)
              )}>
                {getIcon(notification.type)}
              </div>

              {/* Central Text Content Data */}
              <div className="space-y-1 flex-1">
                <h4 className="text-sm font-bold text-[#13222D] leading-tight pr-4">
                  {notification.title}
                </h4>
                <p className="text-xs font-medium text-[#67737C] leading-relaxed">
                  {notification.description}
                </p>
                <p className="text-[10px] font-bold text-[#67737C]/70 tracking-wider pt-0.5 uppercase">
                  {notification.time}
                </p>
              </div>

              {/* Unread Tiny Teal Indicator Dot */}
              {notification.unread && (
                <div className="w-2 h-2 bg-[#1B9C90] rounded-full absolute top-4 right-4 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* FOOTER SYSTEM PANEL */}
      <div className="px-6 py-4 border-t border-[#DFE6EB] bg-white text-center shrink-0">
        <Button
          variant="ghost"
          onClick={handleMarkAllAsRead}
          className="text-sm font-bold text-[#1B9C90] hover:text-[#1B9C90] hover:bg-[#DFF6F2]/40 w-full rounded-full flex items-center justify-center gap-2 h-10"
        >
          <CheckCircle2 className="w-4 h-4" />
          Tandai semua dibaca
        </Button>
      </div>
    </div>
  );
};