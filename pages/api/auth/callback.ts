import { NextApiRequest, NextApiResponse } from 'next';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SCOPES, HOST } from '../../../config/shopify';
import { CustomSessionStorage } from '../../../lib/sessionStorage';

const sessionStorage = new CustomSessionStorage();

const shopify = shopifyApi({
  apiKey: SHOPIFY_API_KEY,
  apiSecretKey: SHOPIFY_API_SECRET,
  scopes: SCOPES,
  hostName: HOST.replace(/https:\/\//, ''),
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  sessionStorage,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const callbackResponse = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    // Store the session
    await sessionStorage.storeSession(callbackResponse.session);

    // Get the shop and host from the query parameters
    const { shop, host } = req.query;
    
    // Construct the redirect URL using the full app URL
    const redirectUrl = `${HOST}/?shop=${shop}&host=${host}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error during auth callback:', error);
    res.status(500).send('Error during auth callback');
  }
}

