import { NextRequest, NextResponse } from 'next/server';
import Shopify from '@shopify/shopify-api';

export async function GET(request: NextRequest) {
  try {
    const session = await Shopify.Auth.validateAuthCallback(
      request,
      new NextResponse(),
      request.nextUrl.searchParams as unknown as Record<string, string | string[]>
    );

    // Store the session in your database here

    const host = request.nextUrl.searchParams.get('host');
    const shop = request.nextUrl.searchParams.get('shop');

    // Redirect to app with shop parameter
    return NextResponse.redirect(`/?shop=${shop}&host=${host}`);
  } catch (error) {
    console.error('Error during auth callback:', error);
    return NextResponse.json({ error: 'Error during auth callback' }, { status: 500 });
  }
}

