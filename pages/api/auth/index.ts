import { NextApiRequest, NextApiResponse } from 'next';
import Shopify from '@shopify/shopify-api';
import { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SCOPES, HOST } from '../../../config/shopify';

Shopify.Context.initialize({
  API_KEY: SHOPIFY_API_KEY,
  API_SECRET_KEY: SHOPIFY_API_SECRET,
  SCOPES: SCOPES,
  HOST_NAME: HOST.replace(/https:\/\//, ''),
  IS_EMBEDDED_APP: true,
  API_VERSION: '2023-07'
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query.shop) {
    res.status(500);
    return res.send("No shop provided");
  }

  const shop = Shopify.Utils.sanitizeShop(req.query.shop as string);
  if (!shop) {
    res.status(500);
    return res.send("Invalid shop provided");
  }

  const authRoute = await Shopify.Auth.beginAuth(
    req,
    res,
    shop,
    '/api/auth/callback',
    false,
  );

  res.redirect(authRoute);
}

