import { useMemo, useState } from 'react';

interface UseGalleryFilterProps<T extends { category: string | null }> {
  items: T[];
}

interface UseGalleryFilterReturn<T> {
  filteredItems: T[];
  activeCategory: string;
  categories: string[];
  setActiveCategory: (category: string) => void;
  itemCounts: Record<string, number>;
}

export function useGalleryFilter<T extends { category: string | null }>({
  items,
}: UseGalleryFilterProps<T>): UseGalleryFilterReturn<T> {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = items.map((item) => item.category).filter((cat): cat is string => cat !== null);
    return ['all', ...Array.from(new Set(cats))];
  }, [items]);

  // Count items per category
  const itemCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length };
    items.forEach((item) => {
      if (item.category) {
        counts[item.category] = (counts[item.category] || 0) + 1;
      }
    });
    return counts;
  }, [items]);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  return {
    filteredItems,
    activeCategory,
    categories,
    setActiveCategory,
    itemCounts,
  };
}
