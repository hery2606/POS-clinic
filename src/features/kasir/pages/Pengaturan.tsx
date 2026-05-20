import { useEffect, useState } from 'react';
import { Settings } from '../pengaturan/Settings';
import { SettingsSidebarNav } from '../pengaturan/SettingsSidebarNav';
import { useRightPanel } from '../context/right-panel-context';

export const SettingsPage = () => {
  const { clearContent, setContent } = useRightPanel();
  const [activeTab, setActiveTab] = useState("umum");

  useEffect(() => {
    clearContent();

    return () => {
      setContent('payment');
    };
  }, [clearContent, setContent]);

  return (
    <div className="w-full h-full flex bg-[#F9FEFC]/50 overflow-hidden">
      {/* SIDEBAR NAVIGATION */}
      <SettingsSidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* SETTINGS CONTENT */}
      <Settings activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};
