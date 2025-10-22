
import React from "react";
import { PaymentReceipt } from "@/types/receipt";
import { formatCurrency } from "@/utils/invoiceUtils";

interface ReceiptTemplateProps {
  receipt: PaymentReceipt;
}

const ReceiptTemplate: React.FC<ReceiptTemplateProps> = ({ receipt }) => {
  return (
    <div id={`receipt-${receipt.id}`} className="max-w-2xl mx-auto bg-white p-8 shadow-lg print:shadow-none">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">PAYMENT RECEIPT</h1>
        <p className="text-lg text-gray-600">Receipt #{receipt.receiptNumber}</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">From (Payee)</h3>
          <div className="space-y-1 text-gray-700">
            <p className="font-medium">{receipt.payeeName}</p>
            {receipt.payeeEmail && <p>{receipt.payeeEmail}</p>}
            {receipt.payeeAddress && <p>{receipt.payeeAddress}</p>}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">To (Payer)</h3>
          <div className="space-y-1 text-gray-700">
            <p className="font-medium">{receipt.payerName}</p>
            {receipt.payerEmail && <p>{receipt.payerEmail}</p>}
            {receipt.payerAddress && <p>{receipt.payerAddress}</p>}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Receipt Date</p>
            <p className="font-medium">{new Date(receipt.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Payment Date</p>
            <p className="font-medium">{new Date(receipt.paymentDate).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Related Invoice</p>
            <p className="font-medium">{receipt.invoiceNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Payment Method</p>
            <p className="font-medium">{receipt.paymentMethod}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold text-gray-800">Amount Paid</span>
          <span className="text-2xl font-bold text-green-600">
            {formatCurrency(receipt.amountPaid, receipt.currency)}
          </span>
        </div>
      </div>

      {receipt.notes && (
        <div className="mb-6">
          <h4 className="font-semibold mb-2 text-gray-800">Notes</h4>
          <p className="text-gray-700 bg-gray-50 p-3 rounded">{receipt.notes}</p>
        </div>
      )}

      <div className="border-t border-gray-200 pt-6 text-center">
        <p className="text-sm text-gray-500">
          This receipt was generated on {new Date(receipt.createdAt).toLocaleDateString()} at {new Date(receipt.createdAt).toLocaleTimeString()}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Thank you for your payment!
        </p>
      </div>
    </div>
  );
};

export default ReceiptTemplate;
