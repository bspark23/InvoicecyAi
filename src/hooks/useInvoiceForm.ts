import { useState } from "react";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceFormState {
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  items: LineItem[];
  taxRate: number;
  discount: number;
  notes: string;
}

function generateInvoiceNumber() {
  const now = new Date();
  return `INV-${now.getFullYear()}${(now.getMonth()+1)
    .toString().padStart(2, "0")}-${now.getDate()}${now.getHours()}${now.getMinutes()}`;
}

export function useInvoiceForm() {
  const [form, setForm] = useState<InvoiceFormState>({
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    invoiceNumber: generateInvoiceNumber(),
    invoiceDate: new Date().toISOString().slice(0,10),
    dueDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().slice(0,10),
    items: [
      { id: Date.now().toString(), description: "", quantity: 1, rate: 0, amount: 0 }
    ],
    taxRate: 0,
    discount: 0,
    notes: "",
  });

  // Line Items
  const addItem = () =>
    setForm(f => ({
      ...f,
      items: [
        ...f.items,
        { id: Date.now().toString(), description: "", quantity: 1, rate: 0, amount: 0 }
      ]
    }));

  const updateItem = (id: string, changes: Partial<LineItem>) =>
    setForm(f => ({
      ...f,
      items: f.items.map(item => item.id === id
        ? { ...item, ...changes, amount: ((changes.quantity ?? item.quantity) * (changes.rate ?? item.rate)) }
        : item
      )
    }));

  const removeItem = (id: string) =>
    setForm(f => ({
      ...f,
      items: f.items.length === 1 ? f.items : f.items.filter(item => item.id !== id),
    }));

  // Main fields
  const setField = <K extends keyof InvoiceFormState>(key: K, value: InvoiceFormState[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  // Calculations
  const subtotal = form.items.reduce((sum, i) => sum + i.amount, 0);
  const tax = subtotal * (form.taxRate / 100);
  const total = subtotal + tax - form.discount;

  return {
    form,
    setField,
    addItem,
    updateItem,
    removeItem,
    subtotal,
    tax,
    total
  };
}
