
import React from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InvoiceForm from "@/components/InvoiceForm";
import InvoiceTotals from "@/components/InvoiceTotals";

interface PrintPreviewModalProps {
  open: boolean;
  onClose: () => void;
  form: any;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
}

const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  open,
  onClose,
  form,
  subtotal,
  tax,
  discount,
  total,
  currency,
}) => {
  // Format numbers for print using Intl.NumberFormat
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-lg w-full p-6 relative animate-fade-in">
          <button
            className="absolute top-2 right-2 p-1 rounded text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onClose}
            aria-label="Close preview"
          >
            ×
          </button>
          <h2 className="text-xl font-bold mb-4">Invoice Print Preview</h2>
          {/* Mini preview - real print preview would require larger integration */}
          <div className="border p-4 mb-4 rounded bg-gray-50 dark:bg-gray-800">
            <div className="mb-2">
              <strong>Client:</strong> {form.clientName}
            </div>
            <div className="mb-2">
              <strong>Invoice #: </strong> {form.invoiceNumber}
            </div>
            <div className="mb-2">
              <strong>Date:</strong> {form.invoiceDate}
            </div>
            <div className="mb-4">
              <strong>Due:</strong> {form.dueDate}
            </div>
            <div className="mb-3">
              <strong>Items:</strong>
              <ul className="list-disc pl-6 text-sm">
                {form.items.map((item: any) => (
                  <li key={item.id}>
                    {item.description} &times; {item.quantity} @ {formatter.format(item.rate)} = {formatter.format(item.amount)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-2 flex justify-between">
              <span>Subtotal:</span>
              <span>{formatter.format(subtotal)}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span>Tax:</span>
              <span>{formatter.format(tax)}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span>Discount:</span>
              <span>-{formatter.format(discount)}</span>
            </div>
            <div className="font-bold text-lg flex justify-between border-t pt-2 mt-2">
              <span>Total:</span>
              <span>{formatter.format(total)}</span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => window.print()}
            >
              Print
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PrintPreviewModal;
