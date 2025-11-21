'use client';

import { PermissionGate } from '@/components/admin/PermissionGate';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { LoadingCard } from '@/components/ui/loading';
import { Textarea } from '@/components/ui/textarea';
import {
  createHeroBanner,
  deleteHeroBanner,
  getHeroBanners,
  updateHeroBanner,
} from '@/lib/actions';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { Resource } from '@/lib/permissions';
import { showError, showPromiseToast } from '@/lib/toast-utils';
import { Edit, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl: string;
  ctaText?: string | null;
  ctaLink?: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function HeroBannersPage() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<Partial<HeroBanner>>({});
  const [isSaving, setIsSaving] = useState(false);

  const permissions = usePermissions(Resource.HERO_BANNERS);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setIsLoading(true);
    const result = await getHeroBanners();
    if (result.success && result.data) {
      setBanners(result.data);
    } else {
      showError('Failed to load hero banners');
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!currentBanner.title || !currentBanner.imageUrl) {
      showError('Please fill in required fields');
      return;
    }

    setIsSaving(true);
    try {
      const promise = currentBanner.id
        ? updateHeroBanner(currentBanner.id, {
            title: currentBanner.title,
            subtitle: currentBanner.subtitle ?? undefined,
            description: currentBanner.description ?? undefined,
            imageUrl: currentBanner.imageUrl,
            ctaText: currentBanner.ctaText ?? undefined,
            ctaLink: currentBanner.ctaLink ?? undefined,
            order: currentBanner.order,
            isActive: currentBanner.isActive,
          })
        : createHeroBanner({
            title: currentBanner.title,
            subtitle: currentBanner.subtitle ?? undefined,
            description: currentBanner.description ?? undefined,
            imageUrl: currentBanner.imageUrl,
            ctaText: currentBanner.ctaText ?? undefined,
            ctaLink: currentBanner.ctaLink ?? undefined,
            order: currentBanner.order ?? banners.length,
            isActive: currentBanner.isActive ?? true,
          });

      const result = await showPromiseToast(promise, {
        loading: currentBanner.id ? 'Updating banner...' : 'Creating banner...',
        success: currentBanner.id ? 'Banner updated!' : 'Banner created!',
        error: 'Failed to save banner',
      });

      if (result.success) {
        await fetchBanners();
        setIsEditing(false);
        setCurrentBanner({});
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    const result = await showPromiseToast(deleteHeroBanner(id), {
      loading: 'Deleting banner...',
      success: 'Banner deleted!',
      error: 'Failed to delete banner',
    });

    if (result.success) {
      await fetchBanners();
    }
  };

  if (isLoading) {
    return <LoadingCard />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">Hero Banners</h1>
          <p className="text-muted-foreground mt-1">Manage homepage hero banners and CTAs</p>
        </div>
        <PermissionGate resource={Resource.HERO_BANNERS} action="create">
          <Button
            onClick={() => {
              setIsEditing(true);
              setCurrentBanner({ order: banners.length, isActive: true });
            }}
            className="btn-gradient-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Banner
          </Button>
        </PermissionGate>
      </div>

      {isEditing && (
        <Card className="border-2 border-primary/20 shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle>{currentBanner.id ? 'Edit' : 'Add'} Banner</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={currentBanner.title || ''}
                onChange={(e) => setCurrentBanner({ ...currentBanner, title: e.target.value })}
                placeholder="Empowering Communities"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <Input
                value={currentBanner.subtitle || ''}
                onChange={(e) => setCurrentBanner({ ...currentBanner, subtitle: e.target.value })}
                placeholder="Building a better tomorrow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                rows={2}
                value={currentBanner.description || ''}
                onChange={(e) =>
                  setCurrentBanner({ ...currentBanner, description: e.target.value })
                }
                placeholder="Brief description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image URL *</label>
              <Input
                value={currentBanner.imageUrl || ''}
                onChange={(e) => setCurrentBanner({ ...currentBanner, imageUrl: e.target.value })}
                placeholder="/images/hero/hero-1.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">CTA Text</label>
                <Input
                  value={currentBanner.ctaText || ''}
                  onChange={(e) => setCurrentBanner({ ...currentBanner, ctaText: e.target.value })}
                  placeholder="Learn More"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CTA Link</label>
                <Input
                  value={currentBanner.ctaLink || ''}
                  onChange={(e) => setCurrentBanner({ ...currentBanner, ctaLink: e.target.value })}
                  placeholder="/about"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Display Order</label>
                <Input
                  type="number"
                  value={currentBanner.order || 0}
                  onChange={(e) =>
                    setCurrentBanner({ ...currentBanner, order: parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="flex items-center gap-3 mt-6">
                <input
                  type="checkbox"
                  checked={currentBanner.isActive ?? true}
                  onChange={(e) =>
                    setCurrentBanner({ ...currentBanner, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <label className="text-sm font-medium">Active</label>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={handleSave}
                disabled={
                  isSaving ||
                  !currentBanner.title ||
                  !currentBanner.imageUrl ||
                  !permissions.canUpdate
                }
                className="btn-gradient-primary"
              >
                {isSaving ? 'Saving...' : 'Save Banner'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentBanner({});
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {banners.length === 0 ? (
          <EmptyState
            icon={ImageIcon}
            title="No hero banners yet"
            description="Create your first hero banner for the homepage"
            action={
              permissions.canCreate ? (
                <Button onClick={() => setIsEditing(true)} className="btn-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Banner
                </Button>
              ) : undefined
            }
          />
        ) : (
          banners.map((banner) => (
            <Card key={banner.id} className="card-hover">
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{banner.title}</h3>
                      <Badge variant={banner.isActive ? 'default' : 'secondary'}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    {banner.subtitle && (
                      <p className="text-muted-foreground mb-2">{banner.subtitle}</p>
                    )}
                    {banner.description && (
                      <p className="text-sm text-muted-foreground mb-2">{banner.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Order: {banner.order}</span>
                      {banner.ctaText && <span>CTA: {banner.ctaText}</span>}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <PermissionGate resource={Resource.HERO_BANNERS} action="update">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCurrentBanner(banner);
                          setIsEditing(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </PermissionGate>
                    <PermissionGate resource={Resource.HERO_BANNERS} action="delete">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(banner.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </PermissionGate>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
