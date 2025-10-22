#!/bin/bash

echo "🤖 Starting AI Invoice Assistant..."
echo ""
echo "Step 1: Installing proxy dependencies..."
npm install express cors node-fetch@2.6.7 nodemon --save-dev
echo ""
echo "Step 2: Starting proxy server..."
echo "⚠️  Keep this terminal open! The proxy server must stay running."
echo ""
echo "🚀 Proxy server starting on http://localhost:3001"
echo "📱 Your main app should run on http://localhost:8080"
echo ""
echo "✅ Once you see 'OpenAI Proxy Server running', open a new terminal and run: npm run dev"
echo ""
node proxy-server.js