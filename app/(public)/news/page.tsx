import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, Newspaper } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'News & Updates - Agraani Welfare Foundation',
  description: 'Stay updated with the latest news, stories, and updates from Agraani Welfare Foundation.',
};

export default async function NewsPage() {
  const blogPosts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    take: 12,
  });

  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-linear-to-br from-primary to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-10" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <Newspaper className="h-4 w-4" />
              <span className="text-sm font-medium">Latest Updates</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              News & <span className="text-accent">Stories</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Read about our latest initiatives, success stories, and community impact
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Badge variant="default">Featured Story</Badge>
            </div>
            
            <Card className="overflow-hidden card-hover group">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative h-64 md:h-full overflow-hidden bg-linear-to-br from-primary/10 to-secondary/10">
                  {featuredPost.imageUrl ? (
                    <img
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
                      {featuredPost.publishedAt 
                        ? new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        : 'Draft'}
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
          </div>
        </section>
      )}

      {/* Recent Posts Grid */}
      <section className="py-16 bg-linear-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Recent Updates</h2>
          
          {otherPosts.length === 0 && !featuredPost ? (
            <Card className="p-16 text-center">
              <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground">Check back soon for updates and stories from our work</p>
            </Card>
          ) : otherPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <Card key={post.id} className="card-hover group overflow-hidden flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-linear-to-br from-primary/10 to-secondary/10">
                    {post.imageUrl ? (
                      <img
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
                      <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.publishedAt 
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : 'Draft'}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </div>
                    </div>

                    <Link href={`/news/${post.slug}`}>
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-smooth">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
