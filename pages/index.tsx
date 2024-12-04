import React, { useEffect, useState } from 'react';
import { Provider } from '@shopify/app-bridge-react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { authenticatedFetch } from '@shopify/app-bridge-utils';
import { Redirect } from '@shopify/app-bridge/actions';
import { AppProvider } from '@shopify/polaris';
import FeedbackDashboard from '../components/FeedbackDashboard';
import Script from 'next/script';

function Index() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [appBridgeConfig, setAppBridgeConfig] = useState(null);

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
  const [accessToken, setAccessToken] = useState('');
  const [shop, setShop] = useState('');

  useEffect(() => {
    const getSessionToken = async () => {
      const app = window['app'];
      if (app) {
        const sessionToken = await app.getSessionToken();
        const response = await authenticatedFetch(app)(
          '/api/auth/token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionToken }),
          }
        );
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
          window.initializeFeedbackWidget(shop, process.env.NEXT_PUBLIC_SHOPIFY_API_KEY);
        };
        document.body.appendChild(script);
      }
    };

    getSessionToken();
  }, []);

  // if (!accessToken) {
  //   return <div>Authenticating...</div>;
  // }

  return (
    <>
      <FeedbackDashboard />
      <Script
        id="shopify-app-bridge"
        src="https://unpkg.com/@shopify/app-bridge@3"
      />
    </>
  );
}

export default Index;

