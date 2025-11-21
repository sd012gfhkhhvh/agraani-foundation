import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { UserRole } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const programs = await prisma.program.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole([UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN, UserRole.EDITOR]);

    const data = await request.json();
    const program = await prisma.program.create({
      data: {
        title: data.title,
        slug: data.slug || data.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
        description: data.description,
        imageUrl: data.imageUrl,
        icon: data.icon,
        order: data.order || 0,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json(program, { status: 201 });
  } catch (error: any) {
    console.error('Error creating program:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create program' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden: Insufficient permissions' ? 403 : 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireRole([UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN, UserRole.EDITOR]);

    const data = await request.json();
    const { id, ...updateData } = data;

    const program = await prisma.program.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(program);
  } catch (error: any) {
    console.error('Error updating program:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update program' },
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
      return NextResponse.json({ error: 'Program ID required' }, { status: 400 });
    }

    await prisma.program.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting program:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete program' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden: Insufficient permissions' ? 403 : 500 }
    );
  }
}
