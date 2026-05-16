import React from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./sidebar/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AnalitikHeader } from "./Analitik-header";

export const AnalitikLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden bg-[#F9FEFC]">
        <div className="sticky top-0 z-20 bg-[#F9FEFC] px-6 lg:px-8 pt-6 border-b-2 ">
          <AnalitikHeader />
        </div>

        <SidebarInset className="flex-1 overflow-hidden bg-[#F5F7FA]">
          <main className="h-full overflow-y-auto px-6 lg:px-8 py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AnalitikLayout;
