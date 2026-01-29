#!/bin/bash

echo "🚀 Quick Deploy to Render.com"
echo "=============================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git initialized"
    echo ""
fi

# Check for changes
if [[ -n $(git status -s) ]]; then
    echo "💾 Committing changes..."
    git add .
    git commit -m "Deploy: $(date +'%Y-%m-%d %H:%M:%S')"
    echo "✅ Changes committed"
    echo ""
else
    echo "✅ No changes to commit"
    echo ""
fi

# Check if remote exists
if ! git remote | grep -q 'origin'; then
    echo "⚠️  No GitHub remote found!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Create a new repository on GitHub"
    echo "2. Run: git remote add origin https://github.com/YOUR-USERNAME/calendar-api.git"
    echo "3. Run: git push -u origin main"
    echo "4. Then follow the Render deployment steps below"
else
    echo "📤 Pushing to GitHub..."
    
    # Get current branch
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    
    # Push to remote
    if git push origin "$BRANCH"; then
        echo "✅ Pushed to GitHub"
    else
        echo "⚠️  Push failed. You may need to set upstream:"
        echo "   git push -u origin $BRANCH"
    fi
fi

echo ""
echo "🎯 Deploy to Render:"
echo ""
echo "1. Go to: https://render.com"
echo "2. Sign up/Login (free)"
echo "3. Click: 'New +' → 'Web Service'"
echo "4. Connect your GitHub repository"
echo "5. Use these settings:"
echo "   • Name: calendar-api"
echo "   • Environment: Node"
echo "   • Build Command: npm install"
echo "   • Start Command: npm start"
echo "   • Plan: Free"
echo "6. Click 'Create Web Service'"
echo "7. Wait 2-3 minutes for deployment"
echo ""
echo "✨ Your API will be available at:"
echo "   https://calendar-api.onrender.com (or your chosen name)"
echo ""
echo "🔧 Update client.html with your new URL!"
echo ""

read -p "Press Enter to open Render.com in your browser..." 
open "https://render.com" 2>/dev/null || xdg-open "https://render.com" 2>/dev/null || echo "Please visit https://render.com"
