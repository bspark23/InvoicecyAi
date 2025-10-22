
import React, { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle } from "lucide-react";
import NewDashboardSidebar from "@/components/NewDashboardSidebar";
import NewDashboardContent from "@/components/NewDashboardContent";
import DarkModeToggle from "@/components/DarkModeToggle";
import SupportBubble from "@/components/SupportBubble";
import HelpCenter from "@/components/HelpCenter";
import ResponsiveNavButtons from "@/components/ResponsiveNavButtons";

const Dashboard: React.FC = () => {
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <NewDashboardSidebar />
        <div className="flex-1">
          <div className="flex justify-between items-center p-4 border-b bg-white">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <ResponsiveNavButtons 
                onHelpClick={() => setIsHelpCenterOpen(true)}
                onChatClick={() => setIsHelpCenterOpen(true)}
              />
              <DarkModeToggle />
            </div>
          </div>
          <NewDashboardContent />
        </div>
        
        {/* Support Bubble */}
        <SupportBubble onHelpClick={() => setIsHelpCenterOpen(true)} />
        
        {/* Help Center Modal */}
        <HelpCenter 
          isOpen={isHelpCenterOpen} 
          onClose={() => setIsHelpCenterOpen(false)} 
        />
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
