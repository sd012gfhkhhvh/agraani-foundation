import { requireRole } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const teamMembers = await prisma.teamMember.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole([UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN, UserRole.EDITOR]);

    const data = await request.json();
    const teamMember = await prisma.teamMember.create({
      data,
    });

    return NextResponse.json(teamMember, { status: 201 });
  } catch (error: any) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create team member' },
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

    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(teamMember);
  } catch (error: any) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update team member' },
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
      return NextResponse.json({ error: 'Team member ID required' }, { status: 400 });
    }

    await prisma.teamMember.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete team member' },
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
