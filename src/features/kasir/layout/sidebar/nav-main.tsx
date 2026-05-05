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
    // For /kasir, match both /kasir and /kasir/
    if (url === "/kasir") {
      return location.pathname === "/kasir" || location.pathname === "/kasir/"
    }
    // For other routes, exact match
    return location.pathname === url
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton 
              asChild 
              className={cn(
                "text-base h-12 transition-colors",
                isActive(item.url) 
                  ? "bg-[#29B5A8] text-white hover:bg-[#1B9C90]"
                  : "hover:bg-[#DFF6F2] "
              )}
            >
              <Link to={item.url}>
                {item.icon}
                <span className="text-base font-medium">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
