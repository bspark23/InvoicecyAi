
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, X, FileText, Palette, Download, Settings } from "lucide-react";

interface HelpCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Need Help?
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="create-invoices" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="create-invoices" className="text-xs">
              <FileText className="w-4 h-4 mr-1" />
              Create Invoices
            </TabsTrigger>
            <TabsTrigger value="customize-templates" className="text-xs">
              <Palette className="w-4 h-4 mr-1" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="download-email" className="text-xs">
              <Download className="w-4 h-4 mr-1" />
              Download/Email
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create-invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>How to Create Invoices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Step 1: Click "Create Invoice"</h4>
                  <p className="text-sm text-gray-600">Navigate to the Invoices page and click the "Create Invoice" button in the top right corner.</p>
                  
                  <h4 className="font-semibold">Step 2: Fill in Business Information</h4>
                  <p className="text-sm text-gray-600">Enter your business name, email, address, phone, and website. Add a business slogan if desired.</p>
                  
                  <h4 className="font-semibold">Step 3: Add Client Details</h4>
                  <p className="text-sm text-gray-600">You can select an existing client or manually enter client name, email, and address.</p>
                  
                  <h4 className="font-semibold">Step 4: Set Invoice Details</h4>
                  <p className="text-sm text-gray-600">Add invoice number, date, due date, and select your preferred currency.</p>
                  
                  <h4 className="font-semibold">Step 5: Add Line Items</h4>
                  <p className="text-sm text-gray-600">Click "Add Item" to add products/services. Enter description, quantity, and rate for each item.</p>
                  
                  <h4 className="font-semibold">Step 6: Configure Payment Info</h4>
                  <p className="text-sm text-gray-600">Add your account number, bank details, and payment terms.</p>
                  
                  <h4 className="font-semibold">Step 7: Save Invoice</h4>
                  <p className="text-sm text-gray-600">Click "Save Invoice" to save your invoice for future reference.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customize-templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>How to Customize Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Choose Template & Style</h4>
                  <p className="text-sm text-gray-600">Click "Choose Template" to access our pre-built templates and color themes.</p>
                  
                  <h4 className="font-semibold">Pre-built Templates</h4>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li>Minimalist - Clean and simple design</li>
                    <li>Classic - Traditional professional look</li>
                    <li>Modern - Contemporary design</li>
                    <li>Bold - Eye-catching colors</li>
                    <li>Elegant - Sophisticated styling</li>
                    <li>Corporate - Business-focused layout</li>
                  </ul>
                  
                  <h4 className="font-semibold">Color Themes</h4>
                  <p className="text-sm text-gray-600">Choose from various color themes including blue, green, red, purple, and gradient options.</p>
                  
                  <h4 className="font-semibold">Upload Custom Template</h4>
                  <p className="text-sm text-gray-600">Upload your own image template or create HTML templates for complete customization.</p>
                  
                  <h4 className="font-semibold">Logo & Signature</h4>
                  <p className="text-sm text-gray-600">Upload your business logo and signature image to personalize your invoices.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="download-email" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>How to Download or Email Invoices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Download as PDF</h4>
                  <p className="text-sm text-gray-600">Click the "Download" button to save your invoice as a PDF file to your device.</p>
                  
                  <h4 className="font-semibold">Preview Before Download</h4>
                  <p className="text-sm text-gray-600">Use the "Preview" button to see how your invoice will look before downloading.</p>
                  
                  <h4 className="font-semibold">Email Invoice</h4>
                  <p className="text-sm text-gray-600">Click the "Email" button to send the invoice directly to your client's email address.</p>
                  
                  <h4 className="font-semibold">Print Invoice</h4>
                  <p className="text-sm text-gray-600">Use your browser's print function (Ctrl+P) while in preview mode to print the invoice.</p>
                  
                  <h4 className="font-semibold">Save for Later</h4>
                  <p className="text-sm text-gray-600">All invoices are automatically saved and can be accessed from the main invoices list.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Settings & Preferences Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Default Currency</h4>
                  <p className="text-sm text-gray-600">Set your preferred currency in the invoice creation form. Supports USD, EUR, GBP, NGN, CAD, and AUD.</p>
                  
                  <h4 className="font-semibold">Business Information</h4>
                  <p className="text-sm text-gray-600">Save your business details once and they'll be automatically filled in new invoices.</p>
                  
                  <h4 className="font-semibold">Client Management</h4>
                  <p className="text-sm text-gray-600">Add frequently used clients to quickly populate invoice details.</p>
                  
                  <h4 className="font-semibold">Template Preferences</h4>
                  <p className="text-sm text-gray-600">Your last selected template and color theme will be remembered for new invoices.</p>
                  
                  <h4 className="font-semibold">Invoice Numbering</h4>
                  <p className="text-sm text-gray-600">Invoice numbers are automatically generated but can be customized as needed.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpCenter;
