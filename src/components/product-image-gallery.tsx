"use client";

import { useState } from "react";
import { LoadingImage } from "./loading-image";
import { ImageModal } from "./image-modal";

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
    supabaseUrl
  });

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
              <LoadingImage
                src={url}
                alt={`${productTitle} - Thumbnail ${idx + 1}`}
                className="max-w-full max-h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Main Image */}
        <div className="relative">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full aspect-[3/4] lg:aspect-auto bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
          >
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              {mainImage ? (
                <LoadingImage
                  src={mainImage}
                  alt={productTitle}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">👖</div>
                  <div className="text-sm">No image available</div>
                </div>
              )}
            </div>
            
            {/* Zoom Icon Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-3">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </button>

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
                  <LoadingImage
                    src={url}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
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
