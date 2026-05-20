import React from "react";
import {
  Settings as SettingsIcon,
  Printer,
  Bell,
  Lock,
  Users,
  Receipt,
} from "lucide-react";

export interface SettingsTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export const settingsTabs: SettingsTab[] = [
  {
    id: "umum",
    label: "Umum",
    icon: <SettingsIcon className="w-4 h-4" />,
    description: "Pengaturan umum sistem",
  },
  {
    id: "printer",
    label: "Printer",
    icon: <Printer className="w-4 h-4" />,
    description: "Konfigurasi perangkat printer",
  },
  {
    id: "notifikasi",
    label: "Notifikasi",
    icon: <Bell className="w-4 h-4" />,
    description: "Atur preferensi notifikasi",
  },
  {
    id: "billing",
    label: "Billing & Invoice",
    icon: <Receipt className="w-4 h-4" />,
    description: "Pengaturan invoice dan billing",
  },
  {
    id: "keamanan",
    label: "Keamanan",
    icon: <Lock className="w-4 h-4" />,
    description: "Pengaturan keamanan akun",
  },
  {
    id: "pengguna",
    label: "Pengguna & Akses",
    icon: <Users className="w-4 h-4" />,
    description: "Kelola pengguna sistem",
  },
];