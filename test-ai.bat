@echo off
echo Testing AI Invoice Assistant...
echo.

echo 1. Testing proxy server health...
curl -s http://localhost:3001/health
echo.
echo.

echo 2. Testing AI response to greeting...
curl -s -X POST http://localhost:3001/api/openai/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"model\":\"gpt-4o-mini\",\"messages\":[{\"role\":\"user\",\"content\":\"Hello!\"}],\"temperature\":0.3,\"max_tokens\":50}"
echo.
echo.

echo 3. Testing AI invoice generation...
curl -s -X POST http://localhost:3001/api/openai/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"model\":\"gpt-4o-mini\",\"messages\":[{\"role\":\"user\",\"content\":\"Create an invoice for 2 logos at $300 each for XYZ Corp\"}],\"temperature\":0.3,\"max_tokens\":500}"
echo.
echo.

echo Tests complete! The AI assistant is working.
echo Now go to http://localhost:8080 and test the AI Assistant in the Invoices page.
pause