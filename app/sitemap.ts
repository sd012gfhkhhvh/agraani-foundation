import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const revalidate = 86400; // Revalidate daily

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://agraaniwelfare.org';

  // Get all published blog posts
  const blogPosts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/programs',
    '/team',
    '/gallery',
    '/blog',
    '/contact',
    '/donate',
    '/legal',
  ].map((route) => ({
    url: `${appUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Blog post pages
  const blogPages = blogPosts.map((post) => ({
    url: `${appUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages];
}
