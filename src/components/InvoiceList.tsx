import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Trash2, Check, X, Sun, Moon } from "lucide-react";
import { InvoiceData } from "@/types/invoice";

interface InvoiceListProps {
  savedInvoices: InvoiceData[];
  formatCurrency: (amount: number, currencyCode?: string) => string;
  toggleInvoiceStatus: (invoiceId: string) => void;
  loadInvoice: (invoice: InvoiceData) => void;
  deleteInvoice: (invoiceId: string) => void;
  setViewMode: React.Dispatch<React.SetStateAction<'create' | 'list' | 'print'>>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const InvoiceList = ({
  savedInvoices,
  formatCurrency,
  toggleInvoiceStatus,
  loadInvoice,
  deleteInvoice,
  setViewMode,
  isDarkMode,
  toggleDarkMode,
}: InvoiceListProps) => {
  // Clone an invoice
  const handleDuplicate = (invoice: InvoiceData) => {
    const newId = Date.now().toString();
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const nextNumber = Math.floor(((Math.random() * 900) + 100));
    const newInvoiceNumber = `INV-${year}-${month}-${nextNumber}`;
    const newInvoice: InvoiceData = {
      ...invoice,
      id: newId,
      invoiceNumber: newInvoiceNumber,
      createdAt: new Date().toISOString(),
      status: 'unpaid',
    };
    loadInvoice(newInvoice); // load into form
    setViewMode('create');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Saved Invoices</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your saved invoices</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={toggleDarkMode} variant="outline" size="sm">
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button onClick={() => setViewMode('create')} variant="outline">
              Back to Current
            </Button>
          </div>
        </div>

        {/* Invoices List */}
        <div className="grid gap-4">
          {savedInvoices.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-300">No saved invoices yet. Create and save your first invoice!</p>
              </CardContent>
            </Card>
          ) : (
            savedInvoices.map((invoice) => (
              <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{invoice.clientName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Due: {invoice.dueDate}</p>
                          <p className="font-medium">{formatCurrency(invoice.lineItems.reduce((sum, item) => sum + item.amount, 0) + (invoice.lineItems.reduce((sum, item) => sum + item.amount, 0) * invoice.taxRate / 100) - invoice.discountAmount, invoice.currency)}</p>
                        </div>
                        <div>
                          <Badge variant={invoice.status === 'paid' ? 'default' : 'destructive'}>
                            {invoice.status === 'paid' ? '✅ Paid' : '❌ Unpaid'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => toggleInvoiceStatus(invoice.id!)}
                        variant="outline"
                        size="sm"
                        title={invoice.status === 'paid' ? "Mark as Unpaid" : "Mark as Paid"}
                      >
                        {invoice.status === 'paid' ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                      </Button>
                      <Button
                        onClick={() => loadInvoice(invoice)}
                        variant="outline"
                        size="sm"
                        title="Edit"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDuplicate(invoice)}
                        variant="outline"
                        size="sm"
                        title="Duplicate Invoice"
                      >
                        <FileText className="w-4 h-4" />
                        Duplicate
                      </Button>
                      <Button
                        onClick={() => deleteInvoice(invoice.id!)}
                        variant="outline"
                        size="sm"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
