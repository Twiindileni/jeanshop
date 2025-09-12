#!/bin/bash

# Navigate to the project directory
cd "/home/tomas/Desktop/A Jeans shop/jeans-shop"

# Check git status
echo "Checking git status..."
git status

# Add all files
echo "Adding all files..."
git add .

# Commit with a descriptive message
echo "Committing changes..."
git commit -m "feat: Implement comprehensive e-commerce platform with real-time orders

- Add complete product management system with image uploads
- Implement user authentication and authorization
- Create comprehensive order system with customer details
- Add real-time order status updates for admin and user dashboards
- Implement responsive UI with Tailwind CSS
- Add Supabase integration for database and storage
- Create admin dashboard for order management
- Add user dashboard for order tracking
- Implement RLS policies for data security
- Add comprehensive error handling and loading states"

# Push to remote repository
echo "Pushing to remote repository..."
git push origin main

echo "Repository pushed successfully!"
