import React, { useEffect } from 'react';
import { Provider } from '@shopify/app-bridge-react';
import { useRouter } from 'next/router';
import FeedbackDashboard from '../components/FeedbackDashboard';

function Index() {
  const router = useRouter();
  const { shop, host } = router.query;

  // Check if the required parameters are available
  useEffect(() => {
    if (!host || !shop) {
      console.warn('Missing shop or host query parameters. Redirecting...');
      // Redirect to an authentication endpoint if parameters are missing
      window.location.href = `/auth?shop=${shop || ''}`;
    }
  }, [host, shop]);

  // App Bridge configuration
  const config = {
    apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY!,
    host: host as string,
    forceRedirect: true,
  };

  // Render the dashboard only if the host parameter is present
  return host ? (
    <Provider config={config}>
      <FeedbackDashboard />
    </Provider>
  ) : (
    <div>Loading...</div>
  );
}

export default Index;
