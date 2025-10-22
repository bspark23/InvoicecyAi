
import { useState, useEffect } from "react";
import { InvoiceData, LineItem } from "@/types/invoice";
import { useToast } from "@/hooks/use-toast";
import { useAuthLocal } from "@/hooks/useAuthLocal";

// Helper to always get a unique user key (email preferred, fallback to profileName)
function getUserKey(userId?: string | null) {
  if (!userId) return "anon";
  return userId.toLowerCase().replace(/[^a-z0-9]/gi, "_");
}

// Use both user and profile for namespacing
export const useInvoiceData = (
  profileId?: string | null,
  userId?: string | null
) => {
  // Always namespace by user (by email or profileName). If profileId given, include too.
  const USER_KEY = getUserKey(userId);
  const STORAGE_PREFIX = profileId
    ? `user-${USER_KEY}-profile-${profileId}-`
    : `user-${USER_KEY}-`;

  const generateInvoiceNumber = () => {
    const savedInvoicesData = localStorage.getItem(
      `${STORAGE_PREFIX}invoicer-pro-invoices`
    );
    let savedInvoices: InvoiceData[] = [];
    if (savedInvoicesData) {
      try {
        savedInvoices = JSON.parse(savedInvoicesData);
      } catch (error) {
        savedInvoices = [];
      }
    }
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const lastInvoiceNumber =
      savedInvoices.length > 0
        ? Math.max(
            ...savedInvoices.map((inv) => {
              const match = inv.invoiceNumber.match(/(\d+)$/);
              return match ? parseInt(match[1]) : 0;
            })
          )
        : 0;
    const nextNumber = String(lastInvoiceNumber + 1).padStart(3, "0");
    return `INV-${year}-${month}-${nextNumber}`;
  };

  const { toast } = useToast();
  const [savedInvoices, setSavedInvoices] = useState<InvoiceData[]>([]);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    id: Date.now().toString(),
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    lineItems: [
      { id: "1", description: "", quantity: 1, rate: 0, amount: 0 },
    ],
    taxRate: 0,
    discountAmount: 0,
    businessName: "Your Business Name",
    businessLogo: "",
    businessEmail: "",
    businessAddress: "",
    currency: "USD",
    notes: "",
    status: "unpaid",
    template: "minimalist",
    colorTheme: "blue",
  });

  // If profileId/userId is not set, do not run any side-effects
  useEffect(() => {
    // Only load or save for valid userId!
    if (!userId) return;
    const savedData = localStorage.getItem(`${STORAGE_PREFIX}invoicer-pro-data`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setInvoiceData((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.log("Error loading saved data:", error);
      }
    }

    const savedInvoicesData = localStorage.getItem(
      `${STORAGE_PREFIX}invoicer-pro-invoices`
    );
    if (savedInvoicesData) {
      try {
        const parsed = JSON.parse(savedInvoicesData);
        setSavedInvoices(parsed);
      } catch (error) {
        console.log("Error loading saved invoices:", error);
      }
    }

    if (!invoiceData.invoiceNumber) {
      setInvoiceData((prev) => ({
        ...prev,
        invoiceNumber: generateInvoiceNumber(),
      }));
    }
    // eslint-disable-next-line
  }, [profileId, userId]); // re-run if user or profile switches

  // All storage reads/writes use STORAGE_PREFIX scoped by user/profileId

  return {
    invoiceData,
    setInvoiceData,
    savedInvoices,
    setSavedInvoices,
    saveInvoiceData: () => {
      if (!userId) return;
      localStorage.setItem(
        `${STORAGE_PREFIX}invoicer-pro-data`,
        JSON.stringify(invoiceData)
      );
      toast({
        title: "Invoice Data Saved",
        description: "Your current invoice data has been saved locally.",
      });
    },
    saveInvoice: (invoiceToSave: InvoiceData) => {
      if (!userId) return;
      const invoice = {
        ...invoiceToSave,
        id: invoiceToSave.id || Date.now().toString(),
        createdAt: invoiceToSave.createdAt || new Date().toISOString(),
      };
      const existingInvoices = [...savedInvoices];
      const existingIndex = existingInvoices.findIndex(
        (inv) => inv.id === invoice.id
      );

      if (existingIndex >= 0) {
        existingInvoices[existingIndex] = invoice;
      } else {
        existingInvoices.push(invoice);
      }

      setSavedInvoices(existingInvoices);
      localStorage.setItem(
        `${STORAGE_PREFIX}invoicer-pro-invoices`,
        JSON.stringify(existingInvoices)
      );

      toast({
        title: "Invoice Saved",
        description: "Your invoice has been saved and can be viewed later.",
      });
    },
    loadInvoice: (invoice: InvoiceData) => {
      setInvoiceData(invoice);
      toast({
        title: "Invoice Loaded",
        description: "Invoice loaded successfully.",
      });
    },
    deleteInvoice: (invoiceId: string) => {
      if (!userId) return;
      const updatedInvoices = savedInvoices.filter(
        (inv) => inv.id !== invoiceId
      );
      setSavedInvoices(updatedInvoices);
      localStorage.setItem(
        `${STORAGE_PREFIX}invoicer-pro-invoices`,
        JSON.stringify(updatedInvoices)
      );
      toast({
        title: "Invoice Deleted",
        description: "Invoice has been deleted successfully.",
      });
    },
    toggleInvoiceStatus: (invoiceId: string) => {
      if (!userId) return;
      const updatedInvoices = savedInvoices.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: inv.status === "paid" ? "unpaid" : ("paid" as "paid" | "unpaid"),
            }
          : inv
      );
      setSavedInvoices(updatedInvoices);
      localStorage.setItem(
        `${STORAGE_PREFIX}invoicer-pro-invoices`,
        JSON.stringify(updatedInvoices)
      );
      toast({
        title: "Status Updated",
        description: "Invoice status has been updated.",
      });
    },
    createNewInvoice: () => {
      setInvoiceData({
        id: Date.now().toString(),
        clientName: "",
        clientEmail: "",
        clientAddress: "",
        invoiceNumber: generateInvoiceNumber(),
        invoiceDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        lineItems: [
          {
            id: Date.now().toString(),
            description: "",
            quantity: 1,
            rate: 0,
            amount: 0,
          },
        ],
        taxRate: 0,
        discountAmount: 0,
        businessName: invoiceData.businessName,
        businessLogo: invoiceData.businessLogo,
        businessEmail: invoiceData.businessEmail,
        businessAddress: invoiceData.businessAddress,
        currency: invoiceData.currency,
        notes: "",
        status: "unpaid",
        template: invoiceData.template || "minimalist",
        colorTheme: invoiceData.colorTheme || "blue",
      });
    },
    addLineItem: () => {
      const newItem = {
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      };
      setInvoiceData((prev) => ({
        ...prev,
        lineItems: [...prev.lineItems, newItem],
      }));
    },
    removeLineItem: (id: string) => {
      if (invoiceData.lineItems.length > 1) {
        setInvoiceData((prev) => ({
          ...prev,
          lineItems: prev.lineItems.filter((item) => item.id !== id),
        }));
      }
    },
    updateLineItem: (
      id: string,
      field: keyof InvoiceData["lineItems"][number],
      value: string | number
    ) => {
      setInvoiceData((prev) => ({
        ...prev,
        lineItems: prev.lineItems.map((item) => {
          if (item.id === id) {
            const updated = { ...item, [field]: value };
            if (field === "quantity" || field === "rate") {
              updated.amount = Number(updated.quantity) * Number(updated.rate);
            }
            return updated;
          }
          return item;
        }),
      }));
    },
    generateInvoiceNumber,
  };
};
