import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { UserRole } from '@prisma/client';

export async function GET() {
  try {
    await requireRole([UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN, UserRole.EDITOR]);

    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(submissions);
  } catch (error: any) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch submissions' },
      { status: error.message?.includes('Unauthorized') ? 401 : error.message?.includes('Forbidden') ? 403 : 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireRole([UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN, UserRole.EDITOR]);

    const data = await request.json();
    const { id, isRead } = data;

    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: { isRead },
    });

    return NextResponse.json(submission);
  } catch (error: any) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update submission' },
      { status: error.message?.includes('Unauthorized') ? 401 : error.message?.includes('Forbidden') ? 403 : 500 }
    );
  }
}
