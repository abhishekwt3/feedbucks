import React, { useEffect } from 'react';
import { Provider } from '@shopify/app-bridge-react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import FeedbackDashboard from '../components/FeedbackDashboard';

function Index() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shop = searchParams.get('shop');
  const host = searchParams.get('host');

  useEffect(() => {
    if (!host && router.isReady) {
      const queryHost = router.query.host;
      if (queryHost) {
        router.replace({ query: { ...router.query, host: queryHost } });
      }
    }
  }, [host, router]);

  if (!shop || !host) {
    return <div>Loading...</div>;
  }

  const config = {
    apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY!,
    host: host,
    forceRedirect: true
  };

  return (
    <Provider config={config}>
      <FeedbackDashboard />
    </Provider>
  );
}

export default Index;

