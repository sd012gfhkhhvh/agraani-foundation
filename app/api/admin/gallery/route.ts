import { getAllGalleryItems } from '@/lib/data';
import { logError } from '@/lib/logger';
import type { ApiResponse } from '@/types/api';
import type { GalleryItem } from '@/types/models';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<ApiResponse<GalleryItem[]>>> {
  try {
    const items = await getAllGalleryItems();

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    logError(error, { action: 'GET /api/admin/gallery' });

    return NextResponse.json(
      {
        success: false,
        error: { message: 'Failed to fetch gallery items' },
      },
      { status: 500 }
    );
  }
}
