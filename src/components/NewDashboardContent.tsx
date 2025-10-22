
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, DollarSign, FileText, Users, Clock } from "lucide-react";
import { useInvoiceData } from "@/hooks/useInvoiceData";
import { useAuthLocal } from "@/hooks/useAuthLocal";
import { formatCurrency, calculateTotal } from "@/utils/invoiceUtils";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import RecentActivity from "@/components/RecentActivity";
import QuickAccessPanel from "@/components/QuickAccessPanel";
import GoalsTracker from "@/components/GoalsTracker";
import DashboardExportButton from "@/components/DashboardExportButton";
import { useNavigate } from "react-router-dom";

const NewDashboardContent: React.FC = () => {
  const { user } = useAuthLocal();
  const { savedInvoices } = useInvoiceData(null, user?.email || user?.profileName);
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getUserFirstName = () => {
    if (!user?.profileName) return "";
    return user.profileName.split(' ')[0];
  };

  // Calculate dynamic stats
  const totalInvoiced = savedInvoices.reduce((sum, invoice) => {
    return sum + calculateTotal(invoice);
  }, 0);

  const totalPayments = savedInvoices
    .filter(invoice => invoice.status === "paid")
    .reduce((sum, invoice) => sum + calculateTotal(invoice), 0);

  // For now, expenses will be 0 (can be extended later with expense tracking)
  const totalExpenses = 0;
  const profit = totalPayments - totalExpenses;

  const paidInvoices = savedInvoices.filter(invoice => invoice.status === "paid").length;
  const unpaidInvoices = savedInvoices.filter(invoice => invoice.status === "unpaid").length;

  // Top paying clients calculation
  const clientPayments = savedInvoices
    .filter(invoice => invoice.status === "paid")
    .reduce((acc, invoice) => {
      const client = invoice.clientName;
      acc[client] = (acc[client] || 0) + calculateTotal(invoice);
      return acc;
    }, {} as Record<string, number>);

  const topPayingClients = Object.entries(clientPayments)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, amount]) => ({ name, amount }));

  // Top selling products/services
  const productCounts = savedInvoices.reduce((acc, invoice) => {
    invoice.lineItems.forEach(item => {
      if (item.description) {
        acc[item.description] = (acc[item.description] || 0) + item.quantity;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  const topProducts = Object.entries(productCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  const stats = [
    {
      title: "Invoiced",
      value: formatCurrency(totalInvoiced),
      change: `${savedInvoices.length} invoices total`,
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Payments",
      value: formatCurrency(totalPayments),
      change: `${paidInvoices} invoices paid`,
      icon: FileText,
      trend: "up"
    },
    {
      title: "Expenses",
      value: formatCurrency(totalExpenses),
      change: "Manual tracking",
      icon: Clock,
      trend: "neutral"
    },
    {
      title: "Profit",
      value: formatCurrency(profit),
      change: profit >= 0 ? "Positive" : "Negative",
      icon: TrendingUp,
      trend: profit >= 0 ? "up" : "down"
    }
  ];

  return (
    <div id="dashboard-content" className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Personalized Header */}
      <div className="mb-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 p-6 sm:p-8 text-white shadow-2xl">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white/5 rounded-full -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl sm:text-4xl font-bold mb-2">
                  {getGreeting()}, {getUserFirstName()}!
                </h1>
                <p className="text-lg sm:text-xl opacity-90 mb-4 sm:mb-6">
                  Ready to create professional invoices and grow your business?
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => navigate('/invoices')}
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Invoice
                  </Button>
                  <DashboardExportButton 
                    savedInvoices={savedInvoices}
                    formatCurrency={formatCurrency}
                    dashboardElementId="dashboard-content"
                  />
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center">
                    <Plus className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{stat.value}</p>
                </div>
                <div className={`p-2 sm:p-3 rounded-full ${
                  stat.trend === 'up' ? 'bg-green-100' : 
                  stat.trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  <stat.icon className={`w-4 h-4 sm:w-6 sm:h-6 ${
                    stat.trend === 'up' ? 'text-green-600' : 
                    stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`} />
                </div>
              </div>
              <div className="flex items-center mt-2">
                {stat.trend === 'up' && <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />}
                {stat.trend === 'down' && <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mr-1" />}
                <span className={`text-xs sm:text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 
                  stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                } truncate`}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Goals Tracker */}
      <div className="mb-6">
        <GoalsTracker savedInvoices={savedInvoices} />
      </div>

      {/* Analytics Dashboard with Charts */}
      <AnalyticsDashboard savedInvoices={savedInvoices} formatCurrency={formatCurrency} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {/* Quick Access Panel */}
        <div className="lg:col-span-1">
          <QuickAccessPanel />
        </div>

        {/* Top Paying Clients */}
        <Card className="bg-white lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Top Paying Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPayingClients.length > 0 ? topPayingClients.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{client.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500">Client</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">{formatCurrency(client.amount)}</p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-4 text-sm">No paid invoices yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Products/Services */}
        <Card className="bg-white lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Top Products/Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.length > 0 ? topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{product.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500">Product/Service</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">{product.count} sold</p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-4 text-sm">No products/services tracked yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default NewDashboardContent;
