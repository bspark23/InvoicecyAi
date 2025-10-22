import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Receipt } from 'lucide-react';
import { usePaymentReceipts } from '@/hooks/usePaymentReceipts';
import { useAuthLocal } from '@/hooks/useAuthLocal';
import { PaymentReceipt, paymentMethods } from '@/types/receipt';
import { v4 as uuidv4 } from 'uuid';

interface PaymentFormProps {
  invoiceNumber?: string;
  onReceiptCreated?: (receipt: PaymentReceipt) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ invoiceNumber, onReceiptCreated }) => {
  const { user } = useAuthLocal();
  const { saveReceipt } = usePaymentReceipts();
  
  const [formData, setFormData] = useState({
    invoiceNumber: invoiceNumber || '',
    payerName: '',
    payerEmail: '',
    payerAddress: '',
    amountPaid: '',
    paymentMethod: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
    currency: 'USD'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get business info from user profile or use defaults
  const businessName = user?.profileName || user?.email || 'Your Business';
  const businessEmail = user?.email || 'business@example.com';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const receiptData: Omit<PaymentReceipt, 'id' | 'receiptNumber' | 'createdAt' | 'updatedAt'> = {
        invoiceId: `inv-${Date.now()}`,
        invoiceNumber: formData.invoiceNumber,
        payerName: formData.payerName,
        payerEmail: formData.payerEmail || undefined,
        payerAddress: formData.payerAddress || undefined,
        payeeName: businessName,
        payeeEmail: businessEmail,
        payeeAddress: 'Business Address', // Could be enhanced with user profile
        amountPaid: parseFloat(formData.amountPaid),
        paymentMethod: formData.paymentMethod,
        paymentDate: formData.paymentDate,
        notes: formData.notes || undefined,
        currency: formData.currency,
      };

      const receipt = saveReceipt(receiptData);
      
      // Reset form
      setFormData({
        invoiceNumber: '',
        payerName: '',
        payerEmail: '',
        payerAddress: '',
        amountPaid: '',
        paymentMethod: '',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: '',
        currency: 'USD'
      });

      onReceiptCreated?.(receipt);
      
      alert('Payment receipt created successfully!');
    } catch (error) {
      console.error('Error creating receipt:', error);
      alert('Failed to create receipt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          Record Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleInputChange}
                placeholder="INV-2024-001"
                required
              />
            </div>
            <div>
              <Label htmlFor="amountPaid">Amount Paid</Label>
              <Input
                id="amountPaid"
                name="amountPaid"
                type="number"
                step="0.01"
                value={formData.amountPaid}
                onChange={handleInputChange}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => handleSelectChange('paymentMethod', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paymentDate">Payment Date</Label>
              <Input
                id="paymentDate"
                name="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Payer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Payer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="payerName">Payer Name</Label>
                <Input
                  id="payerName"
                  name="payerName"
                  value={formData.payerName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="payerEmail">Payer Email (Optional)</Label>
                <Input
                  id="payerEmail"
                  name="payerEmail"
                  type="email"
                  value={formData.payerEmail}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="payerAddress">Payer Address (Optional)</Label>
              <Textarea
                id="payerAddress"
                name="payerAddress"
                value={formData.payerAddress}
                onChange={handleInputChange}
                placeholder="123 Main St, City, State, ZIP"
                rows={2}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional payment notes..."
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Creating Receipt...' : 'Create Payment Receipt'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
