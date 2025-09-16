#!/usr/bin/env node

/**
 * Delete All Products Script
 * 
 * This script will:
 * 1. Delete all product images from Supabase Storage
 * 2. Delete all product-related database records
 * 3. Clean up orphaned data
 * 
 * WARNING: This action cannot be undone!
 * Make sure you want to delete ALL products before running this script.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase environment variables');
  console.error('Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deleteAllProducts() {
  console.log('🚀 Starting product deletion process...\n');

  try {
    // Step 1: Get all products to see what we're deleting
    console.log('📋 Fetching all products...');
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, title, product_images(path)');

    if (fetchError) {
      throw new Error(`Failed to fetch products: ${fetchError.message}`);
    }

    console.log(`📦 Found ${products?.length || 0} products to delete\n`);

    if (!products || products.length === 0) {
      console.log('✅ No products found. Database is already clean!');
      return;
    }

    // Show products that will be deleted
    console.log('🗑️  Products to be deleted:');
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} (ID: ${product.id})`);
      if (product.product_images && product.product_images.length > 0) {
        console.log(`      Images: ${product.product_images.length} files`);
      }
    });
    console.log('');

    // Confirmation prompt
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const confirm = await new Promise((resolve) => {
      rl.question('⚠️  Are you sure you want to delete ALL products? This cannot be undone! (yes/no): ', (answer) => {
        rl.close();
        resolve(answer.toLowerCase());
      });
    });

    if (confirm !== 'yes' && confirm !== 'y') {
      console.log('❌ Operation cancelled.');
      return;
    }

    console.log('\n🧹 Starting cleanup process...\n');

    // Step 2: Delete product images from storage
    console.log('🖼️  Deleting product images from storage...');
    let deletedImagesCount = 0;

    for (const product of products) {
      if (product.product_images && product.product_images.length > 0) {
        const imagePaths = product.product_images.map(img => img.path);
        
        const { error: storageError } = await supabase.storage
          .from('product-images')
          .remove(imagePaths);

        if (storageError) {
          console.warn(`   ⚠️  Warning: Failed to delete some images for product "${product.title}": ${storageError.message}`);
        } else {
          deletedImagesCount += imagePaths.length;
          console.log(`   ✅ Deleted ${imagePaths.length} images for "${product.title}"`);
        }
      }
    }

    console.log(`📊 Total images deleted: ${deletedImagesCount}\n`);

    // Step 3: Delete database records (in correct order due to foreign key constraints)
    
    // Delete cart items first
    console.log('🛒 Deleting cart items...');
    const { error: cartItemsError } = await supabase
      .from('cart_items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (cartItemsError) {
      console.warn(`   ⚠️  Warning: ${cartItemsError.message}`);
    } else {
      console.log('   ✅ Cart items deleted');
    }

    // Delete order items
    console.log('📋 Deleting order items...');
    const { error: orderItemsError } = await supabase
      .from('order_items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (orderItemsError) {
      console.warn(`   ⚠️  Warning: ${orderItemsError.message}`);
    } else {
      console.log('   ✅ Order items deleted');
    }

    // Delete product images records
    console.log('🖼️  Deleting product image records...');
    const { error: imageRecordsError } = await supabase
      .from('product_images')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (imageRecordsError) {
      console.warn(`   ⚠️  Warning: ${imageRecordsError.message}`);
    } else {
      console.log('   ✅ Product image records deleted');
    }

    // Delete product variants
    console.log('📐 Deleting product variants...');
    const { error: variantsError } = await supabase
      .from('product_variants')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (variantsError) {
      console.warn(`   ⚠️  Warning: ${variantsError.message}`);
    } else {
      console.log('   ✅ Product variants deleted');
    }

    // Finally, delete products
    console.log('🎯 Deleting products...');
    const { error: productsError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (productsError) {
      throw new Error(`Failed to delete products: ${productsError.message}`);
    } else {
      console.log('   ✅ Products deleted');
    }

    // Step 4: Verify cleanup
    console.log('\n🔍 Verifying cleanup...');
    const { data: remainingProducts, error: verifyError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (verifyError) {
      console.warn(`   ⚠️  Warning: Could not verify cleanup: ${verifyError.message}`);
    } else if (remainingProducts && remainingProducts.length === 0) {
      console.log('   ✅ Cleanup verified - no products remain');
    } else {
      console.warn('   ⚠️  Warning: Some products may still exist');
    }

    console.log('\n🎉 Product deletion completed successfully!');
    console.log('📝 Summary:');
    console.log(`   • Products deleted: ${products.length}`);
    console.log(`   • Images deleted: ${deletedImagesCount}`);
    console.log('   • Related data cleaned up');
    console.log('\n✨ Your database is now ready for new products!');

  } catch (error) {
    console.error('\n❌ Error during deletion process:');
    console.error(error.message);
    console.error('\n💡 Tips:');
    console.error('   • Make sure your SUPABASE_SERVICE_ROLE_KEY has admin permissions');
    console.error('   • Check that your .env.local file has the correct environment variables');
    console.error('   • Ensure your internet connection is stable');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  deleteAllProducts()
    .then(() => {
      console.log('\n👋 Script completed. You can now upload your real products!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { deleteAllProducts };

