
import React from "react";

// Placeholder for invoice generation form
const InvoiceGenSection: React.FC = () => {
  return (
    <div className="rounded-2xl shadow-lg bg-white p-7 mb-3">
      <h2 className="font-bold text-xl text-blue-900 mb-4">Create Invoice</h2>
      <div className="text-gray-500 mb-2">[Invoice generation form goes here]</div>
      {/* TODO: Compose with all item input, client select, terms/notes, auto-totals, etc. */}
    </div>
  );
};

export default InvoiceGenSection;
