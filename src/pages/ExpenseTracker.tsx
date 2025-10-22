
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInvoiceData } from "@/hooks/useInvoiceData";
import { formatCurrency } from "@/utils/invoiceUtils";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NewDashboardSidebar from "@/components/NewDashboardSidebar";
import { Plus, Search, Edit, Trash2, TrendingDown, DollarSign, Calendar } from "lucide-react";
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
import { useAuthLocal } from "@/hooks/useAuthLocal";

type Expense = {
  id: string;
  name: string;
  amount: number;
  date: string;
  category: string;
  createdAt: string;
};

const categories = [
  "Rent", "Salary", "Tools", "Utilities", "Marketing", "Travel", "Supplies", "Other"
];

const LOCAL_STORAGE_KEY = "invoicecraft-expenses-v1";

export default function ExpenseTracker() {
  const { user } = useAuthLocal();
  const { savedInvoices } = useInvoiceData(null, user?.email || user?.profileName);
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expenseForm, setExpenseForm] = useState({ 
    name: "", 
    amount: "", 
    date: new Date().toISOString().split('T')[0], 
    category: "" 
  });
  const [currency, setCurrency] = useState("USD");
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setExpenses(JSON.parse(saved));
      } catch {
        setExpenses([]);
      }
    }
    if (savedInvoices.length > 0) {
      setCurrency(savedInvoices[0].currency || "USD");
    }
  }, [savedInvoices.length]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const filteredExpenses = expenses.filter(expense =>
    expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const expensesThisMonth = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const currentDate = new Date();
    return expenseDate.getMonth() === currentDate.getMonth() && 
           expenseDate.getFullYear() === currentDate.getFullYear();
  }).reduce((sum, expense) => sum + expense.amount, 0);

  const invoiceIncome = useMemo(
    () =>
      savedInvoices.reduce((sum, inv) => sum +
        (inv.lineItems.reduce((n, item) => n + item.amount, 0) +
        (inv.lineItems.reduce((n, item) => n + item.amount, 0) * inv.taxRate / 100) -
        inv.discountAmount), 0),
    [savedInvoices]
  );

  const handleInputChange = (field: string, value: string) => {
    setExpenseForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveExpense = () => {
    if (!expenseForm.name || !expenseForm.amount || !expenseForm.date || !expenseForm.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(expenseForm.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount.",
        variant: "destructive"
      });
      return;
    }

    const newExpense: Expense = {
      id: editingExpense?.id || Date.now().toString(),
      name: expenseForm.name,
      amount,
      date: expenseForm.date,
      category: expenseForm.category,
      createdAt: editingExpense?.createdAt || new Date().toISOString()
    };

    if (editingExpense) {
      setExpenses(prev => prev.map(e => e.id === editingExpense.id ? newExpense : e));
    } else {
      setExpenses(prev => [...prev, newExpense]);
    }

    setExpenseForm({ name: "", amount: "", date: new Date().toISOString().split('T')[0], category: "" });
    setEditingExpense(null);
    setIsAddExpenseOpen(false);

    toast({
      title: "Success",
      description: editingExpense ? "Expense updated successfully" : "Expense added successfully"
    });
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setExpenseForm({
      name: expense.name,
      amount: expense.amount.toString(),
      date: expense.date,
      category: expense.category
    });
    setIsAddExpenseOpen(true);
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
    toast({
      title: "Success",
      description: "Expense deleted successfully"
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
                <h1 className="text-2xl font-bold text-gray-900">{t("expenseTrackerTitle")}</h1>
                <p className="text-gray-600">{t("expenseTrackerSubtitle")}</p>
              </div>
              <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    {t("add")} Expense
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
                    <DialogDescription>
                      {editingExpense ? 'Update expense details' : 'Record a new business expense'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="name">{t("name")} *</Label>
                      <Input
                        id="name"
                        value={expenseForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Expense name"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="amount">{t("amount")} *</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          value={expenseForm.amount}
                          onChange={(e) => handleInputChange('amount', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="date">{t("date")} *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={expenseForm.date}
                          onChange={(e) => handleInputChange('date', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category">{t("category")} *</Label>
                      <Select value={expenseForm.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectCategory")} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setIsAddExpenseOpen(false);
                      setEditingExpense(null);
                      setExpenseForm({ name: "", amount: "", date: new Date().toISOString().split('T')[0], category: "" });
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveExpense}>
                      {editingExpense ? 'Update' : 'Add'} Expense
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
                      <p className="text-sm font-medium text-gray-600">{t("totalExpenses")}</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses, currency)}</p>
                    </div>
                    <div className="p-3 rounded-full bg-red-100">
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">This Month</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(expensesThisMonth, currency)}</p>
                    </div>
                    <div className="p-3 rounded-full bg-orange-100">
                      <Calendar className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t("netProfit")}</p>
                      <p className={`text-2xl font-bold ${invoiceIncome - totalExpenses >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(invoiceIncome - totalExpenses, currency)}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100">
                      <DollarSign className="w-6 h-6 text-blue-600" />
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
                    placeholder="Search expenses by name or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Expenses Table */}
            <Card>
              <CardHeader>
                <CardTitle>{t("expenses")} ({filteredExpenses.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredExpenses.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingDown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm ? "No expenses found" : t("noExpenses")}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm 
                        ? "Try adjusting your search terms" 
                        : "Start tracking expenses by adding your first expense"
                      }
                    </p>
                    {!searchTerm && (
                      <Button onClick={() => setIsAddExpenseOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Expense
                      </Button>
                    )}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell className="font-medium">
                            {expense.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{expense.category}</Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(expense.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-semibold text-red-600">
                            {formatCurrency(expense.amount, currency)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditExpense(expense)}
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
                                    <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this expense? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteExpense(expense.id)}>
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
}
