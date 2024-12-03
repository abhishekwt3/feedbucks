import type { AppProps } from 'next/app';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import { useEffect } from 'react';
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Retrieve the host from the query parameters
  const host = router.query.host as string;

  // App Bridge configuration
  const appBridgeConfig = {
    apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY, // Set in your .env file
    host: host,
  };

  useEffect(() => {
    if (!host) {
      console.error('Host parameter is missing from URL');
    }
  }, [host]);

  return (
    <AppProvider i18n={{}}>
      {host ? (
        <AppBridgeProvider config={appBridgeConfig}>
          <Component {...pageProps} />
        </AppBridgeProvider>
      ) : (
        <div>Please provide a valid host parameter in the URL.</div>
      )}
    </AppProvider>
  );
}
