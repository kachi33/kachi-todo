'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full px-4 min-h-[60vh]">
      {/* 404 Number */}
      <div className="text-center mb-8">
        <h1 className="text-8xl md:text-9xl font-bold text-amber-700 mb-4">
          404
        </h1>
        <div className="h-1 w-32 bg-amber-700 mx-auto mb-6"></div>
      </div>

      {/* Message */}
      <div className="text-center max-w-md mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-muted-foreground text-lg mb-2">
          Looks like this task got lost somewhere...
        </p>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button variant="default" size="lg" className="">
            Go Back Home
          </Button>
        </Link>
        <Link href="/tasks">
          <Button variant="outline" size="lg" className="">
            View Tasks
          </Button>
        </Link>
      </div>

    </div>
  );
}
