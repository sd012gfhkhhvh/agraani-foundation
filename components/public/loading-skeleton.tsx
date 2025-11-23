import { Card, CardContent } from '@/components/ui/card';

export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="h-48 bg-muted animate-pulse" />
          <CardContent className="p-6 space-y-3">
            <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-full" />
            <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
            <div className="h-10 bg-muted animate-pulse rounded w-1/3 mt-4" />
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6 flex gap-4">
            <div className="shrink-0 w-16 h-16 bg-muted animate-pulse rounded-lg" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-muted animate-pulse rounded w-2/3" />
              <div className="h-4 bg-muted animate-pulse rounded w-full" />
              <div className="h-4 bg-muted animate-pulse rounded w-4/5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function TeamMemberSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-square bg-muted animate-pulse" />
          <CardContent className="p-6 text-center space-y-2">
            <div className="h-5 bg-muted animate-pulse rounded mx-auto w-2/3" />
            <div className="h-4 bg-muted animate-pulse rounded mx-auto w-1/2" />
            <div className="h-3 bg-muted animate-pulse rounded mx-auto w-full mt-3" />
            <div className="h-3 bg-muted animate-pulse rounded mx-auto w-5/6" />
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export function GalleryItemSkeleton({ count = 12 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-square bg-muted animate-pulse" />
        </Card>
      ))}
    </>
  );
}

export function HeroSkeleton() {
  return <div className="h-[600px] bg-muted animate-pulse" />;
}
