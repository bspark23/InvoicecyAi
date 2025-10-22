import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Mail, Save, Image, Edit, FileText, Bot, Settings } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useLocation, useNavigate } from "react-router-dom";
import NewDashboardSidebar from "@/components/NewDashboardSidebar";
import DarkModeToggle from "@/components/DarkModeToggle";
import SupportBubble from "@/components/SupportBubble";
import HelpCenter from "@/components/HelpCenter";
import LogoSignatureUpload from "@/components/LogoSignatureUpload";
import SendInvoiceDialog from "@/components/SendInvoiceDialog";
import InvoicePreviewModal from "@/components/InvoicePreviewModal";
import InvoiceTemplateMinimalist from "@/components/invoice-templates/InvoiceTemplateMinimalist";
import DirectAIInvoiceAssistant from "@/components/DirectAIInvoiceAssistant";
import TestAIComponent from "@/components/TestAIComponent";
import { useInvoiceData } from "@/hooks/useInvoiceData";
import { useAuthLocal } from "@/hooks/useAuthLocal";
import { formatCurrency, calculateTotal } from "@/utils/invoiceUtils";
import ResponsiveNavButtons from "@/components/ResponsiveNavButtons";
import { CustomTemplate, InvoiceData, LineItem } from "@/types/invoice";
import { LPOData } from "@/types/lpo";

