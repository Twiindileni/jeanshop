# 🗑️ Delete All Products Scripts

This folder contains scripts to completely remove all products from your jean shop database so you can upload real products.

## ⚠️ **WARNING**
**These scripts will permanently delete ALL products, images, and related data. This action CANNOT be undone!**

## 📋 **What Gets Deleted:**
- ✅ All products
- ✅ All product images (from database AND storage)
- ✅ All product variants (sizes, colors, etc.)
- ✅ All cart items containing these products
- ✅ All order items referencing these products

## 🚀 **Option 1: Automated Script (Recommended)**

### **Step 1: Set Up Environment**
Make sure you have your environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### **Step 2: Run the Script**
```bash
# Option A: Using npm script
npm run delete-products

# Option B: Direct execution
node scripts/delete-all-products.js

# Option C: Make it executable and run
chmod +x scripts/delete-all-products.js
./scripts/delete-all-products.js
```

### **What the Script Does:**
1. 📋 Shows you all products that will be deleted
2. ❓ Asks for confirmation (type "yes" to proceed)
3. 🖼️ Deletes all product images from Supabase Storage
4. 🗃️ Deletes all database records in correct order
5. ✅ Verifies everything was deleted successfully

## 🔧 **Option 2: Manual SQL Script**

### **Step 1: Copy the SQL**
Copy the contents of `delete-all-products.sql`

### **Step 2: Run in Supabase**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **SQL Editor**
3. Paste the script and click **Run**

### **Step 3: Manual Storage Cleanup**
1. Go to **Storage** → **product-images** bucket
2. Select all files
3. Delete them manually

## 🐛 **Troubleshooting**

### **"Missing environment variables" error:**
- Make sure `.env.local` exists in your project root
- Check that `SUPABASE_SERVICE_ROLE_KEY` is set (not the anon key)
- Restart your terminal after adding environment variables

### **"Permission denied" error:**
- Make sure you're using the SERVICE_ROLE_KEY (not ANON_KEY)
- Check that RLS policies allow admin access

### **"Foreign key constraint" error:**
- The script handles dependencies automatically
- If using SQL manually, run the commands in the exact order provided

## ✨ **After Running the Script**

Your database will be completely clean and ready for real products! You can now:

1. 📸 **Upload real product images** through the admin panel
2. 📝 **Add real product details** (titles, descriptions, prices)
3. 📐 **Set up proper sizes and variants**
4. 🛍️ **Test your ordering system** with real products

## 🔄 **Need to Run Again?**

The scripts are safe to run multiple times. If there are no products, they'll simply report that everything is already clean.

---

**Happy selling with your real products! 🎉**

