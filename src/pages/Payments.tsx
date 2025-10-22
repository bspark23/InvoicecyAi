
import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NewDashboardSidebar from "@/components/NewDashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, Search, Edit, Trash2, DollarSign, Calendar, 
  CreditCard, FileText, CheckCircle
} from "lucide-react";
import { useInvoiceData } from "@/hooks/useInvoiceData";
import { useAuthLocal } from "@/hooks/useAuthLocal";
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

type Payment = {
  id: string;
  amount: number;
  date: string;
  method: string;
  invoiceId?: string;
  invoiceNumber?: string;
  clientName: string;
  description?: string;
  createdAt: string;
};

const LOCAL_STORAGE_KEY = "invoicecraft-payments-v1";

const paymentMethods = [
  "Cash", "Credit Card", "Bank Transfer", "Check", "PayPal", "Stripe", "Other"
];

const Payments: React.FC = () => {
  const { user } = useAuthLocal();
  const { toast } = useToast();
  const { savedInvoices, toggleInvoiceStatus } = useInvoiceData(null, user?.email || user?.profileName);
  
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    date: new Date().toISOString().split('T')[0],
    method: "",
    invoiceId: "",
    clientName: "",
    description: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setPayments(JSON.parse(saved));
      } catch {
        setPayments([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payments));
  }, [payments]);

  const filteredPayments = payments.filter(payment =>
    payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.method.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paymentsThisMonth = payments.filter(payment => {
    const paymentDate = new Date(payment.date);
    const currentDate = new Date();
    return paymentDate.getMonth() === currentDate.getMonth() && 
           paymentDate.getFullYear() === currentDate.getFullYear();
  }).reduce((sum, payment) => sum + payment.amount, 0);

  const handleInputChange = (field: string, value: string) => {
    setPaymentForm(prev => ({ ...prev, [field]: value }));
    
    // Auto-populate client name when invoice is selected
    if (field === 'invoiceId' && value && value !== 'none') {
      const selectedInvoice = savedInvoices.find(inv => inv.id === value);
      if (selectedInvoice) {
        setPaymentForm(prev => ({ 
          ...prev, 
          clientName: selectedInvoice.clientName,
          invoiceId: value
        }));
      }
    } else if (field === 'invoiceId' && value === 'none') {
      setPaymentForm(prev => ({ 
        ...prev, 
        invoiceId: ""
      }));
    }
  };

  const handleSavePayment = () => {
    if (!paymentForm.amount || !paymentForm.date || !paymentForm.method || !paymentForm.clientName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(paymentForm.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount.",
        variant: "destructive"
      });
      return;
    }

    const selectedInvoice = savedInvoices.find(inv => inv.id === paymentForm.invoiceId);

    const newPayment: Payment = {
      id: editingPayment?.id || Date.now().toString(),
      amount,
      date: paymentForm.date,
      method: paymentForm.method,
      invoiceId: paymentForm.invoiceId || undefined,
      invoiceNumber: selectedInvoice?.invoiceNumber,
      clientName: paymentForm.clientName,
      description: paymentForm.description,
      createdAt: editingPayment?.createdAt || new Date().toISOString()
    };

    if (editingPayment) {
      setPayments(prev => prev.map(p => p.id === editingPayment.id ? newPayment : p));
    } else {
      setPayments(prev => [...prev, newPayment]);
      
      // Mark invoice as paid if payment covers the full amount
      if (selectedInvoice && selectedInvoice.status !== 'paid') {
        toggleInvoiceStatus(selectedInvoice.id!);
      }
    }

    setPaymentForm({
      amount: "",
      date: new Date().toISOString().split('T')[0],
      method: "",
      invoiceId: "",
      clientName: "",
      description: ""
    });
    setEditingPayment(null);
    setIsAddPaymentOpen(false);

    toast({
      title: "Success",
      description: editingPayment ? "Payment updated successfully" : "Payment added successfully"
    });
  };

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    setPaymentForm({
      amount: payment.amount.toString(),
      date: payment.date,
      method: payment.method,
      invoiceId: payment.invoiceId || "",
      clientName: payment.clientName,
      description: payment.description || ""
    });
    setIsAddPaymentOpen(true);
  };

  const handleDeletePayment = (paymentId: string) => {
    setPayments(prev => prev.filter(p => p.id !== paymentId));
    toast({
      title: "Success",
      description: "Payment deleted successfully"
    });
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
                <p className="text-gray-600">Track and manage all received payments.</p>
              </div>
              <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{editingPayment ? 'Edit Payment' : 'Add New Payment'}</DialogTitle>
                    <DialogDescription>
                      {editingPayment ? 'Update payment details' : 'Record a new payment received'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="amount">Amount *</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          value={paymentForm.amount}
                          onChange={(e) => handleInputChange('amount', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="date">Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={paymentForm.date}
                          onChange={(e) => handleInputChange('date', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="method">Payment Method *</Label>
                      <Select value={paymentForm.method} onValueChange={(value) => handleInputChange('method', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="invoice">Link to Invoice (Optional)</Label>
                      <Select value={paymentForm.invoiceId} onValueChange={(value) => handleInputChange('invoiceId', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select invoice" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No invoice</SelectItem>
                          {savedInvoices.map((invoice) => (
                            <SelectItem key={invoice.id} value={invoice.id!}>
                              {invoice.invoiceNumber} - {invoice.clientName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="clientName">Client Name *</Label>
                      <Input
                        id="clientName"
                        value={paymentForm.clientName}
                        onChange={(e) => handleInputChange('clientName', e.target.value)}
                        placeholder="Client name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={paymentForm.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Payment description (optional)"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setIsAddPaymentOpen(false);
                      setEditingPayment(null);
                      setPaymentForm({
                        amount: "",
                        date: new Date().toISOString().split('T')[0],
                        method: "",
                        invoiceId: "",
                        clientName: "",
                        description: ""
                      });
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleSavePayment}>
                      {editingPayment ? 'Update' : 'Add'} Payment
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Payments</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPayments)}</p>
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
                      <p className="text-sm font-medium text-gray-600">This Month</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(paymentsThisMonth)}</p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Payment Count</p>
                      <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
                    </div>
                    <div className="p-3 rounded-full bg-purple-100">
                      <CheckCircle className="w-6 h-6 text-purple-600" />
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
                    placeholder="Search payments by client, invoice, or payment method..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payments Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Payments ({filteredPayments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm ? "No payments found" : "No payments yet"}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm 
                        ? "Try adjusting your search terms" 
                        : "Start tracking payments by adding your first payment"
                      }
                    </p>
                    {!searchTerm && (
                      <Button onClick={() => setIsAddPaymentOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Payment
                      </Button>
                    )}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            {new Date(payment.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-medium">
                            {payment.clientName}
                          </TableCell>
                          <TableCell>
                            {payment.invoiceNumber ? (
                              <Badge variant="outline">{payment.invoiceNumber}</Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            {formatCurrency(payment.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{payment.method}</Badge>
                          </TableCell>
                          <TableCell>
                            {payment.description || <span className="text-gray-400">-</span>}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditPayment(payment)}
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" title="Delete">
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Payment</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this payment? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeletePayment(payment.id)}>
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

export default Payments;
