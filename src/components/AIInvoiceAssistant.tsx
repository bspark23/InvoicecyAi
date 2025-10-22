
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Send, Loader2, AlertCircle } from 'lucide-react';
import { useInvoiceData } from '@/hooks/useInvoiceData';
import { useAuthLocal } from '@/hooks/useAuthLocal';
import { InvoiceData } from '@/types/invoice';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AIInvoiceAssistantProps {
  onInvoiceGenerated?: (invoice: InvoiceData) => void;
}

const AIInvoiceAssistant: React.FC<AIInvoiceAssistantProps> = ({ onInvoiceGenerated }) => {
  const { user } = useAuthLocal();
  const { generateInvoiceNumber } = useInvoiceData(null, user?.email || user?.profileName);
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedInvoice, setLastGeneratedInvoice] = useState<InvoiceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cleanJsonResponse = (response: string): string => {
    // Remove markdown code blocks if present
    let cleanedResponse = response.trim();
    
    // Remove ```json and ``` markers
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '');
    }
    if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '');
    }
    if (cleanedResponse.endsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/\s*```$/, '');
    }
    
    return cleanedResponse.trim();
  };

  const generateInvoice = async () => {
    if (!userInput.trim()) return;
    
    setIsGenerating(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('ai-invoice-generator', {
        body: {
          userInput,
          provider: 'openai' // Using OpenAI with the provided API key
        }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Failed to generate invoice');
      }

      console.log('AI response:', data.generatedText);
      
      // Clean the JSON response to remove markdown formatting
      const cleanedJson = cleanJsonResponse(data.generatedText);
      console.log('Cleaned JSON:', cleanedJson);
      
      // Parse the JSON response
      const parsedInvoice = JSON.parse(cleanedJson);
      
      // Convert to our InvoiceData format
      const invoiceData: InvoiceData = {
        id: Date.now().toString(),
        invoiceNumber: parsedInvoice.invoiceNumber || generateInvoiceNumber(),
        businessName: user?.profileName || user?.email || 'Your Business',
        businessEmail: user?.email || 'business@example.com',
        businessAddress: 'Your Business Address',
        clientName: parsedInvoice.clientName || '',
        clientEmail: parsedInvoice.clientEmail || '',
        clientAddress: '',
        invoiceDate: parsedInvoice.issueDate || new Date().toISOString().split('T')[0],
        dueDate: parsedInvoice.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lineItems: parsedInvoice.items?.map((item: any, index: number) => ({
          id: (index + 1).toString(),
          description: item.name || '',
          quantity: item.quantity || 1,
          rate: item.price || 0,
          amount: (item.quantity || 1) * (item.price || 0),
        })) || [],
        currency: parsedInvoice.currency === '₦' ? 'NGN' : 'USD',
        taxRate: parsedInvoice.tax && parsedInvoice.subtotal ? (parsedInvoice.tax / parsedInvoice.subtotal) * 100 : 0,
        discountAmount: 0,
        status: 'unpaid',
        notes: parsedInvoice.notes || parsedInvoice.paymentTerms || '',
        template: 'minimalist',
        colorTheme: 'blue',
      };

      setLastGeneratedInvoice(invoiceData);
      onInvoiceGenerated?.(invoiceData);
      setUserInput('');
      setError(null);
      
      toast({
        title: "Invoice Generated!",
        description: `Invoice #${invoiceData.invoiceNumber} for ${invoiceData.clientName} has been created.`,
      });
      
    } catch (error) {
      console.error('Error generating invoice:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate invoice. Please try again.';
      setError(errorMessage);
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          AI Invoice Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-800 font-medium">Error</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        <div>
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Describe your invoice in plain English...

Examples:
• Create an invoice for 5 hoodies at ₦10,000 each for Jerry's Fashion, due in 5 days
• Make an invoice for 2 designs at ₦25,000 each for Ada Tech, add 7.5% VAT
• Invoice for website redesign ₦200,000 for Zina Studio, due in 7 days"
            rows={6}
            className="resize-none"
          />
        </div>
        
        <Button 
          onClick={generateInvoice} 
          disabled={isGenerating || !userInput.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Invoice...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Generate Invoice
            </>
          )}
        </Button>

        {lastGeneratedInvoice && !error && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              ✅ Invoice generated successfully!
            </p>
            <p className="text-sm text-green-600 mt-1">
              Invoice #{lastGeneratedInvoice.invoiceNumber} for {lastGeneratedInvoice.clientName}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInvoiceAssistant;
