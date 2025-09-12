#!/bin/bash

echo "🚀 Starting git push process..."

# Check if we're in the right directory
echo "📁 Current directory:"
pwd

# Check git status
echo "📊 Git status:"
git status

# Add all files
echo "➕ Adding all files..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "feat: Add About Us and Contact Us pages with team information

- Add comprehensive About Us page with company story and values
- Add Contact Us page with contact form and information
- Update team section with Assampta Gahutu (Founder) and Cleo Thomas (Tech Lead)
- Add payment message system for PAY to CELL
- Update navigation links to new pages
- Improve overall user experience and site navigation"

# Check remote
echo "🔗 Checking remote repositories..."
git remote -v

# Add remote if not exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "➕ Adding remote origin..."
    git remote add origin https://github.com/Twiindileni/jeanshop.git
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ Git push completed!"
