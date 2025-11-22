'use client';

import { AdminCard } from '@/components/admin/AdminCard';
import { AdminDialog } from '@/components/admin/AdminDialog';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DeleteDialog } from '@/components/admin/DeleteDialog';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { Button } from '@/components/ui/button';
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<Partial<HeroBanner>>({});
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleOpenDialog = (banner?: HeroBanner) => {
    if (banner) {
      setCurrentBanner(banner);
    } else {
      setCurrentBanner({ order: banners.length, isActive: true });
    }
    setIsDialogOpen(true);
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
        setIsDialogOpen(false);
        setCurrentBanner({});
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const result = await showPromiseToast(deleteHeroBanner(deleteId), {
        loading: 'Deleting banner...',
        success: 'Banner deleted!',
        error: 'Failed to delete banner',
      });

      if (result.success) {
        await fetchBanners();
        setIsDeleteDialogOpen(false);
        setDeleteId(null);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <LoadingCard />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <AdminPageHeader
        title="Hero Banners"
        description="Manage homepage hero banners and CTAs"
        action={
          <PermissionGate resource={Resource.HERO_BANNERS} action="create">
            <Button onClick={() => handleOpenDialog()} className="btn-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </PermissionGate>
        }
      />

      <div className="grid gap-6">
        {banners.length === 0 ? (
          <EmptyState
            icon={ImageIcon}
            title="No hero banners yet"
            description="Create your first hero banner for the homepage"
            action={
              permissions.canCreate ? (
                <Button onClick={() => handleOpenDialog()} className="btn-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Banner
                </Button>
              ) : undefined
            }
          />
        ) : (
          banners.map((banner) => (
            <AdminCard
              key={banner.id}
              title={banner.title}
              subtitle={banner.subtitle || undefined}
              image={banner.imageUrl}
              status={{ isActive: banner.isActive }}
              actions={
                <>
                  <PermissionGate resource={Resource.HERO_BANNERS} action="update">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDialog(banner)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </PermissionGate>
                  <PermissionGate resource={Resource.HERO_BANNERS} action="delete">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(banner.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </PermissionGate>
                </>
              }
            >
              <div className="space-y-2 text-sm text-muted-foreground">
                {banner.description && <p>{banner.description}</p>}
                <div className="flex items-center gap-4 pt-2">
                  <span className="bg-muted px-2 py-1 rounded-md text-xs font-medium">
                    Order: {banner.order}
                  </span>
                  {banner.ctaText && (
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium">
                      CTA: {banner.ctaText}
                    </span>
                  )}
                </div>
              </div>
            </AdminCard>
          ))
        )}
      </div>

      <AdminDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={currentBanner.id ? 'Edit Banner' : 'Add New Banner'}
        description={
          currentBanner.id
            ? 'Update banner details below.'
            : 'Create a new hero banner for the homepage.'
        }
        onSave={handleSave}
        isLoading={isSaving}
        disabled={!currentBanner.title || !currentBanner.imageUrl}
      >
        <div className="space-y-4">
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
              onChange={(e) => setCurrentBanner({ ...currentBanner, description: e.target.value })}
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

          <div className="grid grid-cols-2 gap-4 items-end">
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
            <div className="flex items-center gap-3 pb-3">
              <input
                type="checkbox"
                id="isActive"
                checked={currentBanner.isActive ?? true}
                onChange={(e) => setCurrentBanner({ ...currentBanner, isActive: e.target.checked })}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
              <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                Active
              </label>
            </div>
          </div>
        </div>
      </AdminDialog>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Banner"
        description="Are you sure you want to delete this banner? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
