
import React from "react";
import { InvoiceData } from "@/types/invoice";

interface Props {
  invoiceData: InvoiceData;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
}

/**
 * Invoice template styled similar to the user-provided corporate image.
 */
const InvoiceTemplateCorporate: React.FC<Props> = ({
  invoiceData,
  formatCurrency,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-xl border max-w-2xl mx-auto text-gray-800 font-sans text-sm" style={{minWidth: 350}}>
      {/* Top header */}
      <div className="rounded-t-xl" style={{background: "#232b38"}}>
        <div className="flex justify-between items-center px-8 py-4">
          <div>
            {invoiceData.businessLogo ? (
              <img src={invoiceData.businessLogo} alt="Logo" className="w-14 h-14 object-contain mb-2" />
            ) : (
              <div className="w-14 h-14 bg-gray-200 flex items-center justify-center rounded mb-2 text-xs">Logo</div>
            )}
            <span className="block text-xs text-gray-100 font-bold uppercase -mt-2">{invoiceData.businessName || "Brand Name"}</span>
            <span className="block text-xs text-gray-200">{invoiceData.businessAddress}</span>
            <span className="block text-xs text-gray-200">{invoiceData.businessEmail}</span>
          </div>
          <div className="text-right">
            <span className="text-3xl tracking-wider font-bold text-yellow-400">INVOICE</span>
          </div>
        </div>
      </div>
      {/* Information Bar */}
      <div className="flex w-full text-xs font-medium" style={{borderBottom: "1.5px solid #e2e8f0"}}>
        <div className="bg-yellow-500 text-white px-6 py-2 rounded-tr-2xl rounded-br-2xl tracking-widest flex items-center" style={{minWidth:110}}>
          <span>Invoice# </span>
          <span className="font-semibold ml-1">{invoiceData.invoiceNumber}</span>
        </div>
        <div className="ml-auto flex gap-6 items-center px-4">
          <span className="text-gray-700">Date</span>
          <span className="text-gray-700 font-semibold">{invoiceData.invoiceDate}</span>
        </div>
      </div>
      {/* Bill to */}
      <div className="px-8 pt-5 pb-2">
        <span className="font-bold text-base">Invoice to:</span>{" "}
        <span className="font-semibold">{invoiceData.clientName || "Client Name"}</span>
        <div className="text-xs text-gray-700">{invoiceData.clientAddress}</div>
        <div className="text-xs text-gray-700">{invoiceData.clientEmail}</div>
      </div>

      {/* Line items Table */}
      <div className="px-8 pt-2">
        <div className="border rounded overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-5 bg-yellow-500 text-white font-bold text-xs border-b border-gray-200">
            <div className="py-2 pl-2">SL.</div>
            <div className="py-2">Item Description</div>
            <div className="py-2 text-right">Price</div>
            <div className="py-2 text-center">Qty.</div>
            <div className="py-2 text-right">Total</div>
          </div>
          {/* Table rows */}
          {invoiceData.lineItems.map((item, idx) => (
            <div className="grid grid-cols-5 border-b border-gray-100 bg-white" key={item.id}>
              <div className="py-2 pl-2">{idx + 1}</div>
              <div className="py-2">{item.description}</div>
              <div className="py-2 text-right">{formatCurrency(item.rate, invoiceData.currency)}</div>
              <div className="py-2 text-center">{item.quantity}</div>
              <div className="py-2 text-right">{formatCurrency(item.amount, invoiceData.currency)}</div>
            </div>
          ))}
          {/* Empty rows if less than 6 */}
          {Array.from({length: Math.max(0, 6 - invoiceData.lineItems.length)}).map((_, idx) => (
            <div className="grid grid-cols-5 border-b border-gray-100 bg-gray-50" key={"empty"+idx}>
              <div className="py-2 pl-2">&nbsp;</div>
              <div className="py-2">&nbsp;</div>
              <div className="py-2 text-right">&nbsp;</div>
              <div className="py-2 text-center">&nbsp;</div>
              <div className="py-2 text-right">&nbsp;</div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Info & Summary */}
      <div className="flex flex-col md:flex-row px-8 pt-4 pb-2 gap-4">
        {/* Payment and terms info */}
        <div className="flex-1 text-xs">
          <span className="text-gray-700 font-semibold">Thank you for your business</span>
          <div className="mt-2">
            <div>
              <span className="font-bold">Payment info:</span>
              <div className="ml-2">
                <div><span className="font-bold">Account:</span> 123456789</div>
                <div><span className="font-bold">Bank:</span> Example Bank</div>
                <div><span className="font-bold">IBAN:</span> 1234 5678 9012 3456</div>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <span className="font-bold">Terms & Conditions:</span>
            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</div>
            {invoiceData.notes && (
              <div className="mt-2">{invoiceData.notes}</div>
            )}
          </div>
        </div>
        {/* Totals */}
        <div className="flex-1 max-w-xs ml-auto space-y-1 text-base">
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-gray-700">Sub Total:</span>
            <span>{formatCurrency(calculateSubtotal(), invoiceData.currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-gray-700">Tax:</span>
            <span>{formatCurrency(calculateTax(), invoiceData.currency)}</span>
          </div>
          {invoiceData.discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-gray-700">Discount:</span>
              <span>-{formatCurrency(invoiceData.discountAmount, invoiceData.currency)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold bg-yellow-500 text-white px-4 py-1 mt-4 rounded">
            <span>Total:</span>
            <span>{formatCurrency(calculateTotal(), invoiceData.currency)}</span>
          </div>
        </div>
      </div>

      {/* Signature area */}
      <div className="flex px-8 pb-4 items-end justify-between mt-2">
        <span></span>
        <div className="flex flex-col items-end">
          {invoiceData.signatureImage && (
            <img src={invoiceData.signatureImage} alt="Signature" className="w-40 h-14 object-contain border rounded bg-white mb-1" />
          )}
          <span className="text-xs text-gray-500 border-t border-gray-300 pt-2">Authorised Sign</span>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="rounded-b-xl" style={{background: "#232b38", height: 10}}>
        <div className="bg-yellow-500 h-2 rounded-t-xl mt-[-8px]"></div>
      </div>
    </div>
  );
};

export default InvoiceTemplateCorporate;

