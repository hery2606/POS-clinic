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
import {
  CreditCardIcon,
  SettingsIcon,
  HeartHandshakeIcon,
  ReceiptText,
  Users,
  Pill,
} from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthContext();

  const navMain = [
  
    {
      title: "Kasir",
      url: "/kasir",
      icon: <CreditCardIcon className="h-6 w-6" />,
    },
    {
      title: "Riwayat Transaksi",
      url: "/riwayat",
      icon: <ReceiptText className="h-5 w-5" />, 
    },
    {
      title: "Data Pasien",
      url: "/pasien",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Stok Obat",
      url: "/stok",
      icon: <Pill className="h-5 w-5" />,
    },
    {
      title: "Pengaturan",
      url: "/pengaturan",
      icon: <SettingsIcon className="h-5 w-5" />, 
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-3 border-b-2">
          <div className="flex items-center justify-center bg-[#29B5A8] text-primary-foreground rounded-lg h-10 w-10">
            <HeartHandshakeIcon className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold">Klinik Payment</span>
            <span className="text-sm text-muted-foreground">Sistem Kasir</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name || "Kasir",
            email: user?.email || "kasir@klinik.com",
            avatar: "/avatars/default.jpg",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
