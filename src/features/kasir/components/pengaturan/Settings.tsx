"use client";

import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { settingsTabs } from "./settingsTabsConfig";
import { GeneralSettings } from "./components/GeneralSettings";
import { PrinterSettings } from "./components/PrinterSettings";
import { NotificationSettings } from "./components/NotificationSettings";
import { BillingSettings } from "./components/BillingSettings";
import { SecuritySettings } from "./components/SecuritySettings";
import { UserManagement } from "./components/UserManagement";
import { useState } from "react";

interface PrinterSettingsData {
  name: string;
  model: string;
  status: "connected" | "disconnected";
}

interface NotificationSettingsData {
  emailNotifications: boolean;
  smsNotifications: boolean;
  lowStockAlert: boolean;
  paymentConfirmation: boolean;
}

interface BillingSettingsData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  taxId: string;
  invoicePrefix: string;
  receiptFormat: "thermal" | "a4";
}

interface SettingsProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function Settings({ activeTab, onTabChange }: SettingsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [printerSettings, setPrinterSettings] = useState<PrinterSettingsData>({
    name: "Printer Kasir 01",
    model: "Thermal Printer 80mm",
    status: "connected",
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsData>({
    emailNotifications: true,
    smsNotifications: false,
    lowStockAlert: true,
    paymentConfirmation: true,
  });

  const [billingSettings, setBillingSettings] = useState<BillingSettingsData>({
    companyName: "Klinik Mitra Sehat",
    companyAddress: "Jl. Melati No. 45, Sleman, Yogyakarta 55284",
    companyPhone: "+62 274 1234567",
    taxId: "01.123.456.7-123.000",
    invoicePrefix: "INV",
    receiptFormat: "thermal",
  });

  const currentTabInfo = settingsTabs.find((t: { id: string; }) => t.id === activeTab);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <>
      {/* DETAILED CONTENT WORKSPACE */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-5xl mx-auto p-6 sm:p-8 lg:p-10">
          
          {/* CONTENT PANEL HEADER */}
          <div className="mb-8 border-b border-[#DFE6EB] pb-5">
            <h1 className="text-lg font-bold text-[#13222D]">
              {currentTabInfo?.label}
            </h1>
            <p className="text-[#67737C] text-xs font-medium mt-1">
              {currentTabInfo?.description}
            </p>
          </div>

          {/* DYNAMIC FORM VIEWS */}
          <div className="w-full">
            {activeTab === "umum" && <GeneralSettings />}
            {activeTab === "printer" && (
              <PrinterSettings settings={printerSettings} onUpdate={setPrinterSettings} />
            )}
            {activeTab === "notifikasi" && (
              <NotificationSettings settings={notificationSettings} onUpdate={setNotificationSettings} />
            )}
            {activeTab === "billing" && (
              <BillingSettings settings={billingSettings} onUpdate={setBillingSettings} />
            )}
            {activeTab === "keamanan" && <SecuritySettings />}
            {activeTab === "pengguna" && <UserManagement />}
          </div>

          {/* SYSTEM OPERATION FOOTER BUTTONS */}
          <div className="flex items-center gap-3 mt-10 pt-6 border-t border-[#DFE6EB]">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#1B9C90] hover:bg-[#157A71] text-white font-bold h-11 px-6 rounded-xl flex items-center justify-center gap-2 border-none shadow-none transition-colors max-w-xs text-xs"
            >
              {isSaving ? (
                <>
                  <span className="inline-block animate-spin">⚙️</span>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="px-6 border-[#DFE6EB] text-[#67737C] hover:bg-[#EFF4F8] h-11 rounded-xl text-xs font-bold shadow-none"
            >
              Batal
            </Button>
          </div>

        </div>
      </div>

      {/* TOAST STATE BAR */}
      {saveSuccess && (
        <div className="fixed bottom-6 right-6 bg-[#1B9C90] text-white px-5 py-3 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2 animate-in fade-in-0 slide-in-from-bottom-2">
          <span>✓</span>
          <span>Pengaturan berhasil disimpan</span>
        </div>
      )}
    </>
  );
}