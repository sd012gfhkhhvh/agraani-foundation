import { BlogCard } from '@/components/public/blog-card';
import { FeaturedCarousel } from '@/components/public/featured-carousel';
import { ServerPagination } from '@/components/public/server-pagination';
import { Card } from '@/components/ui/card';
import { getBlogPostsPaginated, getPublishedBlogPosts } from '@/lib/data';
import { BookOpen, Sparkles } from 'lucide-react';
import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';

export const revalidate = 3600; // ISR - revalidate every hour

export const metadata: Metadata = {
  title: 'Blog - Agraani Welfare Foundation',
  description:
    'Read our latest articles about women empowerment, community development, and stories of transformation.',
};

// Cached featured posts for carousel
const getCachedFeaturedPosts = unstable_cache(
  async () => getPublishedBlogPosts(3),
  ['blog-featured-posts'],
  {
    revalidate: 3600,
    tags: ['blog'],
  }
);

// Cached data fetching for better performance
const getCachedBlogPosts = unstable_cache(
  async (page: number) => {
    return await getBlogPostsPaginated({
      page,
      limit: 12,
    });
  },
  ['blog-posts-paginated'],
  {
    revalidate: 3600, // 1 hour cache
    tags: ['blog'],
  }
);

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  // Fetch featured posts and paginated posts
  const [featuredPosts, { posts, totalPages }] = await Promise.all([
    getCachedFeaturedPosts(),
    getCachedBlogPosts(currentPage),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 bg-linear-to-br from-primary to-accent overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/waves.svg')] opacity-10" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 md:mb-6">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-secondary" />
              <span className="text-xs md:text-sm font-medium">Stories & Insights</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              Our <span className="text-secondary">Blog</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto opacity-90">
              Perspectives on empowerment, development, and community transformation
            </p>
          </div>

          {/* Featured Carousel - Only on page 1 */}
          {currentPage === 1 && featuredPosts.length > 0 && (
            <FeaturedCarousel posts={featuredPosts} />
          )}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <Card className="p-12 md:p-16 text-center">
              <BookOpen className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-semibold mb-2">No blog posts yet</h3>
              <p className="text-muted-foreground">
                Check back soon for inspiring stories and updates
              </p>
            </Card>
          ) : (
            <>
              {/* Section Header */}
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold">
                  {currentPage === 1 ? 'Latest Articles' : `Page ${currentPage}`}
                </h2>
                <p className="text-muted-foreground mt-2">
                  Insights and stories from our community
                </p>
              </div>

              {/* Blog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {/* Server Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <ServerPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath="/blog"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
