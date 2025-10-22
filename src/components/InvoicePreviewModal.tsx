
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer, Mail, Image as ImageIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import InvoicePreview from "./InvoicePreview";
import { InvoiceData } from "@/types/invoice";
import { downloadAsPDF, downloadAsImage, generateFileName } from "@/utils/downloadUtils";
import { useToast } from "@/hooks/use-toast";

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: InvoiceData;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
  onDownload?: () => void;
  onEmail?: () => void;
}

const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  isOpen,
  onClose,
  invoiceData,
  formatCurrency,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  onEmail
}) => {
  const { toast } = useToast();

  const handlePrint = () => {
    // Wait a bit for the modal content to be fully rendered
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleDownloadPDF = async () => {
    try {
      const filename = generateFileName(invoiceData.invoiceNumber, invoiceData.clientName, 'pdf');
      await downloadAsPDF('invoice-preview-content', filename);
      toast({
        title: "Success",
        description: "Invoice downloaded as PDF successfully!",
      });
    } catch (error) {
      console.error('PDF download error:', error);
      toast({
        title: "Error",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadImage = async (format: 'png' | 'jpg') => {
    try {
      const filename = generateFileName(invoiceData.invoiceNumber, invoiceData.clientName, format);
      await downloadAsImage('invoice-preview-content', filename, format);
      toast({
        title: "Success",
        description: `Invoice downloaded as ${format.toUpperCase()} successfully!`,
      });
    } catch (error) {
      console.error(`${format.toUpperCase()} download error:`, error);
      toast({
        title: "Error",
        description: `Failed to download ${format.toUpperCase()}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Invoice Preview</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              {onEmail && (
                <Button variant="outline" size="sm" onClick={onEmail}>
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleDownloadPDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Download as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownloadImage('png')}>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Download as PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownloadImage('jpg')}>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Download as JPG
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div id="invoice-preview-content">
              <InvoicePreview
                invoiceData={invoiceData}
                formatCurrency={formatCurrency}
                calculateSubtotal={calculateSubtotal}
                calculateTax={calculateTax}
                calculateTotal={calculateTotal}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoicePreviewModal;
