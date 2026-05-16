import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Printer,
  Bell,
  Lock,
  Users,
  Receipt,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GeneralSettings } from './components/GeneralSettings';
import { PrinterSettings } from './components/PrinterSettings';
import { NotificationSettings } from './components/NotificationSettings';
import { BillingSettings } from './components/BillingSettings';
import { SecuritySettings } from './components/SecuritySettings';
import { UserManagement } from './components/UserManagement';

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface PrinterSettings {
  name: string;
  model: string;
  status: 'connected' | 'disconnected';
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  lowStockAlert: boolean;
  paymentConfirmation: boolean;
}

interface BillingSettings {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  taxId: string;
  invoicePrefix: string;
  receiptFormat: 'thermal' | 'a4';
}

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('umum');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [printerSettings, setPrinterSettings] = useState<PrinterSettings>({
    name: 'Printer Kasir 01',
    model: 'Thermal Printer 80mm',
    status: 'connected',
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    lowStockAlert: true,
    paymentConfirmation: true,
  });

  const [billingSettings, setBillingSettings] = useState<BillingSettings>({
    companyName: 'Klinik Mitra Sehat',
    companyAddress: 'Jl. Melati No. 45, Sleman, Yogyakarta 55284',
    companyPhone: '+62 274 1234567',
    taxId: '01.123.456.7-123.000',
    invoicePrefix: 'INV',
    receiptFormat: 'thermal',
  });

  const tabs: SettingsTab[] = [
    {
      id: 'umum',
      label: 'Umum',
      icon: <SettingsIcon className="w-4 h-4" />,
      description: 'Pengaturan umum sistem',
    },
    {
      id: 'printer',
      label: 'Printer',
      icon: <Printer className="w-4 h-4" />,
      description: 'Konfigurasi perangkat printer',
    },
    {
      id: 'notifikasi',
      label: 'Notifikasi',
      icon: <Bell className="w-4 h-4" />,
      description: 'Atur preferensi notifikasi',
    },
    {
      id: 'billing',
      label: 'Billing & Invoice',
      icon: <Receipt className="w-4 h-4" />,
      description: 'Pengaturan invoice dan billing',
    },
    {
      id: 'keamanan',
      label: 'Keamanan',
      icon: <Lock className="w-4 h-4" />,
      description: 'Pengaturan keamanan akun',
    },
    {
      id: 'pengguna',
      label: 'Pengguna & Akses',
      icon: <Users className="w-4 h-4" />,
      description: 'Kelola pengguna sistem',
    },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="w-full h-[calc(100vh-110px)] flex bg-[#f8fafc]">
      {/* SIDEBAR - FIXED */}
      <div className="w-72 border-r border-[#DFE6EB] bg-white overflow-hidden flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#13222D] mb-6">Pengaturan</h2>
          <nav className="space-y-2 overflow-y-auto max-h-[calc(100vh-180px)]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
                  activeTab === tab.id
                    ? "bg-[#1B9C90] text-white shadow-md"
                    : "text-[#67737C] hover:bg-[#EFF4F8]"
                )}
              >
                <div 
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    activeTab === tab.id ? "text-white" : "text-[#1B9C90]"
                  )}
                >
                  {tab.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm">{tab.label}</p>
                  <p className={cn("text-xs", activeTab === tab.id ? "text-white/80" : "text-[#67737C]")}>
                    {tab.description}
                  </p>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* CONTENT - SCROLLABLE ONLY */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-8 lg:p-12">
          {/* HEADER */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-[#13222D] mb-2">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-[#67737C] text-base">
              {tabs.find(t => t.id === activeTab)?.description}
            </p>
          </div>

          {/* CONTENT AREA - Full width with responsive grid */}
          <div className="w-full">
            {activeTab === 'umum' && <GeneralSettings />}
            {activeTab === 'printer' && (
              <PrinterSettings settings={printerSettings} onUpdate={setPrinterSettings} />
            )}
            {activeTab === 'notifikasi' && (
              <NotificationSettings settings={notificationSettings} onUpdate={setNotificationSettings} />
            )}
            {activeTab === 'billing' && (
              <BillingSettings settings={billingSettings} onUpdate={setBillingSettings} />
            )}
            {activeTab === 'keamanan' && <SecuritySettings />}
            {activeTab === 'pengguna' && <UserManagement />}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 mt-12">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 max-w-xs bg-[#1B9C90] hover:bg-[#169B8A] text-white font-bold h-11 rounded-md shadow-md transition-all"
            >
              {isSaving ? (
                <>
                  <span className="inline-block animate-spin mr-2">⚙️</span>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="px-6 border-[#DFE6EB] text-[#67737C] hover:bg-[#EFF4F8]"
            >
              Batal
            </Button>
          </div>

          {/* EXTRA SPACING FOR SCROLL */}
          <div className="h-8" />

          {/* SUCCESS MESSAGE */}
          {saveSuccess && (
            <div className="fixed bottom-6 right-6 bg-[#1B9C90] text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in-0 slide-in-from-bottom-2">
              <span className="text-green-300">✓</span>
              Pengaturan berhasil disimpan
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
