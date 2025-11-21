'use server';

import { requirePermission } from '@/lib/auth-utils';
import { formatApiError, logError } from '@/lib/errors';
import { Action, Resource } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getHeroBanners() {
  try {
    const banners = await prisma.heroBanner.findMany({
      orderBy: { order: 'asc' },
    });
    return { success: true, data: banners };
  } catch (error) {
    logError(error, { action: 'getHeroBanners' });
    return { success: false, error: formatApiError(error) };
  }
}

export async function createHeroBanner(data: {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  order?: number;
  isActive?: boolean;
}) {
  try {
    await requirePermission(Resource.HERO_BANNERS, Action.CREATE);
    const banner = await prisma.heroBanner.create({ data });
    revalidatePath('/admin/hero-banners');
    revalidatePath('/');
    return { success: true, data: banner };
  } catch (error) {
    logError(error, { action: 'createHeroBanner', data });
    return { success: false, error: formatApiError(error) };
  }
}

export async function updateHeroBanner(
  id: string,
  data: Partial<{
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    order: number;
    isActive: boolean;
  }>
) {
  try {
    await requirePermission(Resource.HERO_BANNERS, Action.UPDATE);
    const banner = await prisma.heroBanner.update({ where: { id }, data });
    revalidatePath('/admin/hero-banners');
    revalidatePath('/');
    return { success: true, data: banner };
  } catch (error) {
    logError(error, { action: 'updateHeroBanner', id, data });
    return { success: false, error: formatApiError(error) };
  }
}

export async function deleteHeroBanner(id: string) {
  try {
    await requirePermission(Resource.HERO_BANNERS, Action.DELETE);
    const banner = await prisma.heroBanner.delete({ where: { id } });
    revalidatePath('/admin/hero-banners');
    revalidatePath('/');
    return { success: true, data: banner };
  } catch (error) {
    logError(error, { action: 'deleteHeroBanner', id });
    return { success: false, error: formatApiError(error) };
  }
}
