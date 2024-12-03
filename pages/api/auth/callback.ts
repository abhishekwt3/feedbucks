import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION, Session } from '@shopify/shopify-api';
import { NextApiRequest, NextApiResponse } from 'next';
import { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SCOPES, HOST } from '../../../config/shopify';
import { CustomSessionStorage } from '../../../lib/sessionStorage';

// Initialize Shopify with Custom Session Storage
const sessionStorage = new CustomSessionStorage();

const shopify = shopifyApi({
  apiKey: SHOPIFY_API_KEY,
  apiSecretKey: SHOPIFY_API_SECRET,
  scopes: SCOPES,
  hostName: HOST.replace(/https:\/\//, ''),
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  sessionStorage, // Use the custom session storage here
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Auth callback triggered');
    console.log('Incoming query:', req.query);

    // Handle Shopify authentication callback
    const callbackResponse = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    const { shop, host } = req.query;

    // Ensure required parameters are present
    if (!shop || !host) {
      console.error('Missing shop or host parameters in callback query:', req.query);
      return res.status(400).send('Missing shop or host parameters');
    }

    // Store session using custom session storage
    const session: Session = callbackResponse.session;
    const stored = await sessionStorage.storeSession(session);

    if (!stored) {
      console.error(`Failed to store session for shop ${session.shop}`);
      return res.status(500).send('Failed to store session');
    }

    console.log(`Session stored successfully for shop: ${session.shop}`);

    // Redirect to the app's main page
    res.redirect(`/?shop=${shop}&host=${host}`);
  } catch (error: any) {
    console.error('Error during auth callback:', error);

    // Handle different error types
    if (error.name === 'ShopifyAuthError') {
      console.error('Shopify Authentication Error:', error.message);
      res.status(401).send('Authentication failed');
    } else if (error.name === 'ShopifyHttpError') {
      console.error('Shopify HTTP Error:', error.message);
      res.status(502).send('HTTP request to Shopify failed');
    } else {
      console.error('Unexpected error:', error);
      res.status(500).send('An unexpected error occurred during authentication');
    }
  }
}
