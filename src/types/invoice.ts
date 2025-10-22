
export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  businessName: string;
  businessEmail: string;
  businessAddress: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  invoiceDate: string;
  dueDate: string;
  lineItems: LineItem[];
  currency: string;
  taxRate: number;
  discountAmount: number;
  status: 'paid' | 'unpaid';
  notes: string;
  businessLogo?: string;
  signatureImage?: string;
  signatureName?: string;
  signaturePosition?: string;
  paymentTerms?: string;
  bankDetails?: string;
  paymentInstructions?: string;
  lpoReference?: string;
  template?: string;
  colorTheme?: string;
  createdAt?: string;
}

export interface CustomTemplate {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  type?: string;
  userId?: string;
}

export const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

export const colorThemes = [
  { id: 'blue', name: 'Blue', primary: '#3B82F6', secondary: '#EFF6FF', value: 'blue', type: 'solid', gradient: 'from-blue-500 to-blue-600', color: '#3B82F6' },
  { id: 'green', name: 'Green', primary: '#10B981', secondary: '#ECFDF5', value: 'green', type: 'solid', gradient: 'from-green-500 to-green-600', color: '#10B981' },
  { id: 'purple', name: 'Purple', primary: '#8B5CF6', secondary: '#F3E8FF', value: 'purple', type: 'solid', gradient: 'from-purple-500 to-purple-600', color: '#8B5CF6' },
  { id: 'red', name: 'Red', primary: '#EF4444', secondary: '#FEF2F2', value: 'red', type: 'solid', gradient: 'from-red-500 to-red-600', color: '#EF4444' },
  { id: 'orange', name: 'Orange', primary: '#F97316', secondary: '#FFF7ED', value: 'orange', type: 'solid', gradient: 'from-orange-500 to-orange-600', color: '#F97316' },
  { id: 'gray', name: 'Gray', primary: '#6B7280', secondary: '#F9FAFB', value: 'gray', type: 'solid', gradient: 'from-gray-500 to-gray-600', color: '#6B7280' },
];
