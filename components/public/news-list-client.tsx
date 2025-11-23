'use client';

import { CardSkeleton } from '@/components/public/loading-skeleton';
import { Pagination } from '@/components/public/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePagination } from '@/lib/hooks/use-pagination';
import { ArrowRight, Calendar, Newspaper, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  imageUrl: string | null;
  author: string;
  category: string | null;
  publishedAt: Date | null;
}

interface NewsListClientProps {
  featuredPost: BlogPost | null;
  otherPosts: BlogPost[];
}

function formatDate(date: Date | string, format: 'full' | 'short' = 'full'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (format === 'short') {
    return new Intl.DateTimeFormat('en-US').format(d);
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function NewsListClient({ featuredPost, otherPosts }: NewsListClientProps) {
  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination({
    items: otherPosts,
    itemsPerPage: 12,
  });

  const noContent = !featuredPost && otherPosts.length === 0;

  if (noContent) {
    return (
      <Card className="p-16 text-center">
        <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-2xl font-semibold mb-2">No posts yet</h3>
        <p className="text-muted-foreground">
          Check back soon for updates and stories from our work
        </p>
      </Card>
    );
  }

  return (
    <>
      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16">
          <div className="mb-8">
            <Badge variant="default">Featured Story</Badge>
          </div>

          <Card className="overflow-hidden card-hover group">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative h-64 md:h-full overflow-hidden bg-linear-to-br from-primary/10 to-secondary/10">
                {featuredPost.imageUrl ? (
                  <Image
                    src={featuredPost.imageUrl}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Newspaper className="h-24 w-24 text-primary/30" />
                  </div>
                )}
              </div>

              {/* Content */}
              <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                {featuredPost.category && (
                  <Badge variant="outline" className="w-fit mb-4">
                    {featuredPost.category}
                  </Badge>
                )}

                <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-primary transition-smooth">
                  {featuredPost.title}
                </h2>

                {featuredPost.excerpt && (
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {featuredPost.publishedAt ? formatDate(featuredPost.publishedAt) : 'Draft'}
                  </div>
                </div>

                <Link href={`/news/${featuredPost.slug}`}>
                  <Button className="btn-gradient-primary w-fit">
                    Read Full Story
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </div>
          </Card>
        </section>
      )}

      {/* Recent Posts Grid */}
      {otherPosts.length > 0 && (
        <section className="py-16 bg-linear-to-b from-muted/30 to-background">
          <h2 className="text-3xl font-bold mb-8">Recent Updates</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedItems.map((post) => (
              <Card key={post.id} className="card-hover group overflow-hidden flex flex-col">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-linear-to-br from-primary/10 to-secondary/10">
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Newspaper className="h-12 w-12 text-primary/30" />
                    </div>
                  )}

                  {post.category && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="default">{post.category}</Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <CardContent className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-smooth line-clamp-2">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.publishedAt ? formatDate(post.publishedAt, 'short') : 'Draft'}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </div>
                  </div>

                  <Link href={`/news/${post.slug}`}>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-smooth"
                    >
                      Read More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            </div>
          )}
        </section>
      )}
    </>
  );
}

export function NewsListWrapper({
  featuredPost,
  otherPosts,
}: {
  featuredPost: BlogPost | null;
  otherPosts: BlogPost[];
}) {
  return (
    <Suspense fallback={<CardSkeleton count={9} />}>
      <NewsListClient featuredPost={featuredPost} otherPosts={otherPosts} />
    </Suspense>
  );
}
