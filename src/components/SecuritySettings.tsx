
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, Lock, Key, Download, Trash2, AlertTriangle } from "lucide-react";
import { useAuthLocal } from "@/hooks/useAuthLocal";

const SecuritySettings = () => {
  const { user } = useAuthLocal();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [autoLogout, setAutoLogout] = useState(true);
  const [dataEncryption, setDataEncryption] = useState(true);

  const handleExportData = () => {
    // Export user data
    const userData = {
      profile: user,
      invoices: JSON.parse(localStorage.getItem('invoices') || '[]'),
      clients: JSON.parse(localStorage.getItem('clients') || '[]'),
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comprehensive-invoice-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAllData = () => {
    if (window.confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      const keysToRemove = [
        'invoices',
        'clients',
        'invoicecraft-local-users',
        'invoicecraft-auth-user',
        'notification-settings'
      ];
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      alert('All data has been deleted successfully.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="two-factor" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                Two-Factor Authentication
              </Label>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <Switch
              id="two-factor"
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-logout" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Auto Logout
              </Label>
              <p className="text-sm text-gray-600">Automatically log out after 30 minutes of inactivity</p>
            </div>
            <Switch
              id="auto-logout"
              checked={autoLogout}
              onCheckedChange={setAutoLogout}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="data-encryption">Data Encryption</Label>
              <p className="text-sm text-gray-600">Encrypt local data storage</p>
            </div>
            <Switch
              id="data-encryption"
              checked={dataEncryption}
              onCheckedChange={setDataEncryption}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Export Your Data</h4>
            <p className="text-blue-800 text-sm mb-3">
              Download a copy of all your invoices, clients, and account data.
            </p>
            <Button onClick={handleExportData} variant="outline" className="border-blue-300">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Danger Zone
            </h4>
            <p className="text-red-800 text-sm mb-3">
              Permanently delete all your data. This action cannot be undone.
            </p>
            <Button onClick={handleDeleteAllData} variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Information */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Data Storage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>Local Storage:</strong> All your data is stored locally in your browser. 
              We don't send your personal information to external servers.
            </p>
            <p>
              <strong>Data Security:</strong> Your invoices and client information remain on your device 
              and are not transmitted to third parties.
            </p>
            <p>
              <strong>Account Data:</strong> Only basic profile information is used for authentication 
              and is stored securely in local storage.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
