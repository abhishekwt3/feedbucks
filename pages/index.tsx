import React, { useEffect, useState } from 'react';
import { Provider, useAppBridge } from '@shopify/app-bridge-react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { Redirect } from '@shopify/app-bridge/actions';
import { AppProvider } from '@shopify/polaris';
import { authenticatedFetch, getSessionToken } from '@shopify/app-bridge-utils';
import FeedbackDashboard from '../components/FeedbackDashboard';
import { ClientApplication } from '@shopify/app-bridge';

declare global {
  interface Window {
    initializeFeedbackWidget: (shop: string, apiKey: string) => void;
  }
}

function Index() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [appBridgeConfig, setAppBridgeConfig] = useState<any>(null);

  useEffect(() => {
    const shop = searchParams.get('shop');
    const host = searchParams.get('host');

    if (shop && host) {
      const config = {
        apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY!,
        host: host,
        forceRedirect: true
      };
      setAppBridgeConfig(config);
    }
  }, [searchParams]);

  if (!appBridgeConfig) {
    return <div>Loading...</div>;
  }

  return (
    <Provider config={appBridgeConfig}>
      <AppProvider i18n={{}}>
        <EmbeddedApp />
      </AppProvider>
    </Provider>
  );
}

function EmbeddedApp() {
  const app = useAppBridge();
  const [accessToken, setAccessToken] = useState('');
  const [shop, setShop] = useState('');

  useEffect(() => {
    const fetchSessionToken = async () => {
      const sessionToken = await getSessionToken(app);
      const response = await authenticatedFetch(app)('/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionToken }),
      });
      const { accessToken } = await response.json();
      setAccessToken(accessToken);

      // Get the shop
      const shopResponse = await authenticatedFetch(app)('/api/shop');
      const { shop } = await shopResponse.json();
      setShop(shop);

      // Inject the widget script
      const script = document.createElement('script');
      script.src = `${process.env.NEXT_PUBLIC_HOST}/widget.js`;
      script.onload = () => {
        if (window.initializeFeedbackWidget) {
          window.initializeFeedbackWidget(shop, process.env.NEXT_PUBLIC_SHOPIFY_API_KEY!);
        } else {
          console.error('Feedback widget initialization function not found');
        }
      };
      document.body.appendChild(script);
    };

    fetchSessionToken();
  }, [app]);

  if (!accessToken) {
    console.log("Token not found !")
  }

  return <FeedbackDashboard />;
}

export default Index;

