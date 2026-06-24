'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Lock, 
  Database, 
  LogOut, 
  Activity,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { ChangePasswordSection } from '@/features/analitik/components/pengaturan/ChangePasswordSection';
import { BackupDataSection } from '@/features/analitik/components/pengaturan/BackupDataSection';
import { ActivityLogSection } from '@/features/analitik/components/pengaturan/ActivityLogSection';
import { SessionManagementSection } from '@/features/analitik/components/pengaturan/SessionManagementSection';
import { AddUserSection } from '@/features/analitik/components/pengaturan/AddUserSection';

export const AdminSecurityPanel = () => {
  const [activeTab, setActiveTab] = useState<'password' | 'backup' | 'activity' | 'session' | 'add-user'>('password');

  const securityMenus = [
    {
      id: 'password',
      icon: Lock,
      title: 'Ubah Password',
      description: 'Perbarui password akun admin Anda',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'add-user',
      icon: UserPlus,
      title: 'Tambah User',
      description: 'Buat akun staf baru',
      color: 'text-teal-500',
      bgColor: 'bg-teal-50'
    },
    {
      id: 'backup',
      icon: Database,
      title: 'Backup Data',
      description: 'Kelola backup data sistem',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      id: 'activity',
      icon: Activity,
      title: 'Activity Log',
      description: 'Lihat riwayat aktivitas sistem',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'session',
      icon: LogOut,
      title: 'Session Management',
      description: 'Kelola sesi login admin',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#13222D]">Keamanan Admin</h1>
        <p className="text-sm text-[#67737C] mt-2">Kelola pengaturan keamanan, tambah user, dan aktivitas akun admin Anda</p>
      </div>

      {/* Security Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {securityMenus.map((menu) => {
          const Icon = menu.icon;
          const isActive = activeTab === menu.id;
          
          return (
            <button
              key={menu.id}
              onClick={() => setActiveTab(menu.id as any)}
              className={`
                p-4 rounded-[16px] border-2 transition-all duration-200 text-left h-full flex flex-col justify-between
                ${isActive 
                  ? 'border-[#1B9C90] bg-[#F4FBF9]' 
                  : 'border-[#DFE6EB] bg-white hover:border-[#1B9C90]/30'
                }
              `}
            >
              <div>
                <div className={`${menu.bgColor} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${menu.color}`} />
                </div>
                <h3 className="font-semibold text-[#13222D] text-sm mb-1">{menu.title}</h3>
                <p className="text-xs text-[#67737C]">{menu.description}</p>
              </div>
              <div className="mt-4 flex items-center justify-between w-full">
                <span className={`text-[11px] font-bold ${isActive ? 'text-[#1B9C90]' : 'text-[#67737C]'}`}>
                  {isActive ? 'Aktif' : 'Buka'}
                </span>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-[#1B9C90] translate-x-1' : 'text-[#DFE6EB]'}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Content Section */}
      <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm min-h-[400px]">
        {activeTab === 'password' && <ChangePasswordSection />}
        {activeTab === 'add-user' && <AddUserSection />}
        {activeTab === 'backup' && <BackupDataSection />}
        {activeTab === 'activity' && <ActivityLogSection />}
        {activeTab === 'session' && <SessionManagementSection />}
      </Card>
    </div>
  );
};
