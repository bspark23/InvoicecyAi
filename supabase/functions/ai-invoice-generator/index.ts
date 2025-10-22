
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userInput, provider = 'openai' } = await req.json();

    if (!userInput || userInput.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'User input is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
  "currency": "₦",
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
- Create an invoice for 5 hoodies at ₦10,000 each for Jerry's Fashion, due in 5 days.
- Make an invoice for 2 designs at ₦25,000 each for Ada Tech, add 7.5% VAT.
- Invoice for a website redesign ₦200,000 for Zina Studio, due in 7 days.

Always return clean, valid JSON that matches the user's request.`;

    let response;

    if (provider === 'openai') {
      const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openaiApiKey) {
        return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
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
        
        return new Response(JSON.stringify({ error: errorMessage }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();
      const generatedText = data.choices[0].message.content.trim();

      return new Response(JSON.stringify({ generatedText }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (provider === 'gemini') {
      const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
      if (!geminiApiKey) {
        return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser request: ${userInput}`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        let errorMessage = `Gemini API request failed (${response.status})`;
        
        if (errorData.error) {
          if (errorData.error.code === 'API_KEY_INVALID') {
            errorMessage = 'Invalid Gemini API key configured.';
          } else if (errorData.error.code === 'QUOTA_EXCEEDED') {
            errorMessage = 'Gemini API quota exceeded.';
          } else if (errorData.error.message && errorData.error.message.includes('Generative Language API has not been used')) {
            errorMessage = 'Generative Language API is not enabled in Google Cloud Console.';
          } else {
            errorMessage = errorData.error.message || errorMessage;
          }
        }
        
        return new Response(JSON.stringify({ error: errorMessage }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text.trim();

      return new Response(JSON.stringify({ generatedText }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid provider specified' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-invoice-generator function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
