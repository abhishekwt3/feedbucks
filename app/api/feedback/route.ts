import { NextRequest, NextResponse } from 'next/server';
import Shopify from '@shopify/shopify-api';
import prisma from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await Shopify.Utils.loadCurrentSession(request, new NextResponse());
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const pageSize = parseInt(request.nextUrl.searchParams.get('pageSize') || '10');
    const skip = (page - 1) * pageSize;

    const feedbacks = await prisma.feedback.findMany({
      where: { shopId: session.shop },
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, feedbacks });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await Shopify.Utils.loadCurrentSession(request, new NextResponse());
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { message, email, rating } = await request.json();

    const feedback = await prisma.feedback.create({
      data: {
        message,
        email: email || undefined,
        rating: parseInt(rating),
        shopId: session.shop,
      },
    });

    return NextResponse.json({ success: true, feedback }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

