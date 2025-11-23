import { GalleryGrid } from '@/components/public/gallery-lightbox-wrapper';
import { ServerPagination } from '@/components/public/server-pagination';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getActiveGalleryItems, getGalleryItemsPaginated } from '@/lib/data';
import { Camera, Sparkles } from 'lucide-react';
import { Metadata } from 'next';

export const revalidate = 3600; // ISR - revalidate every hour

export const metadata: Metadata = {
  title: 'Gallery - Agraani Welfare Foundation',
  description: 'Explore photos and videos from our programs, events, and community initiatives.',
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const activeCategory = params.category;

  // Fetch paginated gallery items
  const { items: galleryItems, totalPages } = await getGalleryItemsPaginated({
    page: currentPage,
    limit: 12,
    filters: activeCategory ? { category: activeCategory } : undefined,
  });

  // Get all items to extract unique categories (could be optimized with a separate query)
  const allItems = await getActiveGalleryItems();
  const categories = Array.from(new Set(allItems.map((item) => item.category).filter(Boolean)));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-linear-to-br from-primary to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-10" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Moments That Matter</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our <span className="text-accent">Gallery</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90">
              Visual stories of transformation, hope, and community empowerment
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category Filters */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
              <a href="/gallery">
                <Badge
                  variant={!activeCategory ? 'default' : 'outline'}
                  className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all hover:scale-105 ${
                    !activeCategory ? 'bg-primary text-white shadow-lg' : 'hover:bg-muted'
                  }`}
                >
                  All ({allItems.length})
                </Badge>
              </a>
              {categories.map((category) => {
                const count = allItems.filter((item) => item.category === category).length;
                return (
                  <a key={category} href={`/gallery?category=${category}`}>
                    <Badge
                      variant={activeCategory === category ? 'default' : 'outline'}
                      className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all hover:scale-105 ${
                        activeCategory === category
                          ? 'bg-primary text-white shadow-lg'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {category} ({count})
                    </Badge>
                  </a>
                );
              })}
            </div>
          )}

          {/* Gallery Items */}
          {galleryItems.length === 0 ? (
            <Card className="p-16 text-center">
              <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Gallery coming soon</h3>
              <p className="text-muted-foreground">
                Check back to see photos and videos from our programs and events
              </p>
            </Card>
          ) : (
            <>
              <GalleryGrid items={galleryItems} />

              {/* Server Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <ServerPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath={activeCategory ? `/gallery?category=${activeCategory}` : '/gallery'}
                  />
                </div>
              )}
            </>
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
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth font-medium"
          >
            Get Involved
          </a>
        </div>
      </section>
    </div>
  );
}
