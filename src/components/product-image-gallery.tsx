"use client";

import { useState } from "react";
import { LoadingImage } from "./loading-image";
import { ImageModal } from "./image-modal";
import { SimpleImage } from "./simple-image";

interface ProductImageGalleryProps {
  images: Array<{ path: string; is_primary: boolean }>;
  productTitle: string;
  supabaseUrl: string;
}

export function ProductImageGallery({ images, productTitle, supabaseUrl }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sort images with primary first
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return 0;
  });

  const imageUrls = sortedImages.map(img => 
    `${supabaseUrl}/storage/v1/object/public/product-images/${img.path}`
  );

  const mainImage = imageUrls[selectedIndex] || imageUrls[0];

  // Debug logging
  console.log('Product Image Gallery Debug:', {
    images: sortedImages,
    imageUrls,
    mainImage,
    selectedIndex,
    supabaseUrl,
    hasImages: images.length > 0,
    firstImagePath: images[0]?.path,
    constructedUrl: images[0] ? `${supabaseUrl}/storage/v1/object/public/product-images/${images[0].path}` : 'No first image'
  });

  // Don't render if no images
  if (images.length === 0) {
    return (
      <div className="w-full aspect-[3/4] lg:aspect-auto bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">👖</div>
          <div className="text-lg">No images available</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr] gap-4">
        {/* Thumbnails - Desktop */}
        <div className="hidden lg:grid gap-3 content-start">
          {imageUrls.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`aspect-square border-2 rounded-lg overflow-hidden bg-white grid place-items-center transition-all hover:scale-105 ${
                idx === selectedIndex 
                  ? 'border-[#B88972] ring-2 ring-[#B88972] ring-opacity-30' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={url}
                alt={`${productTitle} - Thumbnail ${idx + 1}`}
                className="max-w-full max-h-full object-cover"
                onLoad={() => console.log("Thumbnail loaded:", url)}
                onError={(e) => console.error("Thumbnail failed to load:", url, e)}
              />
            </button>
          ))}
        </div>

        {/* Main Image */}
        <div className="relative">
          <div className="w-full aspect-[3/4] lg:aspect-auto">
            {mainImage ? (
              <SimpleImage
                src={mainImage}
                alt={productTitle}
                onClick={() => setIsModalOpen(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">👖</div>
                  <div className="text-sm">No image available</div>
                  <div className="text-xs mt-1 text-gray-300">Debug: {supabaseUrl ? 'URL set' : 'URL missing'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Thumbnails */}
          {imageUrls.length > 1 && (
            <div className="lg:hidden mt-4 flex gap-2 overflow-x-auto pb-2">
              {imageUrls.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`flex-shrink-0 w-16 h-16 border-2 rounded-lg overflow-hidden bg-white transition-all ${
                    idx === selectedIndex 
                      ? 'border-[#B88972] ring-2 ring-[#B88972] ring-opacity-30' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={url}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onLoad={() => console.log("Mobile thumbnail loaded:", url)}
                    onError={(e) => console.error("Mobile thumbnail failed to load:", url, e)}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Image Counter */}
          {imageUrls.length > 1 && (
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
              {selectedIndex + 1} / {imageUrls.length}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={imageUrls}
        currentIndex={selectedIndex}
        onIndexChange={setSelectedIndex}
        productTitle={productTitle}
      />
    </>
  );
}
