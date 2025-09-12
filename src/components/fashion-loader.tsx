"use client";

import { useState, useEffect } from "react";

interface FashionLoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  showText?: boolean;
  className?: string;
}

export function FashionLoader({ 
  size = "md", 
  text = "Loading...", 
  showText = true,
  className = ""
}: FashionLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16", 
    lg: "w-20 h-20"
  };

  const emojiSizeClasses = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* Jean Emoji Loader Container */}
      <div className="relative">
        {/* Rotating Light Ring */}
        <div className={`${sizeClasses[size]} rounded-full relative`}>
          {/* Illuminated Light Effect */}
          <div className="absolute inset-0 rounded-full">
            <div className="absolute inset-0 rounded-full jean-light-rotate" 
                 style={{ 
                   background: 'conic-gradient(from 0deg, transparent, #fbbf24, #f59e0b, #d97706, transparent)',
                 }}>
            </div>
            
            {/* Inner Glow Ring */}
            <div className="absolute inset-1 rounded-full jean-glow-pulse" 
                 style={{ 
                   background: 'conic-gradient(from 0deg, rgba(59, 130, 246, 0.2), rgba(251, 191, 36, 0.3), rgba(59, 130, 246, 0.2))',
                   animationDirection: 'reverse'
                 }}>
            </div>
            
            {/* Outer Glow Ring */}
            <div className="absolute inset-0 rounded-full jean-glow-pulse" 
                 style={{ 
                   background: 'conic-gradient(from 0deg, rgba(59, 130, 246, 0.1), rgba(251, 191, 36, 0.2), rgba(59, 130, 246, 0.1))',
                   animationDelay: '1s'
                 }}>
            </div>
          </div>
          
          {/* Jean Emoji */}
          <div className={`absolute inset-0 flex items-center justify-center ${emojiSizeClasses[size]} jean-emoji-bounce`}>
            👖
          </div>
        </div>
      </div>

      {/* Fashion Dots Animation */}
      <div className="flex space-x-1">
        <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
        <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
        <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
      </div>

      {/* Loading Text */}
      {showText && (
        <div className={`text-gray-600 font-medium ${textSizeClasses[size]} animate-pulse`}>
          {text}
        </div>
      )}
    </div>
  );
}

// Full Page Loader
export function FullPageLoader({ text = "Loading your style..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <FashionLoader size="lg" text={text} />
        
        {/* Fashion Brand Touch */}
        <div className="mt-8 space-y-3">
          <div className="text-xs text-gray-400 tracking-widest font-light">
            NUBIADENIMBYAG
          </div>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent mx-auto"></div>
          <div className="text-xs text-gray-500">
            Crafting your perfect fit
          </div>
        </div>
      </div>
    </div>
  );
}

// Image Loader Overlay
export function ImageLoader({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-gray-100 bg-opacity-80 backdrop-blur-sm flex items-center justify-center rounded-lg">
      <FashionLoader size="sm" text="" showText={false} />
    </div>
  );
}

// Button Loader
export function ButtonLoader({ isLoading, children, ...props }: { 
  isLoading: boolean; 
  children: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <button {...props} disabled={isLoading}>
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <FashionLoader size="sm" text="" showText={false} />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

// Product Grid Loader
export function ProductGridLoader({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton Loader for Product Cards
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 aspect-square rounded-lg mb-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <FashionLoader size="sm" text="" showText={false} />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );
}
