
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PrintView from "@/components/PrintView";

const PrintPreviewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Receive via router location.state (from dashboard)
  const state = location.state as any;

  if (!state) {
    // No preview data? Go back
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-10">
          <p className="font-medium mb-4">No invoice data provided for print preview.</p>
          <button
            className="bg-blue-600 px-4 py-2 rounded text-white font-semibold"
            onClick={() => navigate("/dashboard")}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <PrintView
      invoiceData={state.form}
      formatCurrency={state.formatCurrency}
      calculateSubtotal={() => state.subtotal}
      calculateTax={() => state.tax}
      calculateTotal={() => state.total}
      customTemplateContent={null}
      onBack={() => navigate("/dashboard")}
    />
  );
};

export default PrintPreviewPage;
