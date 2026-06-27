import React from "react";
import { Clock, Calendar, CalendarDays, CalendarRange } from "lucide-react";

export type PeriodType = "daily" | "weekly" | "monthly" | "yearly";

export interface PeriodOption {
  id: PeriodType;
  label: string;
  icon: React.ReactNode;
}

export const periodOptions: PeriodOption[] = [
  { 
    id: "daily", 
    label: "Hari Ini (Aktif)", 
    icon: <Clock className="w-4 h-4" /> 
  },
  { 
    id: "monthly", 
    label: "Bulanan", 
    icon: <CalendarDays className="w-4 h-4" /> 
  },
  { 
    id: "yearly", 
    label: "Tahunan", 
    icon: <CalendarRange className="w-4 h-4" /> 
  },
];

export const monthOptions = [
  { value: "1", label: "Januari" },
  { value: "2", label: "Februari" },
  { value: "3", label: "Maret" },
  { value: "4", label: "April" },
  { value: "5", label: "Mei" },
  { value: "6", label: "Juni" },
  { value: "7", label: "Juli" },
  { value: "8", label: "Agustus" },
  { value: "9", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

const currentYear = new Date().getFullYear();
export const yearOptions = Array.from({ length: 5 }, (_, i) => String(currentYear - i)).reverse();