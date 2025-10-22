
import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Eye, Save, Edit, Trash2, FileText, Plus, Image } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from "react-router-dom";
import NewDashboardSidebar from "@/components/NewDashboardSidebar";
import DarkModeToggle from "@/components/DarkModeToggle";
import SupportBubble from "@/components/SupportBubble";
import HelpCenter from "@/components/HelpCenter";
import LogoSignatureUpload from "@/components/LogoSignatureUpload";
import LPOTemplate from "@/components/lpo-templates/LPOTemplate";
import { useLPOData } from "@/hooks/useLPOData";
import { useAuthLocal } from "@/hooks/useAuthLocal";
import { LPOData, LPOLineItem, CreateLPOData } from "@/types/lpo";
import ResponsiveNavButtons from "@/components/ResponsiveNavButtons";

const LPO = () => {
  const { user } = useAuthLocal();
  const navigate = useNavigate();
  const {
    lpos,
    saveLPO,
    updateLPO,
    deleteLPO,
    updateLPOStatus,
    generateLPONumber,
    addLineItem,
    calculateLineItemTotal,
  } = useLPOData(user?.email || user?.profileName);

  const [isCreating, setIsCreating] = useState(false);
  const [editingLPO, setEditingLPO] = useState<LPOData | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewLPO, setPreviewLPO] = useState<LPOData | null>(null);
  const [isLogoDialogOpen, setIsLogoDialogOpen] = useState(false);
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);

  const [formData, setFormData] = useState<CreateLPOData>({
    buyerCompanyName: '',
    buyerContactName: '',
    buyerContactEmail: '',
    buyerContactPhone: '',
    buyerAddress: '',
    supplierName: '',
    supplierContactName: '',
    supplierContactEmail: '',
    supplierContactPhone: '',
    supplierAddress: '',
    issueDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    deliveryTerms: '',
    lineItems: [{
      id: uuidv4(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }],
    additionalNotes: '',
    taxRate: 0,
    companyLogo: '',
    signatureImage: '',
    signatureName: '',
    signaturePosition: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLineItemChange = (id: string, field: keyof LPOLineItem, value: string | number) => {
    const updatedLineItems = formData.lineItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = calculateLineItemTotal(
            field === 'quantity' ? Number(value) : updatedItem.quantity,
            field === 'unitPrice' ? Number(value) : updatedItem.unitPrice
          );
        }
        return updatedItem;
      }
      return item;
    });
    setFormData({ ...formData, lineItems: updatedLineItems });
  };

  const addNewLineItem = () => {
    const newItem: LPOLineItem = {
      id: uuidv4(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setFormData({ ...formData, lineItems: [...formData.lineItems, newItem] });
  };

  const removeLineItem = (id: string) => {
    if (formData.lineItems.length > 1) {
      setFormData({
        ...formData,
        lineItems: formData.lineItems.filter(item => item.id !== id)
      });
    }
  };

  const handleSaveLPO = () => {
    const savedLPO = saveLPO(formData);
    setIsCreating(false);
    setEditingLPO(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      buyerCompanyName: '',
      buyerContactName: '',
      buyerContactEmail: '',
      buyerContactPhone: '',
      buyerAddress: '',
      supplierName: '',
      supplierContactName: '',
      supplierContactEmail: '',
      supplierContactPhone: '',
      supplierAddress: '',
      issueDate: new Date().toISOString().split('T')[0],
      deliveryDate: '',
      deliveryTerms: '',
      lineItems: [{
        id: uuidv4(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0,
      }],
      additionalNotes: '',
      taxRate: 0,
      companyLogo: '',
      signatureImage: '',
      signatureName: '',
      signaturePosition: '',
    });
  };

  const handlePreview = (lpo?: LPOData) => {
    if (lpo) {
      setPreviewLPO(lpo);
    } else {
      // Create temporary LPO for preview
      const subtotal = formData.lineItems.reduce((sum, item) => sum + item.total, 0);
      const taxAmount = subtotal * (formData.taxRate / 100);
      const totalAmount = subtotal + taxAmount;

      const tempLPO: LPOData = {
        id: 'preview',
        lpoNumber: generateLPONumber(),
        ...formData,
        subtotal,
        taxAmount,
        totalAmount,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: user?.email || 'default',
      };
      setPreviewLPO(tempLPO);
    }
    setIsPreviewOpen(true);
  };

  const handleDownload = async (lpo: LPOData) => {
    const filename = `lpo-${lpo.lpoNumber}.pdf`;
    const element = document.getElementById('lpo-preview');

    if (!element) {
      console.error('LPO preview element not found');
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

  const convertToInvoice = (lpo: LPOData) => {
    // Store LPO data in localStorage for conversion
    localStorage.setItem('lpo_to_convert', JSON.stringify(lpo));
    navigate('/invoices?convert=lpo');
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <NewDashboardSidebar />
        <div className="flex-1 w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b bg-white gap-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">LPO Management</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create LPO
              </Button>
              <ResponsiveNavButtons 
                onHelpClick={() => setIsHelpCenterOpen(true)}
                onChatClick={() => setIsHelpCenterOpen(true)}
              />
              <DarkModeToggle />
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 sm:p-6">
            {/* LPO List */}
            <Card>
              <CardHeader>
                <CardTitle>Local Purchase Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lpos.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No LPOs created yet</p>
                      <Button onClick={() => setIsCreating(true)} className="mt-4">
                        Create Your First LPO
                      </Button>
                    </div>
                  ) : (
                    lpos.map((lpo) => (
                      <div key={lpo.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{lpo.lpoNumber}</span>
                              <Badge variant={lpo.status === 'approved' ? 'default' : 'secondary'}>
                                {lpo.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">Supplier: {lpo.supplierName}</p>
                            <p className="text-sm text-gray-600">Date: {lpo.issueDate}</p>
                            <p className="text-sm font-medium">Total: {formatCurrency(lpo.totalAmount)}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePreview(lpo)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownload(lpo)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => convertToInvoice(lpo)}
                            >
                              Convert to Invoice
                            </Button>
                            <Select 
                              value={lpo.status} 
                              onValueChange={(value) => updateLPOStatus(lpo.id, value as LPOData['status'])}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="sent">Sent</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="fulfilled">Fulfilled</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteLPO(lpo.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
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
        </div>

        {/* Create/Edit LPO Dialog */}
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New LPO</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Buyer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Buyer Information</h3>
                  <div>
                    <Label htmlFor="buyerCompanyName">Company Name</Label>
                    <Input
                      id="buyerCompanyName"
                      name="buyerCompanyName"
                      value={formData.buyerCompanyName}
                      onChange={handleInputChange}
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="buyerContactName">Contact Name</Label>
                    <Input
                      id="buyerContactName"
                      name="buyerContactName"
                      value={formData.buyerContactName}
                      onChange={handleInputChange}
                      placeholder="Contact Person"
                    />
                  </div>
                  <div>
                    <Label htmlFor="buyerContactEmail">Contact Email</Label>
                    <Input
                      id="buyerContactEmail"
                      name="buyerContactEmail"
                      type="email"
                      value={formData.buyerContactEmail}
                      onChange={handleInputChange}
                      placeholder="contact@company.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="buyerContactPhone">Contact Phone</Label>
                    <Input
                      id="buyerContactPhone"
                      name="buyerContactPhone"
                      value={formData.buyerContactPhone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="buyerAddress">Address</Label>
                    <Textarea
                      id="buyerAddress"
                      name="buyerAddress"
                      value={formData.buyerAddress}
                      onChange={handleInputChange}
                      placeholder="123 Business Street, City, State, ZIP"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Supplier Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Supplier Information</h3>
                  <div>
                    <Label htmlFor="supplierName">Supplier Name</Label>
                    <Input
                      id="supplierName"
                      name="supplierName"
                      value={formData.supplierName}
                      onChange={handleInputChange}
                      placeholder="Supplier Company Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="supplierContactName">Contact Name</Label>
                    <Input
                      id="supplierContactName"
                      name="supplierContactName"
                      value={formData.supplierContactName}
                      onChange={handleInputChange}
                      placeholder="Supplier Contact Person"
                    />
                  </div>
                  <div>
                    <Label htmlFor="supplierContactEmail">Contact Email</Label>
                    <Input
                      id="supplierContactEmail"
                      name="supplierContactEmail"
                      type="email"
                      value={formData.supplierContactEmail}
                      onChange={handleInputChange}
                      placeholder="supplier@company.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="supplierContactPhone">Contact Phone</Label>
                    <Input
                      id="supplierContactPhone"
                      name="supplierContactPhone"
                      value={formData.supplierContactPhone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 987-6543"
                    />
                  </div>
                  <div>
                    <Label htmlFor="supplierAddress">Address</Label>
                    <Textarea
                      id="supplierAddress"
                      name="supplierAddress"
                      value={formData.supplierAddress}
                      onChange={handleInputChange}
                      placeholder="456 Supplier Street, City, State, ZIP"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    name="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryDate">Delivery Date</Label>
                  <Input
                    id="deliveryDate"
                    name="deliveryDate"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    name="taxRate"
                    type="number"
                    step="0.01"
                    value={formData.taxRate}
                    onChange={handleInputChange}
                    placeholder="7.5"
                  />
                </div>
              </div>

              {/* Delivery Terms */}
              <div>
                <Label htmlFor="deliveryTerms">Delivery Terms</Label>
                <Textarea
                  id="deliveryTerms"
                  name="deliveryTerms"
                  value={formData.deliveryTerms}
                  onChange={handleInputChange}
                  placeholder="Delivery instructions and terms..."
                  rows={2}
                />
              </div>

              {/* Line Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Items</h3>
                  <Button type="button" onClick={addNewLineItem} variant="outline" size="sm">
                    Add Item
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.lineItems.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-4 border rounded-lg">
                      <div className="md:col-span-2">
                        <Input
                          placeholder="Item description"
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
                          placeholder="Unit Price"
                          value={item.unitPrice}
                          onChange={(e) => handleLineItemChange(item.id, 'unitPrice', Number(e.target.value))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{formatCurrency(item.total)}</span>
                        {formData.lineItems.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLineItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  placeholder="Any additional notes or instructions..."
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleSaveLPO} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save LPO
                </Button>
                <Button onClick={() => handlePreview()} variant="outline" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
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
            </div>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>LPO Preview</DialogTitle>
            </DialogHeader>
            {previewLPO && (
              <div id="lpo-preview">
                <LPOTemplate lpoData={previewLPO} formatCurrency={formatCurrency} />
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Logo & Signature Upload Dialog */}
        <LogoSignatureUpload
          isOpen={isLogoDialogOpen}
          onClose={() => setIsLogoDialogOpen(false)}
          onLogoUpload={(logo) => setFormData({ ...formData, companyLogo: logo })}
          onSignatureUpload={(signature) => setFormData({ ...formData, signatureImage: signature })}
          currentLogo={formData.companyLogo}
          currentSignature={formData.signatureImage}
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

export default LPO;
