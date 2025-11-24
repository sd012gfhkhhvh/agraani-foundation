'use client';

import { ImageWithFallback } from '@/components/public/image-with-fallback';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Program } from '@/types/models';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function ProgramFlipCard({ program }: { program: Program }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="perspective-1000 h-[450px] cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Side */}
        <Card
          className="absolute inset-0 overflow-hidden backface-hidden shadow-lg hover:shadow-xl transition-shadow"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="relative h-full flex flex-col">
            {/* Image - 60% */}
            <div className="relative h-[60%] overflow-hidden">
              <ImageWithFallback
                src={program.imageUrl || ''}
                alt={program.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                  {program.title}
                </h3>
              </div>
            </div>

            {/* Content - 40% */}
            <div className="h-[40%] p-5 flex flex-col justify-between bg-card">
              <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                {program.description}
              </p>
              <div className="flex items-center text-primary text-sm font-medium pt-3">
                <span>Hover to learn more</span>
                <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </Card>

        {/* Back Side */}
        <Card
          className="absolute inset-0 backface-hidden bg-linear-to-br from-primary via-primary/95 to-secondary text-white shadow-lg overflow-auto"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="h-full p-6 flex flex-col">
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-xl md:text-2xl font-bold mb-3 leading-tight">{program.title}</h3>
              <p className="text-white/90 text-sm leading-relaxed">{program.description}</p>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-4 mb-4">
              {program.targets && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <h4 className="font-semibold text-xs uppercase tracking-wide mb-1.5 text-white/80">
                    Target Beneficiaries
                  </h4>
                  <p className="text-white/95 text-sm">{program.targets}</p>
                </div>
              )}

              {program.impact && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <h4 className="font-semibold text-xs uppercase tracking-wide mb-1.5 text-white/80">
                    Expected Impact
                  </h4>
                  <p className="text-white/95 text-sm">{program.impact}</p>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Button
              asChild
              variant="secondary"
              className="w-full bg-white text-primary hover:bg-white/90 font-medium"
            >
              <Link href={`/programs#${program.id}`}>
                View Full Details
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
