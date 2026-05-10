import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './sidebar/app-sidebar';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
} from '@/components/ui/sidebar';

/**
 * Admin Dashboard Layout
 * Layout utama untuk dashboard admin dengan sidebar
 */
export const AnalitikLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-[#F9FEFC]">
        {/* Sidebar */}
        <Sidebar className="border-r border-[#DFE6EB]">
          <SidebarContent>
            <AppSidebar />
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AnalitikLayout;