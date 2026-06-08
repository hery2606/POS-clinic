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
 
];