import React, { useMemo } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useBreadcrumb } from '@/hooks/useBreadcrumb'
import { useRightPanel } from '../context/right-panel-context'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { warehouseService } from '../services/warehouse.service'
import type { WarehouseMedicine } from '../types/warehouse.types'

export function Header() {
  const breadcrumbs = useBreadcrumb()
  const { setContent } = useRightPanel()

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
        
        {/* LEFT PANEL: BREADCRUMBS & TITLES */}
        <div className="space-y-1">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <BreadcrumbSeparator className="text-[#67737C]/40" />}
                  <BreadcrumbItem>
                    {crumb.isActive ? (
                      <BreadcrumbPage className="text-xs font-semibold text-[#13222D]">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild className="text-xs font-medium text-[#67737C] hover:text-[#1B9C90] transition-colors">
                        <Link to={crumb.href || '#'}>
                          {crumb.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          
          <h1 className="text-xl font-bold text-[#13222D] tracking-wide">
            {breadcrumbs[breadcrumbs.length - 1]?.label || 'Kasir & Tagihan'}
          </h1>
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