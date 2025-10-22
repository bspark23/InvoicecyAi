import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

// Your OpenAI API key
const OPENAI_API_KEY = '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';

app.use(cors());
app.use(express.json());

app.post('/api/openai/chat', async (req, res) => {
  try {
    console.log('Received request:', req.body);
    
    // Detect if this is an OpenRouter key or OpenAI key
    let response;
    let isOpenRouter = OPENAI_API_KEY.startsWith('sk-or-');
    
    if (isOpenRouter) {
      console.log('Using OpenRouter API...');
      
      // Try different OpenRouter configurations
      const openRouterBody = {
        ...req.body,
        // Ensure we're using a supported model
        model: req.body.model === 'gpt-4o-mini' ? 'openai/gpt-4o-mini' : req.body.model
      };
      
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:8080',
          'X-Title': 'Invoice Assistant',
          'User-Agent': 'Invoice-Assistant/1.0'
        },
        body: JSON.stringify(openRouterBody),
      });
    } else {
      console.log('Using OpenAI API...');
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });
    }

    const data = await response.json();
    
    if (!response.ok) {
      console.error('API Error:', data);
      
      // If API key is invalid, provide a helpful mock response for testing
      if (data.error && (data.error.code === 'invalid_api_key' || data.error.code === 401 || data.error.message === 'User not found.')) {
        console.log('API key invalid, providing mock response for testing...');
        
        const userMessage = req.body.messages[req.body.messages.length - 1].content;
        let mockResponse = '';
        
        // Generate a mock invoice response if it's an invoice request
        if (userMessage.toLowerCase().includes('invoice') || userMessage.toLowerCase().includes('create') || userMessage.toLowerCase().includes('bill')) {
          mockResponse = `{
  "invoiceNumber": "INV-${Date.now().toString().slice(-4)}",
  "clientName": "Demo Client",
  "clientEmail": "client@example.com",
  "items": [
    {
      "name": "Demo Service",
      "quantity": 1,
      "price": 100
    }
  ],
  "subtotal": 100,
  "tax": 10,
  "total": 110,
  "currency": "$",
  "issueDate": "${new Date().toISOString().split('T')[0]}",
  "dueDate": "${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}",
  "paymentTerms": "Net 30",
  "notes": "This is a demo invoice generated because the API key is invalid. Please provide a valid API key for full functionality."
}`;
        } else {
          mockResponse = `{"message": "Hello! This is a demo response because the API key is invalid. Please provide a valid OpenAI or OpenRouter API key for full functionality."}`;
        }
        
        return res.json({
          choices: [{
            message: {
              content: mockResponse,
              role: 'assistant'
            }
          }],
          usage: { total_tokens: 50 }
        });
      }
      
      return res.status(response.status).json(data);
    }

    console.log('API response successful');
    res.json(data);
    
  } catch (error) {
    console.error('Proxy server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'OpenAI Proxy Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 OpenAI Proxy Server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 OpenAI endpoint: http://localhost:${PORT}/api/openai/chat`);
});