'use server';

import { requirePermission } from '@/lib/auth-utils';
import { formatApiError, NotFoundError } from '@/lib/errors';
import { logError } from '@/lib/logger';
import { Action, Resource } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import {
  createHeroBannerSchema,
  updateHeroBannerSchema,
  type CreateHeroBannerInput,
  type UpdateHeroBannerInput,
} from '@/lib/validations/hero-banners';
import type { ApiResponse } from '@/types/api';
import type { HeroBanner } from '@/types/models';
import { revalidatePath } from 'next/cache';

export async function createHeroBanner(
  input: CreateHeroBannerInput
): Promise<ApiResponse<HeroBanner>> {
  try {
    const validated = createHeroBannerSchema.parse(input);
    await requirePermission(Resource.HERO_BANNERS, Action.CREATE);

    const banner = await prisma.heroBanner.create({
      data: validated,
    });

    revalidatePath('/admin/hero-banners');
    revalidatePath('/');

    return { success: true, data: banner };
  } catch (error) {
    logError(error, { action: 'createHeroBanner', input });
    return { success: false, error: formatApiError(error) };
  }
}

export async function updateHeroBanner(
  id: string,
  input: UpdateHeroBannerInput
): Promise<ApiResponse<HeroBanner>> {
  try {
    const validated = updateHeroBannerSchema.parse(input);
    await requirePermission(Resource.HERO_BANNERS, Action.UPDATE);

    const existing = await prisma.heroBanner.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Hero banner');

    const banner = await prisma.heroBanner.update({
      where: { id },
      data: validated,
    });

    revalidatePath('/admin/hero-banners');
    revalidatePath('/');

    return { success: true, data: banner };
  } catch (error) {
    logError(error, { action: 'updateHeroBanner', id, input });
    return { success: false, error: formatApiError(error) };
  }
}

export async function deleteHeroBanner(id: string): Promise<ApiResponse<void>> {
  try {
    await requirePermission(Resource.HERO_BANNERS, Action.DELETE);

    const banner = await prisma.heroBanner.findUnique({ where: { id } });
    if (!banner) throw new NotFoundError('Hero banner');

    await prisma.heroBanner.delete({
      where: { id },
    });

    revalidatePath('/admin/hero-banners');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    logError(error, { action: 'deleteHeroBanner', id });
    return { success: false, error: formatApiError(error) };
  }
}
