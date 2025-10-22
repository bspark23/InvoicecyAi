
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";
import { InvoiceData } from "@/types/invoice";

interface InvoiceTemplateMinimalistProps {
  invoiceData: InvoiceData;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
}

const InvoiceTemplateMinimalist: React.FC<InvoiceTemplateMinimalistProps> = ({
  invoiceData,
  formatCurrency,
  calculateSubtotal,
  calculateTax,
  calculateTotal
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editablePaymentTerms, setEditablePaymentTerms] = useState(invoiceData.paymentTerms || "Payment due within 30 days");
  const [editableBankDetails, setEditableBankDetails] = useState(invoiceData.bankDetails || "Bank: Example Bank\nAccount: 1234567890\nRouting: 123456789");
  const [editablePaymentInstructions, setEditablePaymentInstructions] = useState(invoiceData.paymentInstructions || "Please make payment to the account details provided above.");

  const handleSavePaymentInfo = () => {
    // Update the invoice data with edited payment information
    // This would typically update the parent component's state
    setIsEditing(false);
  };

  return (
    <>
      <style>{`
        @media print {
          .print-hide { display: none !important; }
        }
      `}</style>
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              {invoiceData.businessLogo && (
                <img 
                  src={invoiceData.businessLogo} 
                  alt="Business Logo" 
                  className="h-16 w-auto mb-4"
                />
              )}
              <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
              <p className="text-gray-600 mt-1">#{invoiceData.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold text-gray-900">{invoiceData.businessName}</h2>
              <div className="text-gray-600 mt-2 whitespace-pre-line">
                {invoiceData.businessAddress}
              </div>
              {invoiceData.businessEmail && (
                <p className="text-gray-600 mt-1">{invoiceData.businessEmail}</p>
              )}
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
              <div className="text-gray-700">
                <p className="font-medium">{invoiceData.clientName}</p>
                <div className="whitespace-pre-line mt-1">{invoiceData.clientAddress}</div>
                {invoiceData.clientEmail && (
                  <p className="mt-1">{invoiceData.clientEmail}</p>
                )}
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Invoice Date:</span>
                  <span className="font-medium">{invoiceData.invoiceDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-medium">{invoiceData.dueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={invoiceData.status === 'paid' ? 'default' : 'secondary'}>
                    {invoiceData.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-8">
            <div className="bg-gray-50 px-4 py-3 rounded-t-lg">
              <div className="grid grid-cols-12 gap-4 font-semibold text-gray-900">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
            </div>
            <div className="border border-t-0 rounded-b-lg">
              {invoiceData.lineItems.map((item, index) => (
                <div key={item.id} className={`px-4 py-3 grid grid-cols-12 gap-4 ${index !== invoiceData.lineItems.length - 1 ? 'border-b border-gray-200' : ''}`}>
                  <div className="col-span-6 text-gray-700">{item.description}</div>
                  <div className="col-span-2 text-center text-gray-700">{item.quantity}</div>
                  <div className="col-span-2 text-center text-gray-700">{formatCurrency(item.rate, invoiceData.currency)}</div>
                  <div className="col-span-2 text-right font-medium text-gray-900">{formatCurrency(item.amount, invoiceData.currency)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(calculateSubtotal(), invoiceData.currency)}</span>
                </div>
                {invoiceData.taxRate > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax ({invoiceData.taxRate}%):</span>
                    <span className="font-medium">{formatCurrency(calculateTax(), invoiceData.currency)}</span>
                  </div>
                )}
                {invoiceData.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium">-{formatCurrency(invoiceData.discountAmount, invoiceData.currency)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(calculateTotal(), invoiceData.currency)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information - Editable Section */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => isEditing ? handleSavePaymentInfo() : setIsEditing(true)}
                className="print-hide"
              >
                {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                {isEditing ? (
                  <Input
                    value={editablePaymentTerms}
                    onChange={(e) => setEditablePaymentTerms(e.target.value)}
                    placeholder="Payment terms"
                    className="print-hide"
                  />
                ) : (
                  <p className="text-gray-700">{editablePaymentTerms}</p>
                )}
                {isEditing && <p className="text-gray-700 hidden print:block">{editablePaymentTerms}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Details</label>
                {isEditing ? (
                  <Textarea
                    value={editableBankDetails}
                    onChange={(e) => setEditableBankDetails(e.target.value)}
                    placeholder="Bank details"
                    rows={3}
                    className="print-hide"
                  />
                ) : (
                  <div className="text-gray-700 whitespace-pre-line">{editableBankDetails}</div>
                )}
                {isEditing && <div className="text-gray-700 whitespace-pre-line hidden print:block">{editableBankDetails}</div>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Instructions</label>
                {isEditing ? (
                  <Textarea
                    value={editablePaymentInstructions}
                    onChange={(e) => setEditablePaymentInstructions(e.target.value)}
                    placeholder="Payment instructions"
                    rows={2}
                    className="print-hide"
                  />
                ) : (
                  <p className="text-gray-700">{editablePaymentInstructions}</p>
                )}
                {isEditing && <p className="text-gray-700 hidden print:block">{editablePaymentInstructions}</p>}
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoiceData.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
              <div className="text-gray-700 whitespace-pre-line">{invoiceData.notes}</div>
            </div>
          )}

          {/* Signature */}
          {invoiceData.signatureImage && (
            <div className="mt-8 text-right">
              <img 
                src={invoiceData.signatureImage} 
                alt="Signature" 
                className="h-16 w-auto ml-auto mb-2"
              />
              <div className="text-gray-600">
                {invoiceData.signatureName && <p className="font-medium">{invoiceData.signatureName}</p>}
                {invoiceData.signaturePosition && <p>{invoiceData.signaturePosition}</p>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default InvoiceTemplateMinimalist;
