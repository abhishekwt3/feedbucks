import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(request: NextRequest) {
  const shop = request.nextUrl.searchParams.get('shop');
  
  if (!shop) {
    return NextResponse.json({ error: "No shop provided" }, { status: 500 });
  }

  const sanitizedShop = Shopify.Utils.sanitizeShop(shop);
  if (!sanitizedShop) {
    return NextResponse.json({ error: "Invalid shop provided" }, { status: 500 });
  }

  const authRoute = await Shopify.Auth.beginAuth(
    request,
    new NextResponse(),
    sanitizedShop,
    '/api/auth/callback',
    false,
  );

  return NextResponse.redirect(authRoute);
}

