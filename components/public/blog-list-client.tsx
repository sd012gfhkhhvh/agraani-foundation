'use client';

import { CardSkeleton } from '@/components/public/loading-skeleton';
import { Pagination } from '@/components/public/pagination';
import { Card, CardContent } from '@/components/ui/card';
import { usePagination } from '@/lib/hooks/use-pagination';
import { ArrowRight, Calendar, User } from 'lucide-react';
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

interface BlogListClientProps {
  posts: BlogPost[];
}

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function BlogListClient({ posts }: BlogListClientProps) {
  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination({
    items: posts,
    itemsPerPage: 12,
  });

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No posts available yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedItems.map((post) => (
          <Card key={post.id} className="hover:shadow-xl transition-shadow overflow-hidden group">
            {post.imageUrl && (
              <div className="relative h-48 bg-linear-to-br from-primary/10 to-secondary/10 overflow-hidden">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                />
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{post.publishedAt ? formatDate(post.publishedAt) : 'Draft'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
              </div>

              <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h2>

              {post.excerpt && (
                <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
              )}

              {post.category && (
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {post.category}
                </span>
              )}

              <Link
                href={`/blog/${post.slug}`}
                className="text-primary font-medium inline-flex items-center gap-2 hover:gap-3 transition-all"
              >
                Read More <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
        </div>
      )}
    </>
  );
}

export function BlogListWrapper({ posts }: { posts: BlogPost[] }) {
  return (
    <Suspense fallback={<CardSkeleton count={12} />}>
      <BlogListClient posts={posts} />
    </Suspense>
  );
}
