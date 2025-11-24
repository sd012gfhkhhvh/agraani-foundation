'use client';

import { ImageWithFallback } from '@/components/public/image-with-fallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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

interface FeaturedCarouselProps {
  posts: BlogPost[];
  autoPlayInterval?: number;
}

export function FeaturedCarousel({ posts, autoPlayInterval = 5000 }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || posts.length <= 1) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, posts.length, autoPlayInterval]);

  if (posts.length === 0) return null;

  const currentPost = posts[currentIndex];

  return (
    <div
      className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={currentPost.imageUrl || ''}
          alt={currentPost.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-12">
        <div className="max-w-2xl">
          {currentPost.category && (
            <Badge className="mb-4 bg-secondary text-white">{currentPost.category}</Badge>
          )}

          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {currentPost.title}
          </h2>

          {currentPost.excerpt && (
            <p className="text-gray-200 text-base md:text-lg mb-6 line-clamp-2">
              {currentPost.excerpt}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-300 mb-6">
            <span>{currentPost.author}</span>
            {currentPost.publishedAt && (
              <>
                <span>•</span>
                <span>
                  {new Date(currentPost.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </>
            )}
          </div>

          <Link href={`/blog/${currentPost.slug}`}>
            <Button className="bg-white text-primary hover:bg-gray-100">Read Article</Button>
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      {posts.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {posts.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
