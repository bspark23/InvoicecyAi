
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LPOData } from "@/types/lpo";

interface LPOTemplateProps {
  lpoData: LPOData;
  formatCurrency?: (amount: number) => string;
}

const LPOTemplate: React.FC<LPOTemplateProps> = ({
  lpoData,
  formatCurrency = (amount) => `$${amount.toFixed(2)}`
}) => {
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
              {lpoData.companyLogo && (
                <img 
                  src={lpoData.companyLogo} 
                  alt="Company Logo" 
                  className="h-16 w-auto mb-4"
                />
              )}
              <h1 className="text-3xl font-bold text-blue-600">LOCAL PURCHASE ORDER</h1>
              <p className="text-gray-600 mt-1">#{lpoData.lpoNumber}</p>
            </div>
            <div className="text-right">
              <div className="space-y-2">
                <div className="flex justify-between items-center gap-4">
                  <span className="text-gray-600">Issue Date:</span>
                  <span className="font-medium">{lpoData.issueDate}</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-gray-600">Delivery Date:</span>
                  <span className="font-medium">{lpoData.deliveryDate}</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={lpoData.status === 'approved' ? 'default' : 'secondary'}>
                    {lpoData.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Buyer and Supplier Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Buyer Details:</h3>
              <div className="text-gray-700">
                <p className="font-medium">{lpoData.buyerCompanyName}</p>
                <div className="whitespace-pre-line mt-1">{lpoData.buyerAddress}</div>
                <p className="mt-2">
                  <span className="font-medium">Contact:</span> {lpoData.buyerContactName}
                </p>
                <p>{lpoData.buyerContactEmail}</p>
                <p>{lpoData.buyerContactPhone}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Supplier Details:</h3>
              <div className="text-gray-700">
                <p className="font-medium">{lpoData.supplierName}</p>
                <div className="whitespace-pre-line mt-1">{lpoData.supplierAddress}</div>
                <p className="mt-2">
                  <span className="font-medium">Contact:</span> {lpoData.supplierContactName}
                </p>
                <p>{lpoData.supplierContactEmail}</p>
                <p>{lpoData.supplierContactPhone}</p>
              </div>
            </div>
          </div>

          {/* Delivery Terms */}
          {lpoData.deliveryTerms && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Terms:</h3>
              <p className="text-gray-700">{lpoData.deliveryTerms}</p>
            </div>
          )}

          {/* Line Items */}
          <div className="mb-8">
            <div className="bg-blue-50 px-4 py-3 rounded-t-lg">
              <div className="grid grid-cols-12 gap-4 font-semibold text-gray-900">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Unit Price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
            </div>
            <div className="border border-t-0 rounded-b-lg">
              {lpoData.lineItems.map((item, index) => (
                <div key={item.id} className={`px-4 py-3 grid grid-cols-12 gap-4 ${index !== lpoData.lineItems.length - 1 ? 'border-b border-gray-200' : ''}`}>
                  <div className="col-span-6 text-gray-700">{item.description}</div>
                  <div className="col-span-2 text-center text-gray-700">{item.quantity}</div>
                  <div className="col-span-2 text-center text-gray-700">{formatCurrency(item.unitPrice)}</div>
                  <div className="col-span-2 text-right font-medium text-gray-900">{formatCurrency(item.total)}</div>
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
                  <span className="font-medium">{formatCurrency(lpoData.subtotal)}</span>
                </div>
                {lpoData.taxRate > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax ({lpoData.taxRate}%):</span>
                    <span className="font-medium">{formatCurrency(lpoData.taxAmount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(lpoData.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          {lpoData.additionalNotes && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Notes</h3>
              <div className="text-gray-700 whitespace-pre-line">{lpoData.additionalNotes}</div>
            </div>
          )}

          {/* Signature */}
          {lpoData.signatureImage && (
            <div className="mt-8 text-right">
              <img 
                src={lpoData.signatureImage} 
                alt="Signature" 
                className="h-16 w-auto ml-auto mb-2"
              />
              <div className="text-gray-600">
                {lpoData.signatureName && <p className="font-medium">{lpoData.signatureName}</p>}
                {lpoData.signaturePosition && <p>{lpoData.signaturePosition}</p>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default LPOTemplate;
