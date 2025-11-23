import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface ServerPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  className?: string;
}

export function ServerPagination({
  currentPage,
  totalPages,
  basePath,
  className = '',
}: ServerPaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsisThreshold = 7;

    if (totalPages <= showEllipsisThreshold) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis-start');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis-end');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className={`flex items-center justify-center gap-2 ${className}`} aria-label="Pagination">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link href={`${basePath}?page=${currentPage - 1}`} prefetch={true}>
          <Button variant="outline" size="sm" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (typeof page === 'string') {
            return (
              <span key={`${page}-${index}`} className="px-2 text-muted-foreground">
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <Link key={page} href={`${basePath}?page=${page}`} prefetch={true}>
              <Button
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className={`min-w-[2.5rem] ${isActive ? 'pointer-events-none' : ''}`}
              >
                {page}
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link href={`${basePath}?page=${currentPage + 1}`} prefetch={true}>
          <Button variant="outline" size="sm" className="gap-1">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled className="gap-1">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </nav>
  );
}
