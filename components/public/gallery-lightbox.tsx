'use client';

import { ChevronLeft, ChevronRight, Download, Share2, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  type: 'IMAGE' | 'VIDEO';
  category: string | null;
}

interface GalleryLightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function GalleryLightbox({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const currentItem = items[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev) onNavigate(currentIndex - 1);
  }, [hasPrev, currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (hasNext) onNavigate(currentIndex + 1);
  }, [hasNext, currentIndex, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !currentItem) return null;

  const lightboxContent = (
    <div className="fixed inset-0 z-9999 bg-black/95 backdrop-blur-sm" onClick={onClose}>
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110"
        aria-label="Close lightbox"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Navigation Buttons */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Image Container */}
      <div
        className="absolute inset-0 flex items-center justify-center p-4 md:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center">
          {/* Image */}
          {currentItem.type === 'IMAGE' && currentItem.imageUrl && (
            <Image
              src={currentItem.imageUrl}
              alt={currentItem.title}
              width={700}
              height={700}
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
            />
          )}

          {currentItem.type === 'VIDEO' && currentItem.videoUrl && (
            <video
              src={currentItem.videoUrl}
              controls
              className="max-w-full max-h-[70vh] rounded-lg shadow-2xl"
            />
          )}

          {/* Info Bar */}
          <div className="mt-6 bg-white/10 backdrop-blur-md rounded-lg p-4 md:p-6 max-w-2xl w-full">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-white text-xl md:text-2xl font-bold mb-2">
                  {currentItem.title}
                </h3>
                {currentItem.description && (
                  <p className="text-white/80 text-sm md:text-base">{currentItem.description}</p>
                )}
                {currentItem.category && (
                  <span className="inline-block mt-3 px-3 py-1 bg-primary text-white text-sm rounded-full">
                    {currentItem.category}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 shrink-0">
                {currentItem.imageUrl && (
                  <>
                    <a
                      href={currentItem.imageUrl}
                      download
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                      aria-label="Download"
                    >
                      <Download className="h-5 w-5" />
                    </a>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: currentItem.title,
                            text: currentItem.description || '',
                            url: currentItem.imageUrl || '',
                          });
                        }
                      }}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                      aria-label="Share"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Counter */}
          <div className="mt-4 text-white/60 text-sm">
            {currentIndex + 1} / {items.length}
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render outside main DOM
  return typeof window !== 'undefined' ? createPortal(lightboxContent, document.body) : null;
}
