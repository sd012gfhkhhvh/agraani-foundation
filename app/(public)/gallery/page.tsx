import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon, Video, Filter } from 'lucide-react';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Gallery - Agraani Welfare Foundation',
  description: 'View our photo and video gallery showcasing our programs, events, and the impact of our work across West Bengal.',
};

export default async function GalleryPage() {
  const galleryItems = await prisma.galleryItem.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  // Get unique categories
  const categories = [...new Set(galleryItems.map(item => item.category).filter(Boolean))];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-linear-to-br from-secondary via-primary to-accent overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-10" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <ImageIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Our Impact in Pictures</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Photo & Video <span className="text-white/90">Gallery</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Witness the transformative power of our programs through moments captured across communities
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      {categories.length > 0 && (
        <section className="py-8 border-b bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Filter className="h-4 w-4" />
                Filter:
              </div>
              <Badge variant="default" className="cursor-pointer hover:bg-primary/90">
                All
              </Badge>
              {categories.map((category) => (
                <Badge key={category} variant="outline" className="cursor-pointer hover:bg-muted">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {galleryItems.length === 0 ? (
            <Card className="p-16 text-center">
              <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Gallery coming soon</h3>
              <p className="text-muted-foreground">Check back to see photos and videos from our programs and events</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleryItems.map((item) => (
                <Card key={item.id} className="group overflow-hidden card-hover cursor-pointer">
                  <div className="relative aspect-square overflow-hidden bg-linear-to-br from-primary/10 to-secondary/10">
                    {item.type === 'IMAGE' && item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                      />
                    ) : item.type === 'VIDEO' && item.videoUrl ? (
                      <div className="w-full h-full flex items-center justify-center bg-black/90">
                        <Video className="h-16 w-16 text-white/70" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-primary/30" />
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />

                    {/* Type Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="backdrop-blur-md bg-white/90">
                        {item.type === 'IMAGE' ? (
                          <ImageIcon className="h-3 w-3 mr-1" />
                        ) : (
                          <Video className="h-3 w-3 mr-1" />
                        )}
                        {item.type}
                      </Badge>
                    </div>

                    {/* Category Badge */}
                    {item.category && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="default" className="backdrop-blur-md">
                          {item.category}
                        </Badge>
                      </div>
                    )}

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-smooth">
                      <h3 className="text-white font-semibold text-lg">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-white/80 text-sm line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want to Be Part of <span className="text-gradient-primary">Our Story?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join us in creating more moments worth capturing. Get involved today.
          </p>
          <a href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth font-medium">
            Get Involved
          </a>
        </div>
      </section>
    </div>
  );
}
