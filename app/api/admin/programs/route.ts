import { getAllPrograms } from '@/lib/data';
import { logError } from '@/lib/logger';
import type { ApiResponse } from '@/types/api';
import type { Program } from '@/types/models';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<ApiResponse<Program[]>>> {
  try {
    const programs = await getAllPrograms();

    return NextResponse.json({
      success: true,
      data: programs,
    });
  } catch (error) {
    logError(error, { action: 'GET /api/admin/programs' });

    return NextResponse.json(
      {
        success: false,
        error: { message: 'Failed to fetch programs' },
      },
      { status: 500 }
    );
  }
}
