'use client'

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Install() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const shop = searchParams.get('shop');
    if (shop) {
      router.push(`/api/auth?shop=${shop}`);
    }
  }, [router, searchParams]);

  return <p>Preparing to install...</p>;
}

