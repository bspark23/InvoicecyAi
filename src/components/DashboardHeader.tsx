
import React from "react";

const DashboardHeader: React.FC = () => (
  <header className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5">
    <div>
      <h1 className="text-3xl font-bold text-blue-900">Invoicer Pro</h1>
      <span className="block text-gray-700 text-base mt-1 font-medium">Simple invoicing App</span>
    </div>
    {/* Could add logo or controls here if needed */}
  </header>
);

export default DashboardHeader;
