'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedContent({ children }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Don't render children until authentication check is complete
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl">Authentication required</h2>
          <p>Please log in to view this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}