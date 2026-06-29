"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Lock, Database, LogOut, Activity, ChevronRight, UserPlus } from "lucide-react";
import { ChangePasswordSection } from "./components/ChangePasswordSection";
import { BackupDataSection } from "./components/BackupDataSection";
import { ActivityLogSection } from "./components/ActivityLogSection";
import { SessionManagementSection } from "./components/SessionManagementSection";
import { UserManagementSection } from "./components/UserManagementSection";

const MENUS = [
  { id: "password", icon: Lock, title: "Ubah Password", desc: "Perbarui password akun admin Anda", color: "text-blue-500", bg: "bg-blue-50" },
  { id: "user-management", icon: UserPlus, title: "Manajemen User", desc: "Kelola & tambah akun staf", color: "text-teal-500", bg: "bg-teal-50" },
  { id: "backup", icon: Database, title: "Backup Data", desc: "Kelola backup data sistem", color: "text-green-500", bg: "bg-green-50" },
  { id: "activity", icon: Activity, title: "Activity Log", desc: "Lihat riwayat aktivitas sistem", color: "text-purple-500", bg: "bg-purple-50" },
  { id: "session", icon: LogOut, title: "Session", desc: "Kelola sesi login admin", color: "text-red-500", bg: "bg-red-50" },
];

export const AdminSecurityPanel = () => {
  const [activeTab, setActiveTab] = useState("password");

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#13222D]">Keamanan Admin</h1>
        <p className="text-sm text-[#67737C] mt-2">Kelola pengaturan keamanan, tambah user, dan aktivitas akun admin Anda</p>
      </div>

      {/* Mobile Tabs */}
      <div className="lg:hidden flex overflow-x-auto gap-3 mb-6 pb-2 -mx-4 px-4">
        {MENUS.map((m) => {
          const Icon = m.icon;
          const active = activeTab === m.id;
          return (
            <button key={m.id} onClick={() => setActiveTab(m.id)} className={`shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 transition-all ${active ? "border-[#1B9C90] bg-[#F4FBF9] text-[#1B9C90]" : "border-[#DFE6EB] bg-white text-[#67737C]"}`}>
              <div className={`${m.bg} p-1.5 rounded-lg flex items-center justify-center`}><Icon className={`w-4 h-4 ${m.color}`} /></div>
              <span className="font-bold text-xs whitespace-nowrap">{m.title}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Grid */}
      <div className="hidden lg:grid grid-cols-5 gap-4 mb-6">
        {MENUS.map((m) => {
          const Icon = m.icon;
          const active = activeTab === m.id;
          return (
            <button key={m.id} onClick={() => setActiveTab(m.id)} className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col justify-between ${active ? "border-[#1B9C90] bg-[#F4FBF9]" : "border-[#DFE6EB] bg-white hover:border-[#1B9C90]/30"}`}>
              <div>
                <div className={`${m.bg} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}><Icon className={`w-5 h-5 ${m.color}`} /></div>
                <h3 className="font-semibold text-[#13222D] text-sm mb-1">{m.title}</h3>
                <p className="text-xs text-[#67737C]">{m.desc}</p>
              </div>
              <div className="mt-4 flex items-center justify-between w-full">
                <span className={`text-[11px] font-bold ${active ? "text-[#1B9C90]" : "text-[#67737C]"}`}>{active ? "Aktif" : "Buka"}</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${active ? "text-[#1B9C90] translate-x-1" : "text-[#DFE6EB]"}`} />
              </div>
            </button>
          );
        })}
      </div>

      <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-4 md:p-6 shadow-sm min-h-[400px]">
        {activeTab === "password" && <ChangePasswordSection />}
        {activeTab === "user-management" && <UserManagementSection />}
        {activeTab === "backup" && <BackupDataSection />}
        {activeTab === "activity" && <ActivityLogSection />}
        {activeTab === "session" && <SessionManagementSection />}
      </Card>
    </div>
  );
};
