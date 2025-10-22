
export interface LPOLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface LPOData {
  id: string;
  lpoNumber: string;
  buyerCompanyName: string;
  buyerContactName: string;
  buyerContactEmail: string;
  buyerContactPhone: string;
  buyerAddress: string;
  supplierName: string;
  supplierContactName: string;
  supplierContactEmail: string;
  supplierContactPhone: string;
  supplierAddress: string;
  issueDate: string;
  deliveryDate: string;
  deliveryTerms: string;
  lineItems: LPOLineItem[];
  additionalNotes: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'approved' | 'fulfilled';
  companyLogo?: string;
  signatureImage?: string;
  signatureName?: string;
  signaturePosition?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CreateLPOData {
  buyerCompanyName: string;
  buyerContactName: string;
  buyerContactEmail: string;
  buyerContactPhone: string;
  buyerAddress: string;
  supplierName: string;
  supplierContactName: string;
  supplierContactEmail: string;
  supplierContactPhone: string;
  supplierAddress: string;
  issueDate: string;
  deliveryDate: string;
  deliveryTerms: string;
  lineItems: LPOLineItem[];
  additionalNotes: string;
  taxRate: number;
  companyLogo?: string;
  signatureImage?: string;
  signatureName?: string;
  signaturePosition?: string;
}
