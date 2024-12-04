import React, { useEffect, useState } from 'react';
import { Provider } from '@shopify/app-bridge-react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { authenticatedFetch } from '@shopify/app-bridge-utils';
import { Redirect } from '@shopify/app-bridge/actions';
import { AppProvider } from '@shopify/polaris';
import FeedbackDashboard from '../components/FeedbackDashboard';

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

        // Call the script-tag API to ensure the widget is injected
        await authenticatedFetch(app)(
          '/api/script-tag',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );
      }
    };

    getSessionToken();
  }, []);

  if (!accessToken) {
    return <div>Authenticating...</div>;
  }

  return <FeedbackDashboard />;
}

export default Index;

