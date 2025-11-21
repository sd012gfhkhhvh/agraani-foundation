import { requireRole } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const sections = await prisma.aboutContent.findMany();
    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching about content:', error);
    return NextResponse.json({ error: 'Failed to fetch about content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireRole([UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN, UserRole.EDITOR]);

    const data = await request.json();
    const { id, ...updateData } = data;

    const section = await prisma.aboutContent.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(section);
  } catch (error: any) {
    console.error('Error updating about content:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update about content' },
      {
        status: error.message?.includes('Unauthorized')
          ? 401
          : error.message?.includes('Forbidden')
            ? 403
            : 500,
      }
    );
  }
}
