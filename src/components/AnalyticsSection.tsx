
import React from "react";

// Placeholder for analytics (charts)
const AnalyticsSection: React.FC = () => {
  return (
    <div className="rounded-2xl shadow-lg bg-white p-5 mb-3 flex flex-col gap-2">
      <h3 className="font-bold text-blue-900 mb-2">Dashboard Analytics</h3>
      <div className="text-gray-500 mb-2">[Charts showing invoice status & totals]</div>
      {/* TODO: Use recharts for bar/pie charts */}
    </div>
  );
};

export default AnalyticsSection;
