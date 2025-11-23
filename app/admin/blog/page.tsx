'use client';

import { AdminCard } from '@/components/admin/AdminCard';
import { AdminDialog } from '@/components/admin/AdminDialog';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DeleteDialog } from '@/components/admin/DeleteDialog';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { LoadingCard } from '@/components/ui/loading';
import { Textarea } from '@/components/ui/textarea';
import { createBlogPost, deleteBlogPost, updateBlogPost } from '@/lib/actions';
import { useBlogPosts } from '@/lib/hooks/useAdminData';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { Resource } from '@/lib/permissions';
import { showError, showPromiseToast } from '@/lib/toast-utils';
import type { BlogPost } from '@/types/models';
import { Calendar, Edit, FileText, Plus, Trash2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Lazy-load RichTextEditor for better performance
const RichTextEditor = dynamic(
  () => import('@/components/RichTextEditor').then((mod) => ({ default: mod.RichTextEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        Loading editor...
      </div>
    ),
  }
);

export default function BlogPage() {
  // Use TanStack Query for data fetching
  const { data: posts = [], isLoading, refetch } = useBlogPosts();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({
    tags: [],
    isPublished: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const permissions = usePermissions(Resource.BLOG_POSTS);

  const handleOpenDialog = (post?: BlogPost) => {
    if (post) {
      setCurrentPost(post);
    } else {
      setCurrentPost({ tags: [], isPublished: false });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!currentPost.title || !currentPost.content || !currentPost.author) {
      showError('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const promise = currentPost.id
        ? updateBlogPost(currentPost.id, {
            title: currentPost.title,
            slug: currentPost.slug,
            excerpt: currentPost.excerpt ?? undefined,
            content: currentPost.content,
            imageUrl: currentPost.imageUrl ?? undefined,
            author: currentPost.author,
            category: currentPost.category ?? undefined,
            tags: currentPost.tags,
            isPublished: currentPost.isPublished,
          })
        : createBlogPost(currentPost as any);

      const result = await showPromiseToast(promise, {
        loading: currentPost.id ? 'Updating post...' : 'Creating post...',
        success: currentPost.id ? 'Post updated successfully!' : 'Post created successfully!',
        error: 'Failed to save post',
      });

      if (result.success) {
        await refetch(); // Refetch data after mutation
        setIsDialogOpen(false);
        setCurrentPost({ tags: [], isPublished: false });
      }
    } catch (error) {
      console.error('Error saving post:', error);
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
      const result = await showPromiseToast(deleteBlogPost(deleteId), {
        loading: 'Deleting post...',
        success: 'Post deleted successfully!',
        error: 'Failed to delete post',
      });

      if (result.success) {
        await refetch(); // Refetch data after mutation
        setIsDeleteDialogOpen(false);
        setDeleteId(null);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !currentPost.tags?.includes(tagInput.trim())) {
      setCurrentPost({
        ...currentPost,
        tags: [...(currentPost.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setCurrentPost({
      ...currentPost,
      tags: currentPost.tags?.filter((t) => t !== tag) || [],
    });
  };

  if (isLoading) {
    return <LoadingCard />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <AdminPageHeader
        title="Blog & News"
        description="Create and manage blog posts and news updates"
        action={
          <PermissionGate resource={Resource.BLOG_POSTS} action="create">
            <Button onClick={() => handleOpenDialog()} className="btn-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </PermissionGate>
        }
      />

      <div className="grid gap-6">
        {posts.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No blog posts yet"
            description="Create your first post to get started"
            action={
              permissions.canCreate ? (
                <Button onClick={() => handleOpenDialog()} className="btn-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              ) : undefined
            }
          />
        ) : (
          posts.map((post) => (
            <AdminCard
              key={post.id}
              title={post.title}
              subtitle={post.category || undefined}
              image={post.imageUrl}
              placeholderIcon={FileText}
              status={{
                isActive: post.isPublished,
                activeText: 'Published',
                inactiveText: 'Draft',
              }}
              actions={
                <>
                  <PermissionGate resource={Resource.BLOG_POSTS} action="update">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDialog(post)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </PermissionGate>
                  <PermissionGate resource={Resource.BLOG_POSTS} action="delete">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(post.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </PermissionGate>
                </>
              }
            >
              <div className="space-y-3">
                {post.excerpt && (
                  <p className="text-muted-foreground line-clamp-2 text-sm">{post.excerpt}</p>
                )}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="font-medium text-foreground">Author:</span> {post.author}
                  </span>
                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  {post.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px] h-5 px-1.5">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-[10px] self-center">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </>
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
        title={currentPost.id ? 'Edit Post' : 'Create New Post'}
        description={
          currentPost.id
            ? 'Update blog post content and settings.'
            : 'Write and publish a new blog post.'
        }
        onSave={handleSave}
        isLoading={isSaving}
        disabled={!currentPost.title || !currentPost.content || !currentPost.author}
        className="sm:max-w-[800px]"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              value={currentPost.title || ''}
              onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Slug (URL)</label>
            <Input
              value={currentPost.slug || ''}
              onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
              placeholder="auto-generated-from-title"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave blank to auto-generate from title
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Excerpt</label>
            <Textarea
              value={currentPost.excerpt || ''}
              onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
              placeholder="Brief summary (optional)"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
            <RichTextEditor
              content={currentPost.content || ''}
              onChange={(content) => setCurrentPost({ ...currentPost, content })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Featured Image URL</label>
            <Input
              value={currentPost.imageUrl || ''}
              onChange={(e) => setCurrentPost({ ...currentPost, imageUrl: e.target.value })}
              placeholder="/images/blog/post-image.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Author *</label>
              <Input
                value={currentPost.author || ''}
                onChange={(e) => setCurrentPost({ ...currentPost, author: e.target.value })}
                placeholder="Author name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Input
                value={currentPost.category || ''}
                onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                placeholder="e.g., Success Stories"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add a tag"
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-md bg-muted/10">
              {currentPost.tags?.length === 0 && (
                <span className="text-sm text-muted-foreground italic">No tags added</span>
              )}
              {currentPost.tags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-muted">
            <input
              type="checkbox"
              id="isPublished"
              checked={currentPost.isPublished || false}
              onChange={(e) => setCurrentPost({ ...currentPost, isPublished: e.target.checked })}
              className="w-4 h-4 text-primary rounded focus:ring-primary"
            />
            <label htmlFor="isPublished" className="text-sm font-medium cursor-pointer select-none">
              {currentPost.isPublished ? 'Published (visible on website)' : 'Draft (not published)'}
            </label>
          </div>
        </div>
      </AdminDialog>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
