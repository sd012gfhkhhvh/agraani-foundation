'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ReactNode } from 'react';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon?: ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-primary via-secondary to-accent" />

      {/* Timeline Items */}
      <div className="space-y-12 md:space-y-16">
        {items.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex items-center ${
                isEven ? 'md:flex-row' : 'md:flex-row-reverse'
              } flex-row`}
            >
              {/* Content */}
              <div
                className={`flex-1 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'} pl-12 md:pl-0`}
              >
                <div className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-3">
                    {item.year}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>

              {/* Center Icon */}
              <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full bg-primary border-4 border-background shadow-lg z-10">
                {item.icon || <Check className="h-4 w-4 md:h-6 md:w-6 text-white" />}
              </div>

              {/* Empty space for alternating layout on desktop */}
              <div className="hidden md:block flex-1" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
