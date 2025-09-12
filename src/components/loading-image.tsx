"use client";

import { useState, useEffect, useRef } from "react";
import { ImageLoader } from "./fashion-loader";

interface LoadingImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function LoadingImage({ 
  src, 
  alt, 
  className = "", 
  onLoad, 
  onError 
}: LoadingImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Ensure component is mounted before showing loading state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset loading state when src changes
  useEffect(() => {
    if (isMounted) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [src, isMounted]);

  // Check if image is already loaded when component mounts
  useEffect(() => {
    if (isMounted && imgRef.current) {
      if (imgRef.current.complete && imgRef.current.naturalHeight !== 0) {
        // Image is already loaded
        setIsLoading(false);
        setHasError(false);
      }
    }
  }, [isMounted]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Always render the same structure to prevent hydration mismatch
  return (
    <div className={`relative ${className}`}>
      {/* Show loader while loading - only after mount */}
      {isMounted && isLoading && <ImageLoader isVisible={isLoading} />}
      
      {/* Show error state */}
      {hasError ? (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-2 jean-emoji-bounce">👖</div>
            <div className="text-sm">Image not available</div>
          </div>
        </div>
      ) : (
        /* Always render image - loading state handled by opacity */
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{
            opacity: isMounted && isLoading ? 0 : 1
          }}
        />
      )}
    </div>
  );
}
