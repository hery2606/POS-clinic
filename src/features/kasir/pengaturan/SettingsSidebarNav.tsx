"use client";

import { cn } from "@/lib/utils";
import { settingsTabs } from "./settingsTabsConfig";

interface SettingsSidebarNavProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function SettingsSidebarNav({ activeTab, onTabChange }: SettingsSidebarNavProps) {
  return (
    <div className="w-72 border-r rounded-2xl border-[#1A2632] bg-[#0D1A23] overflow-hidden flex flex-col h-full shrink-0">
      <div className="p-6">
        <h2 className="text-base font-bold text-white mb-4 tracking-wide px-2">
          Pengaturan
        </h2>
        
        <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-none">
          {settingsTabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3  transition-all duration-200 text-left relative overflow-hidden group",
                  isSelected
                    ? "bg-[#13272F] text-[#29B5A8]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                {/* Indikator Garis Aktif Sisi Kiri */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1B9C90] rounded-r-md" />
                )}

                <div 
                  className={cn(
                    "w-5 h-5 shrink-0 flex items-center justify-center transition-colors",
                    isSelected ? "text-[#29B5A8]" : "text-slate-400 group-hover:text-white"
                  )}
                >
                  {tab.icon}
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-xs tracking-wide">{tab.label}</p>
                  <p className={cn("text-[11px] truncate mt-0.5 font-medium", isSelected ? "text-[#29B5A8]/80" : "text-slate-500")}>
                    {tab.description}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}