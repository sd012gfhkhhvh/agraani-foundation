import { requireRole } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const banners = await prisma.heroBanner.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching hero banners:', error);
    return NextResponse.json({ error: 'Failed to fetch hero banners' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole([UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN, UserRole.EDITOR]);

    const data = await request.json();
    const banner = await prisma.heroBanner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        imageUrl: data.imageUrl,
        ctaText: data.ctaText,
        ctaLink: data.ctaLink,
        order: data.order || 0,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error: any) {
    console.error('Error creating hero banner:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create hero banner' },
      {
        status:
          error.message === 'Unauthorized'
            ? 401
            : error.message === 'Forbidden: Insufficient permissions'
              ? 403
              : 500,
      }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireRole([UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN, UserRole.EDITOR]);

    const data = await request.json();
    const { id, ...updateData } = data;

    const banner = await prisma.heroBanner.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(banner);
  } catch (error: any) {
    console.error('Error updating hero banner:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update hero banner' },
      {
        status:
          error.message === 'Unauthorized'
            ? 401
            : error.message === 'Forbidden: Insufficient permissions'
              ? 403
              : 500,
      }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireRole([UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN]);

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Banner ID required' }, { status: 400 });
    }

    await prisma.heroBanner.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting hero banner:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete hero banner' },
      {
        status:
          error.message === 'Unauthorized'
            ? 401
            : error.message === 'Forbidden: Insufficient permissions'
              ? 403
              : 500,
      }
    );
  }
}
