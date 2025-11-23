import { ImageWithFallback } from '@/components/public/image-with-fallback';
import { ServerPagination } from '@/components/public/server-pagination';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getBlogPostsPaginated, getPublishedBlogPosts } from '@/lib/data';
import { ArrowRight, Calendar, Newspaper, Sparkles, TrendingUp, User } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 3600; // ISR - revalidate every hour

export const metadata: Metadata = {
  title: 'News & Updates - Agraani Welfare Foundation',
  description:
    'Stay updated with the latest news, announcements, and success stories from Agraani Welfare Foundation.',
};

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  // Get featured post (always the first/latest)
  const allPosts = await getPublishedBlogPosts(1);
  const featuredPost = allPosts[0];

  // Get paginated posts (skip the featured one on page 1)
  const { posts, totalPages } = await getBlogPostsPaginated({
    page: currentPage,
    limit: 12,
  });

  // On page 1, remove featured post from the list to avoid duplication
  const displayPosts =
    currentPage === 1 && featuredPost ? posts.filter((p) => p.id !== featuredPost.id) : posts;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-linear-to-br from-accent to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/lines.svg')] opacity-10" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Latest Updates</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              News & <span className="text-primary">Updates</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90">
              Stay informed about our programs, events, and impact stories
            </p>
          </div>
        </div>
      </section>

      {/* News Content */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <Card className="p-16 text-center">
              <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No news yet</h3>
              <p className="text-muted-foreground">
                Check back soon for latest updates and announcements
              </p>
            </Card>
          ) : (
            <>
              {/* Featured Post (only on page 1) */}
              {currentPage === 1 && featuredPost && (
                <Card className="mb-12 overflow-hidden card-hover group">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className="relative h-64 md:h-auto">
                      <ImageWithFallback
                        src={featuredPost.imageUrl || ''}
                        alt={featuredPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-smooth"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-secondary text-white">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                      {featuredPost.category && (
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4 w-fit">
                          {featuredPost.category}
                        </span>
                      )}

                      <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-primary transition-smooth">
                        {featuredPost.title}
                      </h2>

                      <p className="text-lg text-muted-foreground mb-6">{featuredPost.excerpt}</p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {featuredPost.publishedAt
                              ? new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : 'Draft'}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center text-primary font-semibold text-lg hover:gap-2 transition-all"
                      >
                        Read Full Story
                        <ArrowRight className="h-5 w-5 ml-1" />
                      </Link>
                    </CardContent>
                  </div>
                </Card>
              )}

              {/* Recent Updates Grid */}
              {displayPosts.length > 0 && (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold">Recent Updates</h2>
                    <p className="text-muted-foreground">Latest stories from our community</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayPosts.map((post) => (
                      <Card
                        key={post.id}
                        className="card-hover group overflow-hidden h-full flex flex-col"
                      >
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                          <ImageWithFallback
                            src={post.imageUrl || ''}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-smooth"
                          />
                        </div>

                        {/* Content */}
                        <CardContent className="p-6 flex-1 flex flex-col">
                          {post.category && (
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3 w-fit">
                              {post.category}
                            </span>
                          )}

                          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-smooth line-clamp-2">
                            {post.title}
                          </h3>

                          <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
                            {post.excerpt}
                          </p>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{post.author}</span>
                            <span>
                              {post.publishedAt
                                ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })
                                : 'Draft'}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              {/* Server Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <ServerPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath="/news"
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
