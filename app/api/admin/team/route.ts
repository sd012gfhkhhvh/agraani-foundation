import { getAllTeamMembers } from '@/lib/data';
import { logError } from '@/lib/logger';
import type { ApiResponse } from '@/types/api';
import type { TeamMember } from '@/types/models';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<ApiResponse<TeamMember[]>>> {
  try {
    const members = await getAllTeamMembers();

    return NextResponse.json({
      success: true,
      data: members,
    });
  } catch (error) {
    logError(error, { action: 'GET /api/admin/team' });

    return NextResponse.json(
      {
        success: false,
        error: { message: 'Failed to fetch team members' },
      },
      { status: 500 }
    );
  }
}
