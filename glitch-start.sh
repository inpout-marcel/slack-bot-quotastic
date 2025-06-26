#!/bin/bash

echo "🚀 Starting Quotastic setup..."

# Check if we have node/npm in standard locations
if command -v node &> /dev/null; then
    echo "✅ Found Node.js: $(node --version)"
else
    # Try common node locations on Glitch
    for NODE_PATH in /opt/nodejs/*/bin /usr/local/bin /usr/bin; do
        if [ -f "$NODE_PATH/node" ]; then
            export PATH="$NODE_PATH:$PATH"
            echo "✅ Found Node.js at $NODE_PATH: $(node --version)"
            break
        fi
    done
fi

# If still no node, try to use Glitch's node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found in standard locations"
    echo "🔍 Checking Glitch environment..."
    
    # Use Glitch's built-in node if available
    if [ -f "/app/.config/glitch/node" ]; then
        export PATH="/app/.config/glitch:$PATH"
    fi
fi

# Final check
if command -v node &> /dev/null; then
    echo "✅ Using Node.js: $(node --version)"
    echo "✅ Using npm: $(npm --version)"
else
    echo "❌ ERROR: Node.js is not available!"
    echo "Please try these steps:"
    echo "1. In Glitch, click 'Tools' > 'Terminal'"
    echo "2. Run: enable-npm"
    echo "3. Then run: refresh"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Start the bot
echo "⚡ Starting Quotastic bot..."
exec node index.js