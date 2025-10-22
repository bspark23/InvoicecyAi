
import { useState, useEffect } from "react";
import { PaymentReceipt } from "@/types/receipt";
import { InvoiceData } from "@/types/invoice";
import { useToast } from "@/hooks/use-toast";
import { useAuthLocal } from "@/hooks/useAuthLocal";

function getUserKey(userId?: string | null) {
  if (!userId) return "anon";
  return userId.toLowerCase().replace(/[^a-z0-9]/gi, "_");
}

export const usePaymentReceipts = (
  profileId?: string | null,
  userId?: string | null
) => {
  const USER_KEY = getUserKey(userId);
  const STORAGE_PREFIX = profileId
    ? `user-${USER_KEY}-profile-${profileId}-`
    : `user-${USER_KEY}-`;

  const { toast } = useToast();
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);

  const generateReceiptNumber = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const lastReceiptNumber =
      receipts.length > 0
        ? Math.max(
            ...receipts.map((receipt) => {
              const match = receipt.receiptNumber.match(/(\d+)$/);
              return match ? parseInt(match[1]) : 0;
            })
          )
        : 0;
    const nextNumber = String(lastReceiptNumber + 1).padStart(3, "0");
    return `RCP-${year}-${month}-${nextNumber}`;
  };

  useEffect(() => {
    if (!userId) return;
    
    const savedReceipts = localStorage.getItem(`${STORAGE_PREFIX}payment-receipts`);
    if (savedReceipts) {
      try {
        const parsed = JSON.parse(savedReceipts);
        setReceipts(parsed);
      } catch (error) {
        console.log("Error loading saved receipts:", error);
      }
    }
  }, [profileId, userId]);

  const saveReceipt = (receiptData: Omit<PaymentReceipt, 'id' | 'receiptNumber' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) return;

    const receipt: PaymentReceipt = {
      ...receiptData,
      id: Date.now().toString(),
      receiptNumber: generateReceiptNumber(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedReceipts = [...receipts, receipt];
    setReceipts(updatedReceipts);
    localStorage.setItem(
      `${STORAGE_PREFIX}payment-receipts`,
      JSON.stringify(updatedReceipts)
    );

    toast({
      title: "Payment Receipt Created",
      description: `Receipt ${receipt.receiptNumber} has been generated successfully.`,
    });

    return receipt;
  };

  const deleteReceipt = (receiptId: string) => {
    if (!userId) return;
    
    const updatedReceipts = receipts.filter(receipt => receipt.id !== receiptId);
    setReceipts(updatedReceipts);
    localStorage.setItem(
      `${STORAGE_PREFIX}payment-receipts`,
      JSON.stringify(updatedReceipts)
    );

    toast({
      title: "Receipt Deleted",
      description: "Payment receipt has been deleted successfully.",
    });
  };

  const getReceiptsByInvoice = (invoiceNumber: string) => {
    return receipts.filter(receipt => receipt.invoiceNumber === invoiceNumber);
  };

  const getTotalPaidForInvoice = (invoiceNumber: string) => {
    return receipts
      .filter(receipt => receipt.invoiceNumber === invoiceNumber)
      .reduce((total, receipt) => total + receipt.amountPaid, 0);
  };

  return {
    receipts,
    saveReceipt,
    deleteReceipt,
    getReceiptsByInvoice,
    getTotalPaidForInvoice,
    generateReceiptNumber,
  };
};
