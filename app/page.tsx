'use client'

import React from 'react';
import { Provider } from '@shopify/app-bridge-react';
import { useSearchParams } from 'next/navigation';
import FeedbackDashboard from '../components/FeedbackDashboard';

export default function Home() {
  const searchParams = useSearchParams();
  const shop = searchParams.get('shop');
  const host = searchParams.get('host');

  const config = {
    apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY!,
    host: host as string,
    forceRedirect: true
  };

  return (
    <Provider config={config}>
      <FeedbackDashboard />
    </Provider>
  );
}

