'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function TasqLogo() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Link href="/">
      <h1
        className={`
          md:text-4xl text-3xl font-bold font-kaushan text-foreground 
          transition-all duration-700 ease-out
          ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          hover:scale-105 cursor-pointer
        `}
      >
        Tas
        <span className="bg-linear-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent animate-pulse-slow">
          q
        </span>
      </h1>
    </Link>
  );
}
