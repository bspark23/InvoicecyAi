
import React from "react";

interface Props {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

const InvoiceTotals: React.FC<Props> = ({ subtotal, tax, discount, total }) => (
  <div className="w-full max-w-2xl mx-auto bg-slate-50 dark:bg-gray-800 rounded-xl p-4 mt-6 shadow">
    <div className="flex flex-col sm:flex-row sm:gap-8 text-sm sm:text-base">
      <div className="flex-1">
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">Tax</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">Discount</span>
          <span className="font-medium">-${discount.toFixed(2)}</span>
        </div>
      </div>
      <div className="flex-1 flex items-end justify-end mt-4 sm:mt-0">
        <div>
          <span className="block text-gray-400">Total</span>
          <span className="block text-2xl font-bold text-blue-700">${total.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
        </div>
      </div>
    </div>
  </div>
);

export default InvoiceTotals;
