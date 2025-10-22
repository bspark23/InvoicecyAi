
import { InvoiceData, currencies } from "@/types/invoice";

export const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
  const currency = currencies.find(c => c.code === currencyCode);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'symbol'
  }).format(amount).replace(currencyCode, currency?.symbol || '$');
};

export const calculateSubtotal = (invoiceData: InvoiceData) => {
  return invoiceData.lineItems.reduce((sum, item) => sum + item.amount, 0);
};

export const calculateTax = (invoiceData: InvoiceData) => {
  return (calculateSubtotal(invoiceData) * invoiceData.taxRate) / 100;
};

export const calculateTotal = (invoiceData: InvoiceData) => {
  return calculateSubtotal(invoiceData) + calculateTax(invoiceData) - invoiceData.discountAmount;
};
