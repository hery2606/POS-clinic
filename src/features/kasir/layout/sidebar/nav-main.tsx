import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const location = useLocation()

  const isActive = (url: string) => {
    if (url === "/kasir") {
      return location.pathname === "/kasir" || location.pathname === "/kasir/"
    }
    return location.pathname === url
  }

  return (
    <SidebarGroup className="p-0">
      <SidebarMenu className="space-y-1">
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton 
              asChild 
              className={cn(
                "w-full h-16 px-2 py-3 transition-all duration-200 flex items-center gap-4 relative text-[15px]  tracking-wide",
                isActive(item.url) 
                  ? "bg-[#13272F] text-[#29B5A8] font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Link to={item.url} className="flex items-center w-full h-full">
                {/* Indikator vertikal aktif di sisi paling kiri */}
                {isActive(item.url) && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1B9C90] rounded-r-md" />
                )}
                
                <div className={cn(
                  "shrink-0 transition-colors flex items-center justify-center",
                  isActive(item.url) ? "text-[#29B5A8]" : "text-slate-400 group-hover/btn:text-white"
                )}>
                  {item.icon}
                </div>
                
                <span className="group-data-[collapse=icon]:hidden">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}