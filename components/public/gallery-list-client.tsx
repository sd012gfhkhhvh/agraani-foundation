'use client';

import { GalleryLightbox } from '@/components/public/gallery-lightbox';
import { GalleryItemSkeleton } from '@/components/public/loading-skeleton';
import { Pagination } from '@/components/public/pagination';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useGalleryFilter } from '@/lib/hooks/use-gallery-filter';
import { usePagination } from '@/lib/hooks/use-pagination';
import { Image as ImageIcon, Video } from 'lucide-react';
import Image from 'next/image';
import { Suspense, useState } from 'react';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  type: 'IMAGE' | 'VIDEO';
  category: string | null;
}

interface GalleryListClientProps {
  items: GalleryItem[];
}

export function GalleryListClient({ items }: GalleryListClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { filteredItems, activeCategory, categories, setActiveCategory, itemCounts } =
    useGalleryFilter({ items });

  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination({
    items: filteredItems,
    itemsPerPage: 24,
  });

  const openLightbox = (index: number) => {
    // Calculate the absolute index in filteredItems from the paginated index
    const absoluteIndex = (currentPage - 1) * 24 + index;
    setLightboxIndex(absoluteIndex);
    setLightboxOpen(true);
  };

  if (items.length === 0) {
    return (
      <Card className="p-16 text-center">
        <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-2xl font-semibold mb-2">Gallery coming soon</h3>
        <p className="text-muted-foreground">
          Check back to see photos and videos from our programs and events
        </p>
      </Card>
    );
  }

  return (
    <>
      {/* Category Filters */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all hover:scale-105 ${
                activeCategory === category ? 'bg-primary text-white shadow-lg' : 'hover:bg-muted'
              }`}
              onClick={() => {
                setActiveCategory(category);
                goToPage(1); // Reset to first page when filtering
              }}
            >
              {category === 'all' ? 'All' : category} ({itemCounts[category] || 0})
            </Badge>
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedItems.map((item, index) => (
          <Card
            key={item.id}
            className="group overflow-hidden card-hover cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <div className="relative aspect-square overflow-hidden bg-linear-to-br from-primary/10 to-secondary/10">
              {item.type === 'IMAGE' && item.imageUrl ? (
                <Image
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
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-smooth">
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
                <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                {item.description && (
                  <p className="text-white/80 text-sm line-clamp-2 mt-1">{item.description}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
        </div>
      )}

      {/* Lightbox */}
      <GalleryLightbox
        items={filteredItems}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}

export function GalleryListWrapper({ items }: { items: GalleryItem[] }) {
  return (
    <Suspense fallback={<GalleryItemSkeleton count={24} />}>
      <GalleryListClient items={items} />
    </Suspense>
  );
}
