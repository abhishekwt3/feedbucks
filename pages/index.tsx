import React from 'react';
import { Provider } from '@shopify/app-bridge-react';
import { useRouter } from 'next/router';
import FeedbackDashboard from '../components/FeedbackDashboard';

function Index() {
  const router = useRouter();
  const { shop, host } = router.query;

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

export default Index;

