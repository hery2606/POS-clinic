import * as React from "react";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthContext } from "@/features/auth/context/auth-context";
import { ROUTES } from "@/routes/routeConfig";
import {
  BarChart3,
  SettingsIcon,
  HeartHandshakeIcon,
  Users,
  NotebookTabs,
  NotebookTextIcon,
} from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthContext();

  const navMain = [
    {
      title: "Dashboard",
      url: ROUTES.ADMIN.DASHBOARD,
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Pasien",
      url: ROUTES.ADMIN.PASIEN,
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Riwayat Transaksi",
      url: ROUTES.ADMIN.TRANSAKSI,
      icon: <NotebookTabs className="h-5 w-5" />,
    },
    {
      title: "Laporan",
      url: ROUTES.ADMIN.LAPORAN,
      icon: <NotebookTextIcon className="h-5 w-5" />,
    },
    {
      title: "Pengaturan",
      url: ROUTES.ADMIN.SETTINGS,
      icon: <SettingsIcon className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {/* Sidebar Container */}
      <Sidebar
        collapsible="icon"
        className="border-r-0 bg-[#0D1A23]"
        {...props}
      >
        {/* HEADER */}
        <SidebarHeader className="bg-[#0D1A23] border-b-2 border-[#1A2632] px-2 py-8">
          <div className="flex items-center gap-3">
            {/* Logo Circular dengan Teal */}
            <div className="flex items-center justify-center bg-[#1B9C90] text-white rounded-xl h-10 w-10 shrink-0 shadow-md shadow-[#1B9C90]/10">
              <HeartHandshakeIcon className="h-6 w-6" />
            </div>
            <div className="flex flex-col group-data-[collapse=icon]:hidden min-w-0">
              <span className="text-sm font-bold text-white tracking-tight leading-tight">
                Smart Clinic
              </span>
              <span className="text-[11px] text-[#1B9C90] font-medium tracking-tight">
                ANALITIK DASHBOARD
              </span>
            </div>
          </div>
        </SidebarHeader>

        {/* CONTENT */}
        <SidebarContent className="bg-[#0D1A23] px-0 py-3">
          <div className="px-3 mb-2">
            <span className="text-[10px] font-bold text-[#29B5A8] tracking-widest uppercase group-data-[collapse=icon]:hidden">
              Menu Analitik
            </span>
          </div>
          <NavMain items={navMain} />
        </SidebarContent>

        {/* FOOTER */}
        <SidebarFooter className="bg-[#0D1A23] p-4 border-t border-[#1A2632]">
          <div className="bg-[#1A2632]/50 rounded-lg border border-[#1A2632] overflow-hidden">
            <NavUser
              user={{
                name: user?.name || "Analitik",
                email: user?.email || "analitik@klinik.com",
                avatar: "/avatars/default.jpg",
              }}
            />
          </div>
        </SidebarFooter>

        <SidebarRail className="hover:bg-white/5" />
      </Sidebar>
    </>
  );
}
