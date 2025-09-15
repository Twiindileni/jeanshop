"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ContactMessageDisplayProps {
  message: { type: 'success' | 'error'; text: string } | null;
}

export default function ContactMessageDisplay({ message }: ContactMessageDisplayProps) {
  const router = useRouter();

  useEffect(() => {
    if (message?.type === 'success') {
      // Clear URL parameters after 3 seconds for success messages
      const timer = setTimeout(() => {
        router.replace('/contact', { scroll: false });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [message, router]);

  if (!message) return null;

  return (
    <div className={`mb-6 p-4 rounded-lg ${
      message.type === 'success' 
        ? 'bg-green-100 border border-green-300 text-green-700' 
        : 'bg-red-100 border border-red-300 text-red-700'
    }`}>
      <div className="flex justify-between items-start">
        <span>{message.text}</span>
        <button
          onClick={() => router.replace('/contact', { scroll: false })}
          className="ml-2 text-sm opacity-70 hover:opacity-100"
        >
          ×
        </button>
      </div>
    </div>
  );
}
