
import React from "react";
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen font-inter bg-gray-50 dark:bg-gray-900">
    <div className="py-7">
      <div className="max-w-4xl mx-auto w-full px-2">
        {children}
      </div>
    </div>
  </div>
);
export default DashboardLayout;
