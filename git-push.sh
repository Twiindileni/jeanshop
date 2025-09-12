#!/bin/bash

# Simple git push script
echo "Starting git push process..."

# Check git status
echo "Checking git status..."
git status

# Add all files
echo "Adding all files..."
git add .

# Commit changes
echo "Committing changes..."
git commit -m "feat: Complete e-commerce platform with real-time orders

- Add comprehensive product management system
- Implement user authentication and authorization
- Create real-time order system with instant updates
- Add admin dashboard for order management
- Add user dashboard for order tracking
- Implement image upload system for products
- Add responsive UI with Tailwind CSS
- Integrate Supabase for database and storage
- Add RLS policies for data security
- Implement comprehensive error handling"

# Check if remote exists
echo "Checking remote repositories..."
git remote -v

# Push to origin
echo "Pushing to origin..."
git push origin main

echo "Git push completed!"
