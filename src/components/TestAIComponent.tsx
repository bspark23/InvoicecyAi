import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';

const TestAIComponent: React.FC = () => {
  const [isTestingAPI, setIsTestingAPI] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testError, setTestError] = useState<string | null>(null);

  const testOpenAIConnection = async () => {
    setIsTestingAPI(true);
    setTestResult(null);
    setTestError(null);

    const OPENAI_API_KEY = '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';

    try {
      console.log('Testing OpenAI API connection...');
      
      // Test proxy server first
      const healthResponse = await fetch('http://localhost:3001/health');
      if (!healthResponse.ok) {
        throw new Error('Proxy server is not running. Please start it with: node proxy-server.js');
      }

      const response = await fetch('http://localhost:3001/api/openai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'user', content: 'Say "Hello, API is working!" in JSON format: {"message": "your response"}' }
          ],
          temperature: 0.3,
          max_tokens: 50,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`API Error (${response.status}): ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      setTestResult(`✅ API is working! Response: ${data.choices[0].message.content}`);
      
    } catch (error) {
      console.error('Test failed:', error);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setTestError('❌ CORS Error: Cannot call OpenAI API directly from browser. This is a browser security limitation.');
      } else {
        setTestError(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } finally {
      setIsTestingAPI(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>🔧 AI API Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          This will test if the OpenAI API key is working and identify any connection issues.
        </p>
        
        <Button 
          onClick={testOpenAIConnection} 
          disabled={isTestingAPI}
          className="w-full"
        >
          {isTestingAPI ? 'Testing API...' : 'Test OpenAI API Connection'}
        </Button>

        {testResult && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-green-800 font-medium">Success!</p>
              <p className="text-sm text-green-600 mt-1">{testResult}</p>
            </div>
          </div>
        )}

        {testError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-800 font-medium">Test Failed</p>
              <p className="text-sm text-red-600 mt-1">{testError}</p>
              {testError.includes('CORS') && (
                <div className="mt-2 text-xs text-red-500">
                  <p><strong>Solution:</strong> We need to use a proxy server or backend API to call OpenAI.</p>
                  <p>The Supabase edge function approach would work, or we can create a simple proxy.</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>API Key:</strong> sk-or-v1-ea417976...{OPENAI_API_KEY.slice(-10)}</p>
          <p><strong>Model:</strong> gpt-4o-mini</p>
          <p><strong>Expected Issue:</strong> CORS policy blocking direct browser → OpenAI calls</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestAIComponent;