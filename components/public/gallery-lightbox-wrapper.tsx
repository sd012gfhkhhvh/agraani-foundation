'use client';

import { GalleryLightbox as GalleryLightboxModal } from '@/components/public/gallery-lightbox';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Image as ImageIcon, Video } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './image-with-fallback';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  type: 'IMAGE' | 'VIDEO';
  category: string | null;
}

interface GalleryGridProps {
  items: GalleryItem[];
}

export function GalleryGrid({ items }: GalleryGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <Card
            key={item.id}
            className="group overflow-hidden card-hover cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <div className="relative aspect-square overflow-hidden">
              {item.type === 'IMAGE' && item.imageUrl ? (
                <ImageWithFallback
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                />
              ) : item.type === 'VIDEO' && item.videoUrl ? (
                <div className="w-full h-full flex items-center justify-center bg-black/90">
                  <Video className="h-16 w-16 text-white/70" />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/10 to-secondary/10">
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

      {/* Lightbox Modal */}
      <GalleryLightboxModal
        items={items}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}
