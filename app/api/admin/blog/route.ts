import { getAllBlogPosts } from '@/lib/data';
import { logError } from '@/lib/logger';
import type { ApiResponse } from '@/types/api';
import type { BlogPost } from '@/types/models';
import { NextResponse } from 'next/server';

/**
 * GET /api/admin/blog
 * Fetch all blog posts for admin (including unpublished)
 */
export async function GET(): Promise<NextResponse<ApiResponse<BlogPost[]>>> {
  try {
    const posts = await getAllBlogPosts();

    return NextResponse.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    logError(error, { action: 'GET /api/admin/blog' });

    return NextResponse.json(
      {
        success: false,
        error: { message: 'Failed to fetch blog posts' },
      },
      { status: 500 }
    );
  }
}
