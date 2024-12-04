import { NextApiRequest, NextApiResponse } from 'next';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SCOPES, HOST } from '../../config/shopify';
import { CustomSessionStorage } from '../../lib/sessionStorage';

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
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  if (!sessionId) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const session = await sessionStorage.loadSession(sessionId);
  if (!session) {
    return res.status(401).json({ success: false, error: 'Invalid session' });
  }

  res.status(200).json({ shop: session.shop });
}

