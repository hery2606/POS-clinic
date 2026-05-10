"use client"

import * as React from "react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { NavMain } from "@/features/analitik/layout/sidebar/nav-main"
import { NavUser } from "@/features/analitik/layout/sidebar/nav-user"
import { ROUTES } from "@/routes/routeConfig"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { BarChart3, Settings, LogOut } from "lucide-react"

/**
 * Admin Sidebar Component
 * Sidebar untuk admin dengan menu-menu yang relevan
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth()

  const navMain = [
    {
      title: "Dashboard",
      url: ROUTES.ADMIN.ANALYTICS,
      icon: <BarChart3 className="w-5 h-5" />,
      isActive: true,
    },
    {
      title: "Pengaturan",
      url: ROUTES.ADMIN.SETTINGS,
      icon: <Settings className="w-5 h-5" />,
    },
    {
      title: "Logout",
      url: "#",
      icon: <LogOut className="w-5 h-5" />,
      onClick: logout,
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="w-8 h-8 bg-[#1B9C90] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">+</span>
          </div>
          <span className="font-bold text-[#13222D] hidden group-data-[state=expanded]:inline">
            KLINIK
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
