'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Lock, 
  Database, 
  LogOut, 
  Activity,
  ChevronRight
} from 'lucide-react';
import { ChangePasswordSection } from '@/features/analitik/components/pengaturan/ChangePasswordSection';
import { BackupDataSection } from '@/features/analitik/components/pengaturan/BackupDataSection';
import { ActivityLogSection } from '@/features/analitik/components/pengaturan/ActivityLogSection';
import { SessionManagementSection } from '@/features/analitik/components/pengaturan/SessionManagementSection';

export const AdminSecurityPanel = () => {
  const [activeTab, setActiveTab] = useState<'password' | 'backup' | 'activity' | 'session'>('password');

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
        <h1 className="text-2xl font-bold text-[#13222D] mb-2">Keamanan Admin</h1>
        <p className="text-sm text-[#67737C]">Kelola pengaturan keamanan dan aktivitas akun admin Anda</p>
      </div>

      {/* Security Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {securityMenus.map((menu) => {
          const Icon = menu.icon;
          const isActive = activeTab === menu.id;
          
          return (
            <button
              key={menu.id}
              onClick={() => setActiveTab(menu.id as any)}
              className={`
                p-4 rounded-[16px] border-2 transition-all duration-200 text-left
                ${isActive 
                  ? 'border-[#1B9C90] bg-[#F4FBF9]' 
                  : 'border-[#DFE6EB] bg-white hover:border-[#1B9C90]/30'
                }
              `}
            >
              <div className={`${menu.bgColor} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${menu.color}`} />
              </div>
              <h3 className="font-semibold text-[#13222D] text-sm mb-1">{menu.title}</h3>
              <p className="text-xs text-[#67737C]">{menu.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className={`text-xs font-semibold ${isActive ? 'text-[#1B9C90]' : 'text-[#67737C]'}`}>
                  {isActive ? 'Aktif' : 'Buka'}
                </span>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-[#1B9C90] translate-x-1' : 'text-[#DFE6EB]'}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Content Section */}
      <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm">
        {activeTab === 'password' && <ChangePasswordSection />}
        {activeTab === 'backup' && <BackupDataSection />}
        {activeTab === 'activity' && <ActivityLogSection />}
        {activeTab === 'session' && <SessionManagementSection />}
      </Card>
    </div>
  );
};
