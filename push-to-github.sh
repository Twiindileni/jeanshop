#!/bin/bash

echo "🚀 Let's push your jeans shop to GitHub together!"
echo ""

# Check current directory
echo "📁 Current directory:"
pwd
echo ""

# Update remote URL to the correct repository
echo "🔗 Setting correct remote URL..."
git remote set-url origin https://github.com/Twiindileni/jeanshop.git

# Verify remote URL
echo "✅ Verifying remote URL:"
git remote -v
echo ""

# Check git status
echo "📊 Current git status:"
git status
echo ""

# Push to GitHub
echo "🚀 Pushing to GitHub..."
echo "This will upload all your changes to the repository."
echo ""

git push -u origin main

echo ""
echo "✅ Done! Your jeans shop is now on GitHub!"
echo "🌐 Visit: https://github.com/Twiindileni/jeanshop"