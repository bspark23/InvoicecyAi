
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';

const ApiKeySettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Invoice Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">✅ AI Assistant Ready</p>
            <p className="text-green-700 text-sm mt-1">
              The AI Invoice Assistant is now ready to use! No setup required.
            </p>
          </div>
          
          <div className="prose text-sm">
            <p>
              You can now use natural language to create invoices directly:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>"Create an invoice for 5 hoodies at ₦10,000 each for Jerry's Fashion, due in 5 days"</li>
              <li>"Make an invoice for 2 designs at ₦25,000 each for Ada Tech, add 7.5% VAT"</li>
              <li>"Invoice for website redesign ₦200,000 for Zina Studio, due in 7 days"</li>
            </ul>
            <p className="mt-4">
              The AI will automatically generate structured invoice data that you can then customize and save.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeySettings;
