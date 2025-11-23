import { getAllHeroBanners } from '@/lib/data';
import { logError } from '@/lib/logger';
import type { ApiResponse } from '@/types/api';
import type { HeroBanner } from '@/types/models';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<ApiResponse<HeroBanner[]>>> {
  try {
    const banners = await getAllHeroBanners();

    return NextResponse.json({
      success: true,
      data: banners,
    });
  } catch (error) {
    logError(error, { action: 'GET /api/admin/hero-banners' });

    return NextResponse.json(
      {
        success: false,
        error: { message: 'Failed to fetch hero banners' },
      },
      { status: 500 }
    );
  }
}
