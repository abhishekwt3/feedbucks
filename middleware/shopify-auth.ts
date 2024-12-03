import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import { NextApiRequest, NextApiResponse } from 'next';
import { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SCOPES, HOST } from '../config/shopify';

// Ensure critical environment variables are loaded
if (!SHOPIFY_API_KEY || !SHOPIFY_API_SECRET || !HOST) {
  throw new Error('Missing required Shopify environment variables.');
}

const shopify = shopifyApi({
  apiKey: SHOPIFY_API_KEY,
  apiSecretKey: SHOPIFY_API_SECRET,
  scopes: SCOPES,
  hostName: HOST.replace(/https:\/\//, ''),
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
});

export default async function shopifyAuth(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Validate the `shop` parameter
    const { shop } = req.query;
    if (!shop) {
      res.status(400).send("No shop provided");
      return;
    }

    const sanitizedShop = shopify.utils.sanitizeShop(shop as string);
    if (!sanitizedShop) {
      res.status(400).send("Invalid shop provided");
      return;
    }

    // Begin Shopify authentication
    const authRoute = await shopify.auth.begin({
      shop: sanitizedShop,
      callbackPath: '/api/auth/callback',
      isOnline: false,
      rawRequest: req,
      rawResponse: res,
    });

    res.redirect(authRoute);
  } catch (error) {
    console.error('Error during Shopify authentication:', error);
    res.status(500).send("An error occurred during Shopify authentication.");
  }
}