const Invoices = () => {
  const { user } = useAuthLocal();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    invoiceData,
    setInvoiceData,
    savedInvoices,
    setSavedInvoices,
    saveInvoiceData,
    saveInvoice,
    loadInvoice,
    deleteInvoice,
    toggleInvoiceStatus,
    createNewInvoice,
    addLineItem,
    removeLineItem,
    updateLineItem,
    generateInvoiceNumber,
  } = useInvoiceData(null, user?.email || user?.profileName);
  const [formData, setFormData] = useState<InvoiceData>(invoiceData);
  const [isLogoDialogOpen, setIsLogoDialogOpen] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Check for LPO conversion on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('convert') === 'lpo') {
      const lpoToConvert = localStorage.getItem('lpo_to_convert');
      if (lpoToConvert) {
        const lpoData: LPOData = JSON.parse(lpoToConvert);
        convertLPOToInvoice(lpoData);
        localStorage.removeItem('lpo_to_convert');
        // Remove the query parameter from URL
        navigate('/invoices', { replace: true });
      }
    }
  }, [location.search, navigate]);

  const convertLPOToInvoice = (lpo: LPOData) => {
    const convertedInvoiceData: InvoiceData = {
      id: uuidv4(),
      invoiceNumber: generateInvoiceNumber(),
      businessName: lpo.buyerCompanyName,
      businessEmail: lpo.buyerContactEmail,
      businessAddress: lpo.buyerAddress,
      clientName: lpo.supplierName,
      clientEmail: lpo.supplierContactEmail,
      clientAddress: lpo.supplierAddress,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: lpo.deliveryDate,
      lineItems: lpo.lineItems.map(item => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        rate: item.unitPrice,
        amount: item.total,
      })),
      currency: 'USD',
      taxRate: lpo.taxRate,
      discountAmount: 0,
      status: 'unpaid',
      notes: `Converted from LPO: ${lpo.lpoNumber}\n\nOriginal Notes: ${lpo.additionalNotes}`,
      businessLogo: lpo.companyLogo,
      signatureImage: lpo.signatureImage,
      signatureName: lpo.signatureName,
      signaturePosition: lpo.signaturePosition,
      paymentTerms: 'Payment due within 30 days',
      bankDetails: 'Bank: Example Bank\nAccount: 1234567890\nRouting: 123456789',
      paymentInstructions: 'Please make payment to the account details provided above.',
      lpoReference: lpo.lpoNumber, // Add LPO reference
    };

    setFormData(convertedInvoiceData);
    setInvoiceData(convertedInvoiceData);
  };

  useEffect(() => {
    setFormData(invoiceData);
  }, [invoiceData]);

  const handleAIInvoiceGenerated = (aiInvoice: InvoiceData) => {
    setFormData(aiInvoice);
    setInvoiceData(aiInvoice);
    setShowAIAssistant(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setInvoiceData({ ...formData, [name]: value });
  };

  const handleLineItemChange = (id: string, field: keyof LineItem, value: string | number) => {
    const updatedLineItems = formData.lineItems.map(lineItem =>
      lineItem.id === id ? { ...lineItem, [field]: value } : lineItem
    );
    setFormData({ ...formData, lineItems: updatedLineItems });
    updateLineItem(id, field, value);
  };

  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const parsedValue = parseFloat(value);
    setFormData({ ...formData, taxRate: parsedValue });
    setInvoiceData({ ...formData, taxRate: parsedValue });
  };

  const handleCurrencyChange = (value: string) => {
    setFormData({ ...formData, currency: value });
    setInvoiceData({ ...formData, currency: value });
  };

  const handleStatusChange = (value: string) => {
    setFormData({ ...formData, status: value as 'paid' | 'unpaid' });
    setInvoiceData({ ...formData, status: value as 'paid' | 'unpaid' });
  };

  const handleSaveInvoice = () => {
    saveInvoice(formData);
  };

  const handlePreview = () => {
    setSelectedInvoice(formData);
    setIsPreviewOpen(true);
  };

  const handleDownload = async () => {
    const filename = `invoice-${formData.invoiceNumber}.pdf`;
    const element = document.getElementById('invoice-preview');

    if (!element) {
      console.error('Invoice preview element not found');
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  // Calculate totals for preview
  const calculateSubtotal = () => {
    return formData.lineItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * (formData.taxRate / 100);
  };

  const calculateTotalAmount = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    return subtotal + tax - (formData.discountAmount || 0);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <NewDashboardSidebar />
        <div className="flex-1 w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b bg-white gap-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Invoice Management</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                variant={showAIAssistant ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                AI Assistant
              </Button>
              <ResponsiveNavButtons 
                onHelpClick={() => setIsHelpCenterOpen(true)}
                onChatClick={() => setIsHelpCenterOpen(true)}
              />
              <DarkModeToggle />
            </div>
          </div>

          {/* Main content */}
          <div className="p-4 sm:p-6">
            {/* AI Assistant Section */}
            {showAIAssistant && (
              <div className="mb-6 space-y-4">
                <TestAIComponent />
                <DirectAIInvoiceAssistant onInvoiceGenerated={handleAIInvoiceGenerated} />
              </div>
            )}

            {/* Invoice form and preview layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Invoice Form */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Create Invoice
                      {formData.lpoReference && (
                        <Badge variant="outline" className="ml-2">
                          From LPO: {formData.lpoReference}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Invoice details form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Business Information */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Business Information</h3>
                        <div>
                          <Label htmlFor="businessName">Business Name</Label>
                          <Input
                            id="businessName"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            placeholder="Your Business Name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="businessEmail">Business Email</Label>
                          <Input
                            id="businessEmail"
                            name="businessEmail"
                            type="email"
                            value={formData.businessEmail}
                            onChange={handleInputChange}
                            placeholder="business@example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="businessAddress">Business Address</Label>
                          <Textarea
                            id="businessAddress"
                            name="businessAddress"
                            value={formData.businessAddress}
                            onChange={handleInputChange}
                            placeholder="123 Business Street, City, State, ZIP"
                            rows={3}
                          />
                        </div>
                      </div>

                      {/* Client Information */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Client Information</h3>
                        <div>
                          <Label htmlFor="clientName">Client Name</Label>
                          <Input
                            id="clientName"
                            name="clientName"
                            value={formData.clientName}
                            onChange={handleInputChange}
                            placeholder="Client Name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="clientEmail">Client Email</Label>
                          <Input
                            id="clientEmail"
                            name="clientEmail"
                            type="email"
                            value={formData.clientEmail}
                            onChange={handleInputChange}
                            placeholder="client@example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="clientAddress">Client Address</Label>
                          <Textarea
                            id="clientAddress"
                            name="clientAddress"
                            value={formData.clientAddress}
                            onChange={handleInputChange}
                            placeholder="123 Client Street, City, State, ZIP"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="invoiceNumber">Invoice Number</Label>
                        <Input
                          id="invoiceNumber"
                          name="invoiceNumber"
                          value={formData.invoiceNumber}
                          onChange={handleInputChange}
                          placeholder="INV-001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="invoiceDate">Invoice Date</Label>
                        <Input
                          id="invoiceDate"
                          name="invoiceDate"
                          type="date"
                          value={formData.invoiceDate}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          name="dueDate"
                          type="date"
                          value={formData.dueDate}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Line Items */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Line Items</h3>
                        <Button type="button" onClick={addLineItem} variant="outline" size="sm">
                          Add Item
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {formData.lineItems.map((item, index) => (
                          <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-4 border rounded-lg">
                            <div className="md:col-span-2">
                              <Input
                                placeholder="Description"
                                value={item.description}
                                onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                placeholder="Qty"
                                value={item.quantity}
                                onChange={(e) => handleLineItemChange(item.id, 'quantity', Number(e.target.value))}
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="Rate"
                                value={item.rate}
                                onChange={(e) => handleLineItemChange(item.id, 'rate', Number(e.target.value))}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">${item.amount.toFixed(2)}</span>
                              {formData.lineItems.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeLineItem(item.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Invoice Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="taxRate">Tax Rate (%)</Label>
                        <Input
                          id="taxRate"
                          name="taxRate"
                          type="number"
                          step="0.01"
                          value={formData.taxRate}
                          onChange={handleTaxRateChange}
                          placeholder="7.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={formData.currency} onValueChange={handleCurrencyChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="NGN">NGN (₦)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={handleStatusChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unpaid">Unpaid</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Additional notes or payment instructions..."
                        rows={3}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={handleSaveInvoice} className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Invoice
                      </Button>
                      <Button onClick={handlePreview} variant="outline" className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Preview
                      </Button>
                      <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download PDF
                      </Button>
                      <Button 
                        onClick={() => setIsSendDialogOpen(true)} 
                        variant="outline" 
                        className="flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Send Invoice
                      </Button>
                      <Button 
                        onClick={() => setIsLogoDialogOpen(true)} 
                        variant="outline" 
                        className="flex items-center gap-2"
                      >
                        <Image className="w-4 h-4" />
                        Logo & Signature
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Saved Invoices */}
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Invoices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {savedInvoices.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No saved invoices yet</p>
                      ) : (
                        savedInvoices.map((invoice) => (
                          <div key={invoice.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{invoice.invoiceNumber}</p>
                                <p className="text-sm text-gray-600">{invoice.clientName}</p>
                                <p className="text-sm font-medium">{formatCurrency(calculateTotal(invoice))}</p>
                                {invoice.lpoReference && (
                                  <Badge variant="outline" className="text-xs mt-1">
                                    LPO: {invoice.lpoReference}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                                  {invoice.status}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => loadInvoice(invoice)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Live Invoice Preview - Only show on desktop */}
              <div className="hidden xl:block">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle>Live Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div id="invoice-preview" className="transform scale-75 origin-top-left w-[133%] h-auto overflow-hidden">
                      <InvoiceTemplateMinimalist
                        invoiceData={formData}
                        formatCurrency={formatCurrency}
                        calculateSubtotal={calculateSubtotal}
                        calculateTax={calculateTax}
                        calculateTotal={calculateTotalAmount}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Dialogs */}
        <LogoSignatureUpload
          isOpen={isLogoDialogOpen}
          onClose={() => setIsLogoDialogOpen(false)}
          onLogoUpload={(logo) => setFormData({ ...formData, businessLogo: logo })}
          onSignatureUpload={(signature) => setFormData({ ...formData, signatureImage: signature })}
          currentLogo={formData.businessLogo}
          currentSignature={formData.signatureImage}
        />

        <SendInvoiceDialog
          isOpen={isSendDialogOpen}
          onClose={() => setIsSendDialogOpen(false)}
          invoiceData={formData}
        />

        <InvoicePreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          invoiceData={selectedInvoice || formData}
          formatCurrency={formatCurrency}
          calculateSubtotal={calculateSubtotal}
          calculateTax={calculateTax}
          calculateTotal={calculateTotalAmount}
          onEmail={() => setIsSendDialogOpen(true)}
        />

        <SupportBubble onHelpClick={() => setIsHelpCenterOpen(true)} />
        
        <HelpCenter 
          isOpen={isHelpCenterOpen} 
          onClose={() => setIsHelpCenterOpen(false)} 
        />
      </div>
    </SidebarProvider>
  );
};

export default Invoices;
