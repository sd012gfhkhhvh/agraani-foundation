'use client';

import { ImageWithFallback } from '@/components/public/image-with-fallback';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { calculateReadingTime, formatReadingTime } from '@/lib/utils/reading-time';
import { ArrowRight, Calendar, Clock, Share2, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    imageUrl: string | null;
    author: string;
    category: string | null;
    publishedAt: Date | null;
  };
}

export function BlogCard({ post }: BlogCardProps) {
  const [isSharing, setIsSharing] = useState(false);
  const readingTime = calculateReadingTime(post.content);

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt || post.title,
      url: `${window.location.origin}/blog/${post.slug}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        setIsSharing(true);
        setTimeout(() => setIsSharing(false), 2000);
      } catch (err) {
        console.error('Failed to copy');
      }
    }
  };

  return (
    <Card className="card-hover group overflow-hidden h-full flex flex-col">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <ImageWithFallback
          src={post.imageUrl || ''}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-110 transition-smooth"
        />

        {/* Share Button Overlay */}
        <button
          onClick={handleShare}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          aria-label="Share post"
        >
          <Share2 className="h-4 w-4 text-primary" />
        </button>
      </div>

      {/* Content */}
      <CardContent className="p-6 flex-1 flex flex-col">
        {/* Category & Reading Time */}
        <div className="flex items-center gap-2 mb-3">
          {post.category && (
            <Badge variant="secondary" className="text-xs">
              {post.category}
            </Badge>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatReadingTime(readingTime)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-smooth line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-muted-foreground mb-4 flex-1 line-clamp-3">{post.excerpt}</p>

        {/* Meta & CTA */}
        <div className="space-y-4">
          {/* Author & Date */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            {post.publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Read More Link */}
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-primary font-medium hover:gap-2 transition-all"
          >
            Read More
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </CardContent>

      {/* Share Confirmation */}
      {isSharing && (
        <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
          Link copied!
        </div>
      )}
    </Card>
  );
}
