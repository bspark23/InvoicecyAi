
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Mail, MessageSquare, Calendar } from "lucide-react";

const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [invoiceReminders, setInvoiceReminders] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [systemUpdates, setSystemUpdates] = useState(true);

  const handleSaveSettings = () => {
    // Save notification preferences to localStorage
    const settings = {
      emailNotifications,
      pushNotifications,
      invoiceReminders,
      paymentAlerts,
      weeklyReports,
      systemUpdates
    };
    localStorage.setItem('notification-settings', JSON.stringify(settings));
    console.log('Notification settings saved:', settings);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Notifications
              </Label>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Push Notifications
              </Label>
              <p className="text-sm text-gray-600">Receive browser push notifications</p>
            </div>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="invoice-reminders">Invoice Reminders</Label>
              <p className="text-sm text-gray-600">Get reminded about overdue invoices</p>
            </div>
            <Switch
              id="invoice-reminders"
              checked={invoiceReminders}
              onCheckedChange={setInvoiceReminders}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="payment-alerts">Payment Alerts</Label>
              <p className="text-sm text-gray-600">Notifications when payments are received</p>
            </div>
            <Switch
              id="payment-alerts"
              checked={paymentAlerts}
              onCheckedChange={setPaymentAlerts}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-reports" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Weekly Reports
              </Label>
              <p className="text-sm text-gray-600">Receive weekly business summaries</p>
            </div>
            <Switch
              id="weekly-reports"
              checked={weeklyReports}
              onCheckedChange={setWeeklyReports}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="system-updates">System Updates</Label>
              <p className="text-sm text-gray-600">Notifications about app updates and features</p>
            </div>
            <Switch
              id="system-updates"
              checked={systemUpdates}
              onCheckedChange={setSystemUpdates}
            />
          </div>

          <Button onClick={handleSaveSettings} className="w-full mt-6">
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
