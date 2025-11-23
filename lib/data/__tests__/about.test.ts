/**
 * Unit tests for data loaders
 * Testing: lib/data/about.ts
 */

import { getAboutContent, getAboutSection } from '@/lib/data/about';
import { prisma } from '@/lib/prisma';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    aboutContent: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

describe('About Data Loaders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAboutContent', () => {
    it('should fetch all about content sections', async () => {
      const mockSections = [
        {
          id: '1',
          section: 'mission',
          title: 'Our Mission',
          content: 'Test mission content',
          imageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          section: 'vision',
          title: 'Our Vision',
          content: 'Test vision content',
          imageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(prisma.aboutContent.findMany).mockResolvedValue(mockSections as any);

      const result = await getAboutContent();

      expect(result).toEqual(mockSections);
      expect(prisma.aboutContent.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          section: true,
          title: true,
          content: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { section: 'asc' },
      });
    });

    it('should return correctly formatted data with explicit select', async () => {
      const mockSection = {
        id: '1',
        section: 'mission',
        title: 'Our Mission',
        content: 'Test content',
        imageUrl: 'https://example.com/image.jpg',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      vi.mocked(prisma.aboutContent.findMany).mockResolvedValue([mockSection] as any);

      const result = await getAboutContent();

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('section');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('content');
      expect(result[0]).toHaveProperty('imageUrl');
      expect(result[0]).toHaveProperty('createdAt');
      expect(result[0]).toHaveProperty('updatedAt');
    });
  });

  describe('getAboutSection', () => {
    it('should fetch a specific section by identifier', async () => {
      const mockSection = {
        id: '1',
        section: 'mission',
        title: 'Our Mission',
        content: 'Test mission content',
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.aboutContent.findUnique).mockResolvedValue(mockSection as any);

      const result = await getAboutSection('mission');

      expect(result).toEqual(mockSection);
      expect(prisma.aboutContent.findUnique).toHaveBeenCalledWith({
        where: { section: 'mission' },
        select: {
          id: true,
          section: true,
          title: true,
          content: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    it('should return null for non-existent section (for notFound() handling)', async () => {
      vi.mocked(prisma.aboutContent.findUnique).mockResolvedValue(null);

      const result = await getAboutSection('non-existent');

      expect(result).toBeNull();
    });
  });
});
