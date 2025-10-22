
export interface PaymentReceipt {
  id: string;
  receiptNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  payerName: string;
  payerEmail?: string;
  payerAddress?: string;
  payeeName: string;
  payeeEmail?: string;
  payeeAddress?: string;
  amountPaid: number;
  paymentMethod: string;
  paymentDate: string;
  notes?: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export const paymentMethods = [
  'Cash',
  'Bank Transfer',
  'Credit Card',
  'Debit Card',
  'Check',
  'PayPal',
  'Stripe',
  'Mobile Payment',
  'Other'
];
