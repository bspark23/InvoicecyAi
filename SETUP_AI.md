# 🤖 AI Invoice Assistant Setup Guide

## 🚨 IMPORTANT: CORS Issue Solution

The AI assistant needs a proxy server to work because browsers block direct calls to OpenAI API.

## 🚀 Quick Setup (2 steps)

### Step 1: Install Proxy Dependencies
```bash
# Install proxy server dependencies
npm install express cors node-fetch@2.6.7 nodemon --save-dev
```

### Step 2: Start the Proxy Server
```bash
# Start the proxy server (keep this running)
node proxy-server.js
```

You should see:
```
🚀 OpenAI Proxy Server running on http://localhost:3001
📡 Health check: http://localhost:3001/health
🤖 OpenAI endpoint: http://localhost:3001/api/openai/chat
```

### Step 3: Start Your App
```bash
# In a new terminal, start your main app
npm run dev
```

## 🧪 Testing the AI Assistant

1. Go to http://localhost:8080
2. Navigate to **Invoices** page
3. Click **"AI Assistant"** button
4. Click **"Test OpenAI API Connection"** first
5. If test passes, try these prompts:

**Simple Invoice:**
```
Create an invoice for 3 web design mockups at $200 each for ABC Company, due in 15 days
```

**With Tax:**
```
Make an invoice for 5 consulting hours at $150/hour for Tech Solutions, add 10% tax, due next week
```

**Multiple Items:**
```
Invoice for 10 t-shirts at $25 each and 5 hoodies at $45 each for Fashion Store, due in 30 days
```

## 🔧 Troubleshooting

### "Proxy server is not running"
- Make sure you ran `node proxy-server.js`
- Check that port 3001 is not in use
- Restart the proxy server

### "Invalid API key" or "User not found"
- Your API key: `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`
- ⚠️ **ISSUE DETECTED**: This appears to be an OpenRouter API key, but it's returning "User not found" (401 error)
- **Solutions**:
  1. Check if the API key is expired
  2. Verify the key has sufficient credits
  3. Get a new API key from https://openrouter.ai/keys
  4. Or use a valid OpenAI API key from https://platform.openai.com/api-keys

### "Network error"
- Check your internet connection
- Make sure both servers are running (port 8080 and 3001)

## 📁 Files Created

- `proxy-server.js` - Simple Express server that proxies OpenAI API calls
- `package-proxy.json` - Dependencies for the proxy server
- Updated AI components to use the proxy

## 🎯 Expected Results

The AI should generate complete invoices with:
- ✅ Client name extracted from your prompt
- ✅ Line items with quantities and prices  
- ✅ Calculated subtotals and totals
- ✅ Tax calculations (if mentioned)
- ✅ Due dates based on your request
- ✅ Professional invoice number

## 🔄 Alternative: Production Setup

For production, consider:
1. Deploy the proxy server to a cloud service (Heroku, Railway, etc.)
2. Update the fetch URL in the components
3. Or use the Supabase edge function approach (more secure)