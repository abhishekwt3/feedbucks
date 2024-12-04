import { NextApiRequest, NextApiResponse } from 'next';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SCOPES, HOST, EMBEDDED } from '../../../config/shopify';

const shopify = shopifyApi({
  apiKey: SHOPIFY_API_KEY,
  apiSecretKey: SHOPIFY_API_SECRET,
  scopes: SCOPES,
  hostName: HOST.replace(/https:\/\//, ''),
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: EMBEDDED,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { sessionToken } = req.body;

  try {
    const session = await shopify.auth.validateSessionToken(sessionToken);
    res.status(200).json({ accessToken: session.accessToken });
  } catch (error) {
    console.error('Error exchanging session token:', error);
    res.status(401).json({ error: 'Invalid session token' });
  }
}

