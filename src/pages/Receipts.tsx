
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ReceiptsDashboard from "@/components/ReceiptsDashboard";

const Receipts: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <ReceiptsDashboard />
      </div>
    </DashboardLayout>
  );
};

export default Receipts;
