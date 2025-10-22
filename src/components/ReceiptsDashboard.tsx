
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Eye, Plus, Receipt } from 'lucide-react';
import { usePaymentReceipts } from '@/hooks/usePaymentReceipts';
import { useAuthLocal } from '@/hooks/useAuthLocal';
import PaymentForm from './PaymentForm';
import ReceiptTemplate from './ReceiptTemplate';
import { formatCurrency } from '@/utils/invoiceUtils';
import { PaymentReceipt } from '@/types/receipt';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const ReceiptsDashboard: React.FC = () => {
  const { user } = useAuthLocal();
  const { receipts } = usePaymentReceipts();
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);

  // Filter receipts based on search
  const filteredReceipts = receipts.filter(receipt =>
    receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.payerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadReceipt = async (receipt: PaymentReceipt) => {
    setSelectedReceipt(receipt);
    setShowReceiptPreview(true);
    
    // Wait for the preview to render
    setTimeout(async () => {
      const element = document.getElementById('receipt-preview');
      if (!element) return;

      try {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`receipt-${receipt.receiptNumber}.pdf`);
        
        setShowReceiptPreview(false);
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    }, 500);
  };

  const handleViewReceipt = (receipt: PaymentReceipt) => {
    setSelectedReceipt(receipt);
    setShowReceiptPreview(true);
  };

  if (showPaymentForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Record New Payment</h2>
          <Button variant="outline" onClick={() => setShowPaymentForm(false)}>
            Back to Receipts
          </Button>
        </div>
        <PaymentForm onReceiptCreated={() => setShowPaymentForm(false)} />
      </div>
    );
  }

  if (showReceiptPreview && selectedReceipt) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Receipt Preview</h2>
          <div className="flex gap-2">
            <Button onClick={() => handleDownloadReceipt(selectedReceipt)}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={() => setShowReceiptPreview(false)}>
              Close
            </Button>
          </div>
        </div>
        <div id="receipt-preview">
          <ReceiptTemplate receipt={selectedReceipt} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Receipt className="w-6 h-6" />
          Payment Receipts
        </h2>
        <Button onClick={() => setShowPaymentForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Record Payment
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search receipts by number, invoice, or payer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{receipts.length}</p>
              <p className="text-gray-600">Total Receipts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {formatCurrency(receipts.reduce((sum, r) => sum + r.amountPaid, 0))}
              </p>
              <p className="text-gray-600">Total Received</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {new Set(receipts.map(r => r.invoiceNumber)).size}
              </p>
              <p className="text-gray-600">Invoices Paid</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Receipts List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Receipts</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredReceipts.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'No receipts found matching your search.' : 'No payment receipts yet.'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowPaymentForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Record Your First Payment
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReceipts.map((receipt) => (
                <div
                  key={receipt.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{receipt.receiptNumber}</h3>
                        <Badge variant="outline">
                          Invoice: {receipt.invoiceNumber}
                        </Badge>
                        <Badge variant="secondary">
                          {receipt.paymentMethod}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Payer:</span> {receipt.payerName}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Amount:</span> {formatCurrency(receipt.amountPaid, receipt.currency)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Date:</span> {new Date(receipt.paymentDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewReceipt(receipt)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDownloadReceipt(receipt)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceiptsDashboard;
