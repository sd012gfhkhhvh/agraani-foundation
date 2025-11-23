import { getAllObjectives } from '@/lib/data';
import { logError } from '@/lib/logger';
import type { ApiResponse } from '@/types/api';
import type { Objective } from '@/types/models';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<ApiResponse<Objective[]>>> {
  try {
    const objectives = await getAllObjectives();

    return NextResponse.json({
      success: true,
      data: objectives,
    });
  } catch (error) {
    logError(error, { action: 'GET /api/admin/objectives' });

    return NextResponse.json(
      {
        success: false,
        error: { message: 'Failed to fetch objectives' },
      },
      { status: 500 }
    );
  }
}
