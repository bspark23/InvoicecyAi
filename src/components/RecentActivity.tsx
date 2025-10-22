
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CreditCard, Users, Mail, Calculator } from "lucide-react";
import { useInvoiceActivity } from "@/hooks/useInvoiceActivity";

const RecentActivity: React.FC = () => {
  const { events } = useInvoiceActivity();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-green-600" />;
      case 'client':
        return <Users className="w-4 h-4 text-purple-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-orange-600" />;
      case 'estimate':
        return <Calculator className="w-4 h-4 text-teal-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'created':
        return "bg-blue-100 text-blue-800";
      case 'payment':
        return "bg-green-100 text-green-800";
      case 'client':
        return "bg-purple-100 text-purple-800";
      case 'email':
        return "bg-orange-100 text-orange-800";
      case 'estimate':
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Simulate real-time activities
  const recentActivities = [
    {
      id: 1,
      type: 'created',
      description: 'Invoice #012 created',
      timestamp: new Date().toISOString(),
      details: 'for Acme Corp - $2,500.00'
    },
    {
      id: 2,
      type: 'payment',
      description: 'Payment received',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      details: 'Invoice #011 - $1,800.00'
    },
    {
      id: 3,
      type: 'client',
      description: 'Client updated',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      details: 'TechCorp contact information'
    },
    {
      id: 4,
      type: 'estimate',
      description: 'Estimate generated',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      details: 'EST-2024-015 for WebFlow Inc'
    },
    {
      id: 5,
      type: 'email',
      description: 'Email sent',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      details: 'Invoice #010 to client@example.com'
    }
  ];

  const combinedActivities = [...events, ...recentActivities]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {combinedActivities.length > 0 ? (
          combinedActivities.map((activity, index) => (
            <div key={activity.id || index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.description}
                  </p>
                  <Badge className={`text-xs ${getActivityColor(activity.type)}`}>
                    {activity.type}
                  </Badge>
                </div>
                {activity.details && (
                  <p className="text-xs text-gray-500 mb-1">{activity.details}</p>
                )}
                <p className="text-xs text-gray-400">
                  {new Date(activity.timestamp).toLocaleDateString()} at{' '}
                  {new Date(activity.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
