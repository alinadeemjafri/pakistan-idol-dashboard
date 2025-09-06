'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
        });
        
        if (response.ok) {
          // Redirect to login page after successful logout
          router.push('/login');
        } else {
          console.error('Logout failed');
          // Still redirect to login page even if logout fails
          router.push('/login');
        }
      } catch (error) {
        console.error('Logout error:', error);
        // Still redirect to login page even if there's an error
        router.push('/login');
      }
    };

    logout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-slate-600">Logging out...</p>
      </div>
    </div>
  );
}
