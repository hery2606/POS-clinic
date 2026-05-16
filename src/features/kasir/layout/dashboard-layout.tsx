import { Outlet, useLocation } from "react-router-dom"
import { AppSidebar } from "./sidebar/app-sidebar"
import { Header } from "./header"
import { RightPanel } from "./right-panel"
import { RightPanelProvider } from "../context/right-panel-context"
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"

export function DashboardLayout() {
  const location = useLocation();
  const isSettingsPage = location.pathname.includes('/pengaturan');

  return (
    <RightPanelProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset className="bg-[#f8fafc]"> 
          <div className="flex h-screen w-full overflow-hidden">
            <div className="flex flex-col flex-1 min-w-0 border-r border-gray-200">
              <Header /> 
              <main className="flex-1 overflow-y-auto p-4 lg:p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <Outlet />
              </main>
            </div>

            {!isSettingsPage && (
              <aside className="w-95 lg:w-105 bg-white overflow-y-auto hidden xl:block [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <RightPanel />
              </aside>
            )}

          </div>
        </SidebarInset>
      </SidebarProvider>
    </RightPanelProvider>
  )
}
