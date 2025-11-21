'use client';

import { PermissionGate } from '@/components/admin/PermissionGate';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { LoadingCard } from '@/components/ui/loading';
import { Textarea } from '@/components/ui/textarea';
import {
  createGalleryItem,
  deleteGalleryItem,
  getGalleryItems,
  updateGalleryItem,
} from '@/lib/actions';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { Resource } from '@/lib/permissions';
import { showError, showPromiseToast } from '@/lib/toast-utils';
import { CheckCircle, Edit, Image as ImageIcon, Plus, Trash2, Video, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  type: 'IMAGE' | 'VIDEO';
  category?: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<GalleryItem>>({});
  const [filter, setFilter] = useState<string>('all');
  const [isSaving, setIsSaving] = useState(false);

  const permissions = usePermissions(Resource.GALLERY);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    const result = await getGalleryItems();
    if (result.success && result.data) {
      setItems(result.data);
    } else {
      showError('Failed to load gallery items');
    }
    setIsLoading(false);
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
        await fetchItems();
        setIsEditing(false);
        setCurrentItem({});
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const result = await showPromiseToast(deleteGalleryItem(id), {
      loading: 'Deleting item...',
      success: 'Item deleted!',
      error: 'Failed to delete item',
    });

    if (result.success) {
      await fetchItems();
    }
  };

  const categories = Array.from(new Set(items.map((item) => item.category).filter(Boolean)));
  const filteredItems = filter === 'all' ? items : items.filter((item) => item.category === filter);

  if (isLoading) {
    return <LoadingCard />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">Media Gallery</h1>
          <p className="text-muted-foreground mt-1">
            Manage photos and videos from events and programs
          </p>
        </div>
        <PermissionGate resource={Resource.GALLERY} action="create">
          <Button
            onClick={() => {
              setIsEditing(true);
              setCurrentItem({ order: items.length, isActive: true, type: 'IMAGE' });
            }}
            className="btn-gradient-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Media
          </Button>
        </PermissionGate>
      </div>

      {isEditing && (
        <Card className="border-2 border-primary/20 shadow-lg animate-fade-in">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">
              {currentItem.id ? 'Edit Media' : 'Add New Media'}
            </h3>

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
                    (currentItem.type === 'VIDEO' ? currentItem.videoUrl : currentItem.imageUrl) ||
                    ''
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
                  className="w-full px-3 py-2 border rounded-md bg-background"
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
                  placeholder="e.g., Events, Programs, Activities"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Display Order</label>
                <Input
                  type="number"
                  value={currentItem.order || 0}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, order: parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={currentItem.isActive ?? true}
                  onChange={(e) => setCurrentItem({ ...currentItem, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary rounded"
                />
                <label className="text-sm font-medium">Active</label>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={handleSave}
                disabled={
                  isSaving ||
                  !currentItem.title ||
                  (!currentItem.imageUrl && !currentItem.videoUrl) ||
                  !permissions.canUpdate
                }
                className="btn-gradient-primary"
              >
                {isSaving ? 'Saving...' : 'Save Media'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentItem({});
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={ImageIcon}
              title="No media items yet"
              description="Upload your first photo or video"
              action={
                permissions.canCreate ? (
                  <Button onClick={() => setIsEditing(true)} className="btn-gradient-primary">
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
              <Card key={item.id} className="card-hover group overflow-hidden">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {item.type === 'IMAGE' && mediaUrl ? (
                    <img
                      src={mediaUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/10 to-secondary/10">
                      <Video className="h-12 w-12 text-primary" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {item.isActive ? (
                      <CheckCircle className="h-5 w-5 text-green-600 bg-white rounded-full" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-smooth">
                    <div className="flex gap-2">
                      <PermissionGate resource={Resource.GALLERY} action="update">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setCurrentItem(item);
                            setIsEditing(true);
                          }}
                          className="flex-1"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </PermissionGate>
                      <PermissionGate resource={Resource.GALLERY} action="delete">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </PermissionGate>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
