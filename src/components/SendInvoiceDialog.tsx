
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send } from "lucide-react";
import { InvoiceData } from "@/types/invoice";

interface SendInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: InvoiceData;
}

const SendInvoiceDialog: React.FC<SendInvoiceDialogProps> = ({
  isOpen,
  onClose,
  invoiceData
}) => {
  // Add defensive check for invoiceData
  if (!invoiceData) {
    return null;
  }

  const [emailData, setEmailData] = useState({
    to: invoiceData.clientEmail || '',
    subject: `Invoice ${invoiceData.invoiceNumber || ''}`,
    message: `Dear ${invoiceData.clientName || 'Client'},\n\nPlease find attached your invoice.\n\nThank you for your business!`
  });

  const handleSend = () => {
    console.log('Sending invoice email:', emailData);
    // TODO: Implement actual email sending logic
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Send Invoice
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              value={emailData.to}
              onChange={(e) => setEmailData({...emailData, to: e.target.value})}
              placeholder="client@example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={emailData.subject}
              onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={emailData.message}
              onChange={(e) => setEmailData({...emailData, message: e.target.value})}
              rows={4}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSend}>
              <Send className="w-4 h-4 mr-2" />
              Send Invoice
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendInvoiceDialog;
