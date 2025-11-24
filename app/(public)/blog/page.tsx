import { ImageWithFallback } from '@/components/public/image-with-fallback';
import { ServerPagination } from '@/components/public/server-pagination';
import { Card, CardContent } from '@/components/ui/card';
import { getBlogPostsPaginated } from '@/lib/data';
import { ArrowRight, BookOpen, Calendar, Sparkles, User } from 'lucide-react';
import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import Link from 'next/link';

export const revalidate = 3600; // ISR - revalidate every hour

export const metadata: Metadata = {
  title: 'Blog - Agraani Welfare Foundation',
  description:
    'Read our latest articles about women empowerment, community development, and stories of transformation.',
};

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

  // Use cached data fetching
  const { posts, totalPages } = await getCachedBlogPosts(currentPage);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-linear-to-br from-primary to-accent overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/waves.svg')] opacity-10" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Stories & Insights</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our <span className="text-secondary">Blog</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90">
              Perspectives on empowerment, development, and community transformation
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <Card className="p-16 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No blog posts yet</h3>
              <p className="text-muted-foreground">
                Check back soon for inspiring stories and updates
              </p>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Card
                    key={post.id}
                    className="card-hover group overflow-hidden h-full flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <ImageWithFallback
                        src={post.imageUrl || ''}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-smooth"
                      />
                    </div>

                    {/* Content */}
                    <CardContent className="p-6 flex-1 flex flex-col">
                      {/* Category */}
                      {post.category && (
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3 w-fit">
                          {post.category}
                        </span>
                      )}

                      {/* Title */}
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-smooth line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-muted-foreground mb-4 flex-1 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : 'Draft'}
                          </span>
                        </div>
                      </div>

                      {/* Read More Link */}
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-primary font-medium hover:gap-2 transition-all"
                      >
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardContent>
                  </Card>
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
