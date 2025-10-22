
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  totalBilled?: number;
  invoiceCount?: number;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}
