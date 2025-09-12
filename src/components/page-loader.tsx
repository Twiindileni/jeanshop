"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FullPageLoader } from "./fashion-loader";

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // Simulate loading time for route changes
    handleStart();
    const timer = setTimeout(() => {
      handleComplete();
    }, 800); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;

  return <FullPageLoader text="Loading your style..." />;
}

// Hook for manual loading control
export function usePageLoader() {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = (text?: string) => {
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  return {
    isLoading,
    startLoading,
    stopLoading,
    PageLoader: () => isLoading ? <FullPageLoader text="Loading..." /> : null
  };
}
