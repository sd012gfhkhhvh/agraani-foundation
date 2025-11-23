/**
 * Integration test: Admin mutation → Public revalidation
 * Testing: About content update flow
 */

import { createAboutContent, updateAboutContent } from '@/lib/actions/about';
import { getAboutContent } from '@/lib/data/about';
import { revalidatePath } from 'next/cache';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@/lib/auth-utils', () => ({
  requirePermission: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    aboutContent: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  logError: vi.fn(),
}));

import { prisma } from '@/lib/prisma';

describe('About Content Mutation → Revalidation Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should revalidate public and admin paths after creating content', async () => {
    const mockSection = {
      id: '1',
      section: 'test-section',
      title: 'Test Title',
      content: 'Test content',
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Setup mocks
    vi.mocked(prisma.aboutContent.findUnique).mockResolvedValue(null); // No existing section
    vi.mocked(prisma.aboutContent.create).mockResolvedValue(mockSection as any);

    // Execute mutation
    const result = await createAboutContent({
      section: 'test-section',
      title: 'Test Title',
      content: 'Test content',
    });

    // Verify mutation succeeded
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockSection);

    // Verify revalidation was called for both public and admin pages
    expect(revalidatePath).toHaveBeenCalledWith('/about');
    expect(revalidatePath).toHaveBeenCalledWith('/admin/about');
    expect(revalidatePath).toHaveBeenCalledTimes(2);
  });

  it('should revalidate pages after updating content', async () => {
    const existingSection = {
      id: '1',
      section: 'mission',
      title: 'Old Title',
      content: 'Old content',
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedSection = {
      ...existingSection,
      title: 'New Title',
      content: 'New content',
      updatedAt: new Date(),
    };

    // Setup mocks
    vi.mocked(prisma.aboutContent.findUnique).mockResolvedValue(existingSection as any);
    vi.mocked(prisma.aboutContent.update).mockResolvedValue(updatedSection as any);

    // Execute mutation
    const result = await updateAboutContent('1', {
      title: 'New Title',
      content: 'New content',
    });

    // Verify mutation succeeded
    expect(result.success).toBe(true);
    expect(result.data?.title).toBe('New Title');

    // Verify revalidation was called
    expect(revalidatePath).toHaveBeenCalledWith('/about');
    expect(revalidatePath).toHaveBeenCalledWith('/admin/about');
  });

  it('should simulate full flow: admin update → public page reflects change', async () => {
    const initialSection = {
      id: '1',
      section: 'mission',
      title: 'Original Mission',
      content: 'Original content',
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedSection = {
      ...initialSection,
      title: 'Updated Mission',
      content: 'Updated content',
    };

    // Step 1: Admin updates content
    vi.mocked(prisma.aboutContent.findUnique).mockResolvedValue(initialSection as any);
    vi.mocked(prisma.aboutContent.update).mockResolvedValue(updatedSection as any);

    await updateAboutContent('1', {
      title: 'Updated Mission',
      content: 'Updated content',
    });

    // Verify revalidation was triggered
    expect(revalidatePath).toHaveBeenCalledWith('/about');

    // Step 2: Public page should get fresh data after revalidation
    // In a real scenario, Next.js would invalidate the cache and refetch
    // Here we simulate that by configuring the mock to return updated data
    vi.mocked(prisma.aboutContent.findMany).mockResolvedValue([updatedSection] as any);

    const publicData = await getAboutContent();

    // Verify public page gets updated data
    expect(publicData[0].title).toBe('Updated Mission');
    expect(publicData[0].content).toBe('Updated content');
  });
});
