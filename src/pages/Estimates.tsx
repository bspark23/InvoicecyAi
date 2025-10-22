
import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NewDashboardSidebar from "@/components/NewDashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, Search, Edit, Trash2, Download, Mail, FileText, 
  DollarSign, Calendar, User, RefreshCw, Copy, Eye
} from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useAuthLocal } from "@/hooks/useAuthLocal";
import { currencies } from "@/types/invoice";
import { formatCurrency } from "@/utils/invoiceUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type EstimateLineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

type Estimate = {
  id: string;
  estimateNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  businessName: string;
  businessEmail: string;
  businessAddress: string;
  estimateDate: string;
  expirationDate: string;
  lineItems: EstimateLineItem[];
  taxRate: number;
  discountAmount: number;
  currency: string;
  notes: string;
  status: 'draft' | 'sent' | 'accepted' | 'expired' | 'converted';
  createdAt: string;
};

const LOCAL_STORAGE_KEY = "invoicecraft-estimates-v1";

const Estimates: React.FC = () => {
  const { user } = useAuthLocal();
  const { toast } = useToast();
  const { clients } = useClients(null, user?.email || user?.profileName);
  
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null);
  const [estimateForm, setEstimateForm] = useState<Estimate>({
    id: '',
    estimateNumber: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    businessName: '',
    businessEmail: '',
    businessAddress: '',
    estimateDate: new Date().toISOString().split('T')[0],
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lineItems: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }],
    taxRate: 0,
    discountAmount: 0,
    currency: 'USD',
    notes: '',
    status: 'draft',
    createdAt: new Date().toISOString()
  });

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setEstimates(JSON.parse(saved));
      } catch {
        setEstimates([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(estimates));
  }, [estimates]);

  const generateEstimateNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const count = estimates.length + 1;
    return `EST-${year}${month}-${String(count).padStart(3, '0')}`;
  };

  const filteredEstimates = estimates.filter(estimate =>
    estimate.estimateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estimate.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estimate.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateSubtotal = (lineItems: EstimateLineItem[]) => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTotal = (estimate: Estimate) => {
    const subtotal = calculateSubtotal(estimate.lineItems);
    const tax = (subtotal * estimate.taxRate) / 100;
    return subtotal + tax - estimate.discountAmount;
  };

  const handleCreateNew = () => {
    setEstimateForm({
      ...estimateForm,
      id: '',
      estimateNumber: generateEstimateNumber(),
      lineItems: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }]
    });
    setViewMode('create');
  };

  const handleEditEstimate = (estimate: Estimate) => {
    setEstimateForm(estimate);
    setSelectedEstimate(estimate);
    setViewMode('edit');
  };

  const updateLineItem = (id: string, field: keyof EstimateLineItem, value: any) => {
    setEstimateForm(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updated.amount = updated.quantity * updated.rate;
          }
          return updated;
        }
        return item;
      })
    }));
  };

  const addLineItem = () => {
    const newId = Date.now().toString();
    setEstimateForm(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { id: newId, description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeLineItem = (id: string) => {
    if (estimateForm.lineItems.length > 1) {
      setEstimateForm(prev => ({
        ...prev,
        lineItems: prev.lineItems.filter(item => item.id !== id)
      }));
    }
  };

  const handleSaveEstimate = () => {
    if (!estimateForm.clientName || !estimateForm.estimateNumber) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const estimateToSave = {
      ...estimateForm,
      id: estimateForm.id || Date.now().toString(),
      createdAt: estimateForm.createdAt || new Date().toISOString()
    };

    if (selectedEstimate) {
      setEstimates(prev => prev.map(est => est.id === selectedEstimate.id ? estimateToSave : est));
    } else {
      setEstimates(prev => [...prev, estimateToSave]);
    }

    setViewMode('list');
    setSelectedEstimate(null);
    toast({
      title: "Success",
      description: selectedEstimate ? "Estimate updated successfully" : "Estimate created successfully"
    });
  };

  const handleDeleteEstimate = (estimateId: string) => {
    setEstimates(prev => prev.filter(est => est.id !== estimateId));
    toast({
      title: "Success",
      description: "Estimate deleted successfully"
    });
  };

  const convertToInvoice = (estimate: Estimate) => {
    // This would integrate with the invoice system
    toast({
      title: "Convert to Invoice",
      description: "This would convert the estimate to an invoice in the invoices system."
    });
    
    // Update estimate status
    setEstimates(prev => prev.map(est => 
      est.id === estimate.id ? { ...est, status: 'converted' as const } : est
    ));
  };

  const handleDownloadPDF = (estimate: Estimate) => {
    toast({
      title: "Download Feature",
      description: "PDF download functionality would be implemented here."
    });
  };

  const handleEmailEstimate = (estimate: Estimate) => {
    toast({
      title: "Email Feature",
      description: "Email functionality would be integrated here."
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-gray-50">
          <NewDashboardSidebar />
          <div className="flex-1">
            <div className="p-4 border-b bg-white">
              <SidebarTrigger />
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {viewMode === 'create' ? 'Create New Estimate' : 'Edit Estimate'}
                  </h1>
                  <p className="text-gray-600">Fill in the estimate details below.</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setViewMode('list')}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEstimate} className="bg-blue-600 hover:bg-blue-700">
                    Save Estimate
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Estimate Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Estimate Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="estimateNumber">Estimate Number</Label>
                        <Input
                          id="estimateNumber"
                          value={estimateForm.estimateNumber}
                          onChange={(e) => setEstimateForm(prev => ({ ...prev, estimateNumber: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="currency">Currency</Label>
                        <Select 
                          value={estimateForm.currency} 
                          onValueChange={(value) => setEstimateForm(prev => ({ ...prev, currency: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency.code} value={currency.code}>
                                {currency.symbol} {currency.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="estimateDate">Estimate Date</Label>
                        <Input
                          id="estimateDate"
                          type="date"
                          value={estimateForm.estimateDate}
                          onChange={(e) => setEstimateForm(prev => ({ ...prev, estimateDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="expirationDate">Expiration Date</Label>
                        <Input
                          id="expirationDate"
                          type="date"
                          value={estimateForm.expirationDate}
                          onChange={(e) => setEstimateForm(prev => ({ ...prev, expirationDate: e.target.value }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Client Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Client Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="clientSelect">Select Client (Optional)</Label>
                      <Select onValueChange={(clientId) => {
                        const client = clients.find(c => c.id === clientId);
                        if (client) {
                          setEstimateForm(prev => ({
                            ...prev,
                            clientName: client.name,
                            clientEmail: client.email,
                            clientAddress: client.address
                          }));
                        }
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose existing client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="clientName">Client Name</Label>
                      <Input
                        id="clientName"
                        value={estimateForm.clientName}
                        onChange={(e) => setEstimateForm(prev => ({ ...prev, clientName: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="clientEmail">Client Email</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={estimateForm.clientEmail}
                        onChange={(e) => setEstimateForm(prev => ({ ...prev, clientEmail: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="clientAddress">Client Address</Label>
                      <Textarea
                        id="clientAddress"
                        value={estimateForm.clientAddress}
                        onChange={(e) => setEstimateForm(prev => ({ ...prev, clientAddress: e.target.value }))}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Line Items */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Estimate Items</CardTitle>
                      <Button onClick={addLineItem} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {estimateForm.lineItems.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
                          <div className="col-span-4">
                            <Label>Description</Label>
                            <Input
                              value={item.description}
                              onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                              placeholder="Item description"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label>Quantity</Label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                              min="1"
                            />
                          </div>
                          <div className="col-span-3">
                            <Label>Rate</Label>
                            <Input
                              type="number"
                              value={item.rate}
                              onChange={(e) => updateLineItem(item.id, 'rate', Number(e.target.value))}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label>Amount</Label>
                            <div className="font-semibold text-lg">
                              {formatCurrency(item.amount, estimateForm.currency)}
                            </div>
                          </div>
                          <div className="col-span-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeLineItem(item.id)}
                              disabled={estimateForm.lineItems.length === 1}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="mt-6 space-y-2 max-w-md ml-auto">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(calculateSubtotal(estimateForm.lineItems), estimateForm.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax ({estimateForm.taxRate}%):</span>
                        <span>{formatCurrency((calculateSubtotal(estimateForm.lineItems) * estimateForm.taxRate) / 100, estimateForm.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span>-{formatCurrency(estimateForm.discountAmount, estimateForm.currency)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>{formatCurrency(calculateTotal(estimateForm), estimateForm.currency)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="taxRate">Tax Rate (%)</Label>
                        <Input
                          id="taxRate"
                          type="number"
                          value={estimateForm.taxRate}
                          onChange={(e) => setEstimateForm(prev => ({ ...prev, taxRate: Number(e.target.value) }))}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label htmlFor="discount">Discount Amount</Label>
                        <Input
                          id="discount"
                          type="number"
                          value={estimateForm.discountAmount}
                          onChange={(e) => setEstimateForm(prev => ({ ...prev, discountAmount: Number(e.target.value) }))}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Notes & Terms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={estimateForm.notes}
                      onChange={(e) => setEstimateForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Add any notes or terms and conditions here..."
                      rows={4}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <NewDashboardSidebar />
        <div className="flex-1">
          <div className="p-4 border-b bg-white">
            <SidebarTrigger />
          </div>
          
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Estimates</h1>
                <p className="text-gray-600">Create and manage project estimates and quotations.</p>
              </div>
              <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Estimate
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Estimates</p>
                      <p className="text-2xl font-bold text-gray-900">{estimates.length}</p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Accepted</p>
                      <p className="text-2xl font-bold text-green-600">
                        {estimates.filter(est => est.status === 'accepted').length}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-green-100">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {estimates.filter(est => est.status === 'sent').length}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-yellow-100">
                      <Calendar className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Value</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(
                          estimates.reduce((sum, est) => sum + calculateTotal(est), 0)
                        )}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-purple-100">
                      <User className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search estimates by number, client, or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Estimates Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Estimates ({filteredEstimates.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredEstimates.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm ? "No estimates found" : "No estimates yet"}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm 
                        ? "Try adjusting your search terms" 
                        : "Get started by creating your first estimate"
                      }
                    </p>
                    {!searchTerm && (
                      <Button onClick={handleCreateNew}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Estimate
                      </Button>
                    )}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Estimate #</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEstimates.map((estimate) => (
                        <TableRow key={estimate.id}>
                          <TableCell className="font-medium">
                            {estimate.estimateNumber}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{estimate.clientName}</p>
                              <p className="text-sm text-gray-500">{estimate.clientEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(estimate.estimateDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(estimate.expirationDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(calculateTotal(estimate), estimate.currency)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(estimate.status)}>
                              {estimate.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => convertToInvoice(estimate)}
                                title="Convert to Invoice"
                                disabled={estimate.status === 'converted'}
                              >
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditEstimate(estimate)}
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEmailEstimate(estimate)}
                                title="Email"
                              >
                                <Mail className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownloadPDF(estimate)}
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" title="Delete">
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Estimate</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete estimate {estimate.estimateNumber}? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteEstimate(estimate.id!)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Estimates;
