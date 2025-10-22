
import React from "react";
import { Home, FileText, Users, BarChart2, Layers } from "lucide-react";

// Simple sidebar, feel free to enhance with shadcn Sidebar
const DashboardSidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex flex-col w-56 border-r bg-white dark:bg-gray-900 min-h-screen shadow-lg">
      <nav className="flex flex-col py-8 gap-3 pl-5">
        <a href="#" className="flex items-center gap-3 text-blue-700 font-bold text-lg mb-8 hover-scale">
          <Home /> Dashboard
        </a>
        <a href="#" className="flex items-center gap-3 hover-scale">
          <Layers className="w-5 h-5" /> Profiles
        </a>
        <a href="#" className="flex items-center gap-3 hover-scale">
          <FileText className="w-5 h-5" /> Invoices
        </a>
        <a href="#" className="flex items-center gap-3 hover-scale">
          <Users className="w-5 h-5" /> Clients
        </a>
        <a href="#" className="flex items-center gap-3 hover-scale">
          <BarChart2 className="w-5 h-5" /> Analytics
        </a>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
