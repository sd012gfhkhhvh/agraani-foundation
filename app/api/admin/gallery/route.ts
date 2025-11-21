import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { UserRole } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const gallery = await prisma.galleryItem.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole([UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN, UserRole.EDITOR]);

    const data = await request.json();
    const galleryItem = await prisma.galleryItem.create({
      data,
    });

    return NextResponse.json(galleryItem, { status: 201 });
  } catch (error: any) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create gallery item' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden: Insufficient permissions' ? 403 : 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireRole([UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN, UserRole.EDITOR]);

    const data = await request.json();
    const { id, ...updateData } = data;

    const galleryItem = await prisma.galleryItem.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(galleryItem);
  } catch (error: any) {
    console.error('Error updating gallery item:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update gallery item' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden: Insufficient permissions' ? 403 : 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireRole([UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN]);

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Gallery item ID required' }, { status: 400 });
    }

    await prisma.galleryItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete gallery item' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden: Insufficient permissions' ? 403 : 500 }
    );
  }
}
