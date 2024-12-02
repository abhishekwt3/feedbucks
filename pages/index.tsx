import React from 'react';
import { AppProvider } from '@shopify/polaris';
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
      <AppProvider i18n={{}}>
        <FeedbackDashboard />
      </AppProvider>
    </Provider>
  );
}

export default Index;

