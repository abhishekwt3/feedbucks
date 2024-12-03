import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SCOPES, HOST } from '../../config/shopify';

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
    const session = await shopify.session.getCurrentSession({
      rawRequest: req,
      rawResponse: res,
    });

    if (!session) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const skip = (page - 1) * pageSize;

      const feedbacks = await prisma.feedback.findMany({
        where: { shopId: session.shop },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({ success: true, feedbacks });
    } else if (req.method === 'POST') {
      const { message, email, rating } = req.body;

      const feedback = await prisma.feedback.create({
        data: {
          message,
          email: email || undefined,
          rating: parseInt(rating),
          shopId: session.shop,
        },
      });

      res.status(201).json({ success: true, feedback });
    } else {
      res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

