
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Users, Receipt, Download, FileText, CreditCard, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickAccessPanel: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);

  const quickActions = [
    {
      id: 'invoice',
      title: 'Create Invoice',
      description: 'Generate a new invoice',
      icon: FileText,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => navigate('/invoices')
    },
    {
      id: 'lpo',
      title: 'Create LPO',
      description: 'Generate a purchase order',
      icon: ShoppingCart,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => navigate('/lpo')
    },
    {
      id: 'client',
      title: 'Add Client',
      description: 'Add a new client',
      icon: Users,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => navigate('/clients')
    },
    {
      id: 'expense',
      title: 'Add Expense',
      description: 'Track an expense',
      icon: Receipt,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => navigate('/expenses')
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Quick Access
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className={`h-auto p-3 sm:p-4 flex flex-col items-center gap-2 ${action.color} text-white border-0 transition-all hover:scale-105 w-full min-h-[80px] sm:min-h-[100px]`}
              onClick={action.action}
            >
              <action.icon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <div className="text-center">
                <p className="font-medium text-xs sm:text-sm leading-tight">{action.title}</p>
                <p className="text-xs opacity-90 mt-1 leading-tight">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickAccessPanel;
