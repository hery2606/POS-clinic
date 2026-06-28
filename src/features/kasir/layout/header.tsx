import React, { useMemo } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRightPanel } from '../context/right-panel-context'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { warehouseService } from '../services/warehouse.service'
import type { WarehouseMedicine } from '../types/warehouse.types'

export function Header() {
  const { setContent } = useRightPanel()
  const location = useLocation()

  const getHeaderInfo = () => {
    const path = location.pathname.toLowerCase();
    
    if (path === '/kasir' || path === '/kasir/') {
      return {
        title: "Kasir",
        subtitle: "Kelola transaksi penjualan obat dan rekam medis pasien"
      };
    }
    if (path.includes("riwayat")) {
      return {
        title: "Riwayat Transaksi",
        subtitle: "Catatan transaksi penjualan obat"
      };
    }
    if (path.includes("stok")) {
      return {
        title: "Stok Obat",
        subtitle: "Manajemen ketersediaan obat dan alat kesehatan"
      };
    }
    if (path.includes("pengaturan")) {
      return {
        title: "Pengaturan",
        subtitle: "Konfigurasi aplikasi kasir"
      };
    }
    if (path.includes("pasien")) {
      return {
        title: "Data Pasien",
        subtitle: "Pencarian dan manajemen pasien klinik"
      };
    }
    
    return {
      title: "Kasir",
      subtitle: "Kelola transaksi penjualan obat dan rekam medis pasien"
    };
  };

  const { title, subtitle } = getHeaderInfo();


  // Fetch medicines to count critical/low stock items
  const { data: medicinesData } = useQuery<{ data: WarehouseMedicine[] }>({
    queryKey: ['medicines'],
    queryFn: warehouseService.getMedicinesList,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Count stock alerts (critical + low stock)
  const stockAlertCount = useMemo(() => {
    if (!medicinesData?.data) return 0;
    
    return medicinesData.data.filter((medicine: WarehouseMedicine) => {
      const isCritical = medicine.stokSaatIni === 0;
      const isLow = medicine.stokSaatIni > 0 && medicine.stokSaatIni < medicine.stokMinimum;
      return isCritical || isLow;
    }).length;
  }, [medicinesData?.data]);

  const handleNotificationClick = () => {
    setContent('notification')
  }

  return (
    <header className="border-b border-[#DFE6EB] bg-white sticky top-0 z-10 w-full">
      <div className="px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        
        {/* LEFT PANEL: DYNAMIC TITLES */}
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-[#13222D] tracking-wide">
            {title}
          </h1>
          <p className="text-xs font-medium text-[#67737C]">
            {subtitle}
          </p>
        </div>

        {/* RIGHT PANEL: ACTIONS & APP STATUS */}
        <div className="flex items-center gap-3.5 sm:ml-auto">
          <Badge className="bg-[#DFF6F2] text-[#1B9C90] border-none shadow-none px-3 py-1 text-xs font-medium rounded-full flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-[#1B9C90] rounded-full animate-pulse"></span>
            Sistem Terhubung (WMS & WA)
          </Badge>

          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-10 w-10 rounded-xl bg-[#F9FEFC] border border-[#DFE6EB] hover:bg-[#EFF4F8] text-[#67737C] hover:text-[#13222D] transition-all"
            onClick={handleNotificationClick}
          >
            <Bell className="h-4.5 w-4.5" />
            {stockAlertCount > 0 && (
              <span className="absolute top-2.5 right-2.5 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                {stockAlertCount > 9 ? '9+' : stockAlertCount}
              </span>
            )}
          </Button>
        </div>

      </div>
    </header>
  )
}