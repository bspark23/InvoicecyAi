import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Send, Loader2, AlertCircle } from 'lucide-react';
import { useInvoiceData } from '@/hooks/useInvoiceData';
import { useAuthLocal } from '@/hooks/useAuthLocal';
import { InvoiceData } from '@/types/invoice';
import { toast } from '@/hooks/use-toast';

interface DirectAIInvoiceAssistantProps {
  onInvoiceGenerated?: (invoice: InvoiceData) => void;
}

const DirectAIInvoiceAssistant: React.FC<DirectAIInvoiceAssistantProps> = ({ onInvoiceGenerated }) => {
  const { user } = useAuthLocal();
  const { generateInvoiceNumber } = useInvoiceData(null, user?.email || user?.profileName);
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedInvoice, setLastGeneratedInvoice] = useState<InvoiceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Your OpenAI API key
  const OPENAI_API_KEY = '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';

  const cleanJsonResponse = (response: string): string => {
    let cleanedResponse = response.trim();
    
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

    const systemPrompt = `You are a smart invoice assistant named "InvoiceEase".

Your job is to take any user instruction in plain English and generate a structured invoice in JSON format. This invoice should contain all key financial and business details based on what the user said.

🎯 Your response must be ONLY in this exact JSON structure — no explanations, no extra text:

{
  "invoiceNumber": "INV-0001",
  "clientName": "",
  "clientEmail": "",
  "items": [
    {
      "name": "",
      "quantity": 0,
      "price": 0
    }
  ],
  "subtotal": 0,
  "tax": 0,
  "total": 0,
  "currency": "$",
  "issueDate": "",
  "dueDate": "",
  "paymentTerms": "",
  "notes": ""
}

The user input will describe:
- Client name
- What the invoice is for
- Quantity and price
- Tax or VAT (if needed)
- Due date or payment terms

Fill out the JSON correctly, calculate totals, and include tax if mentioned.

✅ Examples of user input:
- Create an invoice for 5 hoodies at $50 each for Jerry's Fashion, due in 5 days.
- Make an invoice for 2 designs at $250 each for Ada Tech, add 7.5% VAT.
- Invoice for a website redesign $2000 for Zina Studio, due in 7 days.

Always return clean, valid JSON that matches the user's request.`;

    try {
      // Use proxy server to avoid CORS issues
      const response = await fetch('http://localhost:3001/api/openai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userInput }
          ],
          temperature: 0.3,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        let errorMessage = `OpenAI API request failed (${response.status})`;
        
        if (errorData.error) {
          if (errorData.error.code === 'insufficient_quota') {
            errorMessage = 'OpenAI API quota exceeded. Please check your billing.';
          } else if (errorData.error.code === 'invalid_api_key') {
            errorMessage = 'Invalid OpenAI API key configured.';
          } else {
            errorMessage = errorData.error.message || errorMessage;
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const generatedText = data.choices[0].message.content.trim();
      
      console.log('AI response:', generatedText);
      
      // Clean the JSON response to remove markdown formatting
      const cleanedJson = cleanJsonResponse(generatedText);
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
        currency: parsedInvoice.currency === '$' ? 'USD' : 'USD',
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
          AI Invoice Assistant (Direct API)
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
• Create an invoice for 5 hoodies at $50 each for Jerry's Fashion, due in 5 days
• Make an invoice for 2 designs at $250 each for Ada Tech, add 7.5% VAT
• Invoice for website redesign $2000 for Zina Studio, due in 7 days"
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
              Generate Invoice with AI
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

export default DirectAIInvoiceAssistant;