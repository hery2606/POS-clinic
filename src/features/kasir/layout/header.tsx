import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useBreadcrumb } from '@/hooks/useBreadcrumb'
import { Link } from 'react-router-dom'

export function Header() {
  const breadcrumbs = useBreadcrumb()

  return (
    <header className="border-b-2 bg-white sticky top-0 z-10">
      <div className="px-6 py-4">
        <div className="mb-4">
            <h1 className="text-2xl font-bold">
              {breadcrumbs[breadcrumbs.length - 1]?.label || 'Kasir & Tagihan'}
            </h1>
        </div>

        <div className="flex items-center justify-between">
          <div>
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  {index > 0 && <BreadcrumbSeparator />}
                  {crumb.isActive ? (
                    <BreadcrumbPage className="text-sm">{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={crumb.href || '#'} className="text-sm">
                        {crumb.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <span className="h-2 w-2 bg-green-600 rounded-full mr-2 inline-block"></span>
              Sistem Terhubung (WMS & WA)
            </Badge>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
