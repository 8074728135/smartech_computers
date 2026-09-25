'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OwnerPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin');
  }, [router]);

  return (
    <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
      <h2>Loading Shop Owner Portal...</h2>
      <p style={{ color: 'var(--gray-500)', marginTop: '8px' }}>
        Redirecting to Smartech Computers Management Console
      </p>
    </div>
  );
}
