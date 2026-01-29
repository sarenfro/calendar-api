#!/bin/bash

echo "🚀 Starting Calendar API with ngrok tunnel..."
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null
then
    echo "❌ ngrok is not installed."
    echo ""
    echo "Please install ngrok:"
    echo "  Mac:     brew install ngrok"
    echo "  Windows: Download from https://ngrok.com/download"
    echo "  Linux:   snap install ngrok"
    exit 1
fi

# Check if server is already running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Server already running on port 3000"
else
    echo "📦 Starting server..."
    npm start &
    SERVER_PID=$!
    sleep 3
fi

# Start ngrok
echo ""
echo "🌐 Creating public tunnel..."
ngrok http 3000 &
NGROK_PID=$!

sleep 2

# Get the public URL
echo ""
echo "🎉 Your Calendar API is now accessible!"
echo ""
echo "Getting public URL..."
sleep 2

# Try to get the URL from ngrok API
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*' | cut -d'"' -f4 | head -1)

if [ -z "$NGROK_URL" ]; then
    echo "⚠️  Couldn't auto-detect URL. Open http://localhost:4040 to see your ngrok URL"
else
    echo "📋 Share this URL with your team:"
    echo "   $NGROK_URL"
    echo ""
    echo "📋 Web interface:"
    echo "   $NGROK_URL/client.html"
fi

echo ""
echo "📊 ngrok dashboard: http://localhost:4040"
echo ""
echo "Press Ctrl+C to stop..."

# Wait for user interrupt
wait
