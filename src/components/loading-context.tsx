"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface LoadingContextType {
  isLoading: boolean;
  loadingText: string;
  setLoading: (loading: boolean, text?: string) => void;
  showImageLoader: boolean;
  setImageLoader: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");
  const [showImageLoader, setShowImageLoader] = useState(false);

  const setLoading = (loading: boolean, text: string = "Loading...") => {
    setIsLoading(loading);
    setLoadingText(text);
  };

  const setImageLoader = (loading: boolean) => {
    setShowImageLoader(loading);
  };

  return (
    <LoadingContext.Provider value={{
      isLoading,
      loadingText,
      setLoading,
      showImageLoader,
      setImageLoader
    }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
