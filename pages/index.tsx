import React, { useEffect, useState } from 'react';
import { Provider } from '@shopify/app-bridge-react';
import { useRouter } from 'next/router';
import FeedbackDashboard from '../components/FeedbackDashboard';

function Index() {
  const router = useRouter();
  const { shop, host } = router.query;
  const [isReady, setIsReady] = useState(false); // Track when the component is ready to render

  useEffect(() => {
    // Ensure the required query parameters (shop and host) are available before rendering
    if (shop && host) {
      setIsReady(true);
    }
  }, [shop, host]);

  // Ensure that both shop and host are available
  if (!isReady) {
    return <div>Loading...</div>; // Show loading state until the parameters are available
  }

  // Ensure type safety: host as string (since it's guaranteed to be present once isReady is true)
  const config = {
    apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY!,
    host: host as string,
    forceRedirect: true,
  };

  return (
    <Provider config={config}>
      <FeedbackDashboard />
    </Provider>
  );
}

export default Index;
