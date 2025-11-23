import { Button } from '@/components/ui/button';
import { getBlogPostBySlug } from '@/lib/data';
import { generateSEO } from '@/lib/seo';
import { Calendar, Tag, User } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 3600; // ISR - revalidate every hour

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export async function generateMetadata(props: BlogPostPageProps): Promise<Metadata> {
  const params = await props.params;
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return generateSEO({
    title: post.title,
    description: post.excerpt || post.title,
    ogImage: post.imageUrl || undefined,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const params = await props.params;
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="py-16">
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <Link href="/blog" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Blog
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{post.publishedAt ? formatDate(post.publishedAt) : 'Draft'}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>{post.author}</span>
            </div>
            {post.category && (
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-4 w-4 text-gray-600" />
              {post.tags.map((tag) => (
                <span key={tag} className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {post.imageUrl && (
          <div className="relative h-96 mb-8 rounded-xl overflow-hidden">
            <Image src={post.imageUrl} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Back Button */}
        <div className="border-t border-gray-200 pt-8">
          <Button asChild variant="outline">
            <Link href="/blog">← Back to All Posts</Link>
          </Button>
        </div>
      </article>
    </div>
  );
}
