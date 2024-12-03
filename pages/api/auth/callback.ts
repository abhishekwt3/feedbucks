import { NextApiRequest, NextApiResponse } from 'next';
import {Shopify} from '@shopify/shopify-api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query as Record<string, string | string[]>
    );

    // Store the session in your database here

    const host = req.query.host;
    const shop = req.query.shop;

    // Redirect to app with shop parameter
    res.redirect(`/?shop=${shop}&host=${host}`);
  } catch (error) {
    console.error('Error during auth callback:', error);
    res.status(500).send('Error during auth callback');
  }
}

