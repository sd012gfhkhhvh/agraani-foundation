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
import { createGalleryItem, deleteGalleryItem, updateGalleryItem } from '@/lib/actions';
import { useGalleryItems } from '@/lib/hooks/useAdminData';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { Resource } from '@/lib/permissions';
import { showError, showPromiseToast } from '@/lib/toast-utils';
import type { GalleryItem } from '@/types/models';
import { Edit, Image as ImageIcon, Plus, Trash2, Video } from 'lucide-react';
import { useState } from 'react';

export default function GalleryPage() {
  const { data: items = [], isLoading, refetch } = useGalleryItems();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<GalleryItem>>({});
  const [filter, setFilter] = useState<string>('all');
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const permissions = usePermissions(Resource.GALLERY);

  const handleOpenDialog = (item?: GalleryItem) => {
    if (item) {
      setCurrentItem(item);
    } else {
      setCurrentItem({ order: items.length, isActive: true, type: 'IMAGE' });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const mediaUrl = currentItem.type === 'VIDEO' ? currentItem.videoUrl : currentItem.imageUrl;

    if (!currentItem.title || !mediaUrl) {
      showError('Please fill in required fields (title and media URL)');
      return;
    }

    setIsSaving(true);
    try {
      const itemData = {
        title: currentItem.title,
        description: currentItem.description ?? undefined,
        imageUrl: currentItem.type === 'IMAGE' ? mediaUrl : undefined,
        videoUrl: currentItem.type === 'VIDEO' ? mediaUrl : undefined,
        type: currentItem.type || 'IMAGE',
        category: currentItem.category ?? undefined,
        order: currentItem.order,
        isActive: currentItem.isActive,
      };

      const promise = currentItem.id
        ? updateGalleryItem(currentItem.id, itemData)
        : createGalleryItem({
            ...itemData,
            order: itemData.order ?? items.length,
            isActive: itemData.isActive ?? true,
          });

      const result = await showPromiseToast(promise, {
        loading: currentItem.id ? 'Updating item...' : 'Adding item...',
        success: currentItem.id ? 'Item updated!' : 'Item added!',
        error: 'Failed to save item',
      });

      if (result.success) {
        await refetch();
        setIsDialogOpen(false);
        setCurrentItem({});
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
      const result = await showPromiseToast(deleteGalleryItem(deleteId), {
        loading: 'Deleting item...',
        success: 'Item deleted!',
        error: 'Failed to delete item',
      });

      if (result.success) {
        await refetch();
        setIsDeleteDialogOpen(false);
        setDeleteId(null);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const categories = Array.from(new Set(items.map((item) => item.category).filter(Boolean)));
  const filteredItems = filter === 'all' ? items : items.filter((item) => item.category === filter);

  if (isLoading) {
    return <LoadingCard />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <AdminPageHeader
        title="Media Gallery"
        description="Manage photos and videos from events and programs"
        action={
          <PermissionGate resource={Resource.GALLERY} action="create">
            <Button onClick={() => handleOpenDialog()} className="btn-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Media
            </Button>
          </PermissionGate>
        }
      />

      <div className="flex gap-2 flex-wrap">
        <Button
          size="sm"
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All ({items.length})
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            size="sm"
            variant={filter === category ? 'default' : 'outline'}
            onClick={() => setFilter(category as string)}
          >
            {category} ({items.filter((i) => i.category === category).length})
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={ImageIcon}
              title="No media items yet"
              description="Upload your first photo or video"
              action={
                permissions.canCreate ? (
                  <Button onClick={() => handleOpenDialog()} className="btn-gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Media
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          filteredItems.map((item) => {
            const mediaUrl = item.type === 'VIDEO' ? item.videoUrl : item.imageUrl;
            return (
              <AdminCard
                key={item.id}
                title={item.title}
                subtitle={item.category || undefined}
                image={item.type === 'IMAGE' ? mediaUrl : undefined}
                placeholderIcon={item.type === 'VIDEO' ? Video : ImageIcon}
                status={{ isActive: item.isActive }}
                actions={
                  <>
                    <PermissionGate resource={Resource.GALLERY} action="update">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDialog(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </PermissionGate>
                    <PermissionGate resource={Resource.GALLERY} action="delete">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </PermissionGate>
                  </>
                }
              >
                {item.type === 'VIDEO' && !mediaUrl && (
                  <div className="flex items-center justify-center h-32 bg-muted rounded-md mb-2">
                    <Video className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                {item.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {item.description}
                  </p>
                )}
              </AdminCard>
            );
          })
        )}
      </div>

      <AdminDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={currentItem.id ? 'Edit Media' : 'Add New Media'}
        description={
          currentItem.id
            ? 'Update media details below.'
            : 'Upload a new photo or video to the gallery.'
        }
        onSave={handleSave}
        isLoading={isSaving}
        disabled={
          !currentItem.title ||
          (!currentItem.imageUrl && !currentItem.videoUrl && currentItem.type === 'IMAGE')
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              value={currentItem.title || ''}
              onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
              placeholder="Event or program name"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              rows={2}
              value={currentItem.description || ''}
              onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
              placeholder="Brief description..."
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Media URL *</label>
            <Input
              value={
                (currentItem.type === 'VIDEO' ? currentItem.videoUrl : currentItem.imageUrl) || ''
              }
              onChange={(e) => {
                const url = e.target.value;
                if (currentItem.type === 'VIDEO') {
                  setCurrentItem({ ...currentItem, videoUrl: url });
                } else {
                  setCurrentItem({ ...currentItem, imageUrl: url });
                }
              }}
              placeholder="/images/gallery/photo.jpg or YouTube URL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Media Type *</label>
            <select
              value={currentItem.type || 'IMAGE'}
              onChange={(e) => {
                const newType = e.target.value as 'IMAGE' | 'VIDEO';
                const currentUrl =
                  currentItem.type === 'VIDEO' ? currentItem.videoUrl : currentItem.imageUrl;
                setCurrentItem({
                  ...currentItem,
                  type: newType,
                  imageUrl: newType === 'IMAGE' ? currentUrl : undefined,
                  videoUrl: newType === 'VIDEO' ? currentUrl : undefined,
                });
              }}
              className="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="IMAGE">Image</option>
              <option value="VIDEO">Video</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <Input
              value={currentItem.category || ''}
              onChange={(e) =>
                setCurrentItem({ ...currentItem, category: e.target.value || undefined })
              }
              placeholder="e.g., Events, Programs"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Display Order</label>
            <Input
              type="number"
              value={currentItem.order || 0}
              onChange={(e) => setCurrentItem({ ...currentItem, order: parseInt(e.target.value) })}
            />
          </div>

          <div className="flex items-center gap-3 pt-8">
            <input
              type="checkbox"
              id="isActive"
              checked={currentItem.isActive ?? true}
              onChange={(e) => setCurrentItem({ ...currentItem, isActive: e.target.checked })}
              className="w-4 h-4 text-primary rounded focus:ring-primary"
            />
            <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
              Active
            </label>
          </div>
        </div>
      </AdminDialog>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Media"
        description="Are you sure you want to delete this media item? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
