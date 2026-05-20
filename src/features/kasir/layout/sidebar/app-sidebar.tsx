"use client";

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
  CreditCardIcon,
  SettingsIcon,
  HeartHandshakeIcon,
  ReceiptText,
  Pill,
} from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthContext();

  const navMain = [
    {
      title: "Kasir",
      url: ROUTES.KASIR.DASHBOARD,
      icon: <CreditCardIcon className="h-6 w-6" />,
    },
    {
      title: "Riwayat Transaksi",
      url: ROUTES.KASIR.RIWAYAT,
      icon: <ReceiptText className="h-5 w-5" />,
    },
    
    {
      title: "Stok Obat",
      url: ROUTES.KASIR.STOK,
      icon: <Pill className="h-5 w-5" />,
    },
    {
      title: "Pengaturan",
      url: ROUTES.KASIR.PENGATURAN,
      icon: <SettingsIcon className="h-5 w-5" />,
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-[#1A2632] bg-[#0D1A23] text-slate-300" {...props}>
      <SidebarHeader className="bg-[#0D1A23] border-b-2 border-[#1A2632] pt-7 pb-4 py-4.5">
        <div className="flex items-center gap-3 px-2">
          <div className="flex items-center justify-center bg-[#1B9C90] text-white rounded-xl h-10 w-10 shrink-0 shadow-md shadow-[#1B9C90]/10">
            <HeartHandshakeIcon className="h-6 w-6" />
          </div>
          <div className="flex flex-col group-data-[collapse=icon]:hidden">
            <span className="text-base font-bold text-white tracking-wide">Klinik Payment</span>
            <span className="text-xs text-[#29B5A8] font-medium tracking-wide mt-0.5">Sistem Kasir</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-[#0D1A23] px-0 py-3">
        <div className="px-3 mb-2">
          <span className="text-[10px] font-bold text-[#29B5A8] tracking-widest uppercase group-data-[collapse=icon]:hidden">
            Menu Kasir
          </span>
        </div>
        <NavMain items={navMain} />
      </SidebarContent>
      
      <SidebarFooter className="bg-[#0D1A23] p-4 border-t border-[#1A2632]">
        <div className="bg-[#14202A] rounded-xl border border-[#1A2632] overflow-hidden p-1">
          <NavUser
            user={{
              name: user?.name || "Kasir",
              email: user?.email || "kasir@klinik.com",
              avatar: "/avatars/default.jpg",
            }}
          />
        </div>
      </SidebarFooter>
      <SidebarRail className="hover:bg-white/5" />
    </Sidebar>
  );
}