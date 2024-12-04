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

  const client = new shopify.clients.Rest({ session });

  try {
    // Check if the script tag already exists
    const scriptTags = await client.get({
      path: 'script_tags',
      query: { src: `${HOST}/widget.js` },
    });

    if (scriptTags.body.script_tags.length === 0) {
      // If it doesn't exist, create it
      await client.post({
        path: 'script_tags',
        data: {
          script_tag: {
            event: 'onload',
            src: `${HOST}/widget.js`,
          },
        },
      });
      res.status(200).json({ success: true, message: 'Script tag created' });
    } else {
      res.status(200).json({ success: true, message: 'Script tag already exists' });
    }
  } catch (error) {
    console.error('Error managing script tag:', error);
    res.status(500).json({ success: false, error: 'Failed to manage script tag' });
  }
}