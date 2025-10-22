
import { useMemo } from "react";
import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar, ChartPie } from "lucide-react";
import { InvoiceData } from "@/types/invoice";
import { format } from "date-fns";
import { calculateTotal } from "@/utils/invoiceUtils";

interface AnalyticsDashboardProps {
  savedInvoices: InvoiceData[];
  formatCurrency: (amount: number, currencyCode?: string) => string;
}

const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#a78bfa", "#f59e42", "#14b8a6"];

function getMonthYear(dateString: string) {
  const date = new Date(dateString);
  return format(date, "MMM yyyy");
}

const AnalyticsDashboard = ({ savedInvoices, formatCurrency }: AnalyticsDashboardProps) => {
  // Group invoices by month for invoices, payments, and expenses
  const monthlyData = useMemo(() => {
    const monthMap: { [month: string]: { invoices: number; payments: number; expenses: number } } = {};

    savedInvoices.forEach(inv => {
      const month = getMonthYear(inv.invoiceDate);
      if (!monthMap[month]) monthMap[month] = { invoices: 0, payments: 0, expenses: 0 };
      
      const total = calculateTotal(inv);
      monthMap[month].invoices += total;
      
      if (inv.status === "paid") {
        monthMap[month].payments += total;
      }
      
      // Expenses are 0 for now - can be extended later
      monthMap[month].expenses = 0;
    });

    return Object.entries(monthMap)
      .map(([month, data]) => ({
        month,
        invoices: data.invoices,
        payments: data.payments,
        expenses: data.expenses,
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }, [savedInvoices]);

  // Invoice status data for pie chart
  const invoiceStatusData = useMemo(() => {
    const paid = savedInvoices.filter(inv => inv.status === "paid").length;
    const outstanding = savedInvoices.filter(inv => inv.status === "unpaid").length;

    return [
      { name: "Paid", value: paid, color: "#22c55e" },
      { name: "Outstanding", value: outstanding, color: "#ef4444" },
    ].filter(d => d.value > 0);
  }, [savedInvoices]);

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoice Status Pie Chart */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartPie className="w-5 h-5 text-purple-500" />
              Invoice Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {invoiceStatusData.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">No invoices yet</div>
            ) : (
              <ChartContainer
                config={{
                  paid: { label: "Paid", color: "#22c55e" },
                  outstanding: { label: "Outstanding", color: "#ef4444" }
                }}
              >
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={invoiceStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ percent, name }) => percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ""}
                    >
                      {invoiceStatusData.map((entry, idx) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartLegendContent
                      payload={invoiceStatusData.map((entry) => ({
                        value: entry.name,
                        color: entry.color,
                        type: "square",
                      }))}
                      verticalAlign="bottom"
                    />
                    <ChartTooltipContent />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Invoice Figures Bar Chart */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBar className="w-5 h-5 text-blue-500" />
              Invoice Figures
            </CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">No data yet</div>
            ) : (
              <ChartContainer
                config={{
                  invoices: { label: "Invoices", color: "#3b82f6" },
                  payments: { label: "Payments", color: "#22c55e" },
                  expenses: { label: "Expenses", color: "#ef4444" }
                }}
              >
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="invoices" fill="#3b82f6" name="Invoices" />
                    <Bar dataKey="payments" fill="#22c55e" name="Payments" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                    <ChartTooltipContent
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
