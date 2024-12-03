import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import { NextApiRequest, NextApiResponse } from 'next';
import { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SCOPES, HOST } from '../../../config/shopify';

const shopify = shopifyApi({
  apiKey: SHOPIFY_API_KEY,
  apiSecretKey: SHOPIFY_API_SECRET,
  scopes: SCOPES,
  hostName: HOST.replace(/https:\/\//, ''),
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const callbackResponse = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    // Store the session in your database here
    // You may want to use the callbackResponse.session object

    const { shop, host } = req.query;

    // Redirect to app with shop parameter
    res.redirect(`/?shop=${shop}&host=${host}`);
  } catch (error) {
    console.error('Error during auth callback:', error);
    res.status(500).send('Error during auth callback');
  }
}