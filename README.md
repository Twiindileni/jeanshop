# Jeans Shop - Next.js 14 + Supabase

Modern jeans eCommerce with authentication, dashboard, product management, checkout, analytics, and Supabase Storage.

## Tech
- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Supabase (Auth, Database, Storage)
- Ready for Vercel

## Setup
1. Clone and install
```bash
npm install
```
2. Env vars (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=optional-for-admin-scripts
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
3. Database
- In Supabase SQL editor, run `supabase/schema.sql` to create tables, triggers, and RLS.
- Create a bucket `product-images` (public or with signed URLs per your policy).

## Scripts
```bash
npm run dev
npm run build && npm start
```

## Features
- Auth: register, login, reset password, logout
- Profiles auto-create and wallet balance
- Dashboard: wallet deposit, cart, orders
- Products grid with filters
- Admin: products CRUD (basic), image upload API, analytics
- Checkout: wallet purchase from cart

## Deploy to Vercel
- Add environment variables in Vercel Project Settings
- Set `NEXT_PUBLIC_SITE_URL` to your production domain
- Re-run DB SQL and create `product-images` bucket in Supabase
