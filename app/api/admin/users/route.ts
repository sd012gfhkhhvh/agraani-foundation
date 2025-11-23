import { getAllUsers } from '@/lib/data/users';
import { logError } from '@/lib/logger';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types/models';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<ApiResponse<User[]>>> {
  try {
    const users = await getAllUsers();

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    logError(error, { action: 'GET /api/admin/users' });

    return NextResponse.json(
      {
        success: false,
        error: { message: 'Failed to fetch users' },
      },
      { status: 500 }
    );
  }
}
