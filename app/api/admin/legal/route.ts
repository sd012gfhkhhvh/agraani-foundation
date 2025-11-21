import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { UserRole } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const documents = await prisma.legalDocument.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching legal documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch legal documents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole([UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN, UserRole.EDITOR]);

    const data = await request.json();
    const document = await prisma.legalDocument.create({
      data,
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error: any) {
    console.error('Error creating legal document:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create legal document' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden: Insufficient permissions' ? 403 : 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireRole([UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN, UserRole.EDITOR]);

    const data = await request.json();
    const { id, ...updateData } = data;

    const document = await prisma.legalDocument.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(document);
  } catch (error: any) {
    console.error('Error updating legal document:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update legal document' },
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
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    await prisma.legalDocument.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting legal document:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete legal document' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden: Insufficient permissions' ? 403 : 500 }
    );
  }
}
