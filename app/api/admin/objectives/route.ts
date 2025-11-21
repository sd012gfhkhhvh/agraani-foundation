import { requireRole } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const objectives = await prisma.objective.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(objectives);
  } catch (error) {
    console.error('Error fetching objectives:', error);
    return NextResponse.json({ error: 'Failed to fetch objectives' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole([UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN, UserRole.EDITOR]);

    const data = await request.json();
    const objective = await prisma.objective.create({
      data: {
        title: data.title,
        description: data.description,
        order: data.order || 0,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json(objective, { status: 201 });
  } catch (error: any) {
    console.error('Error creating objective:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create objective' },
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

    const objective = await prisma.objective.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(objective);
  } catch (error: any) {
    console.error('Error updating objective:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update objective' },
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
      return NextResponse.json({ error: 'Objective ID required' }, { status: 400 });
    }

    await prisma.objective.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting objective:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete objective' },
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
