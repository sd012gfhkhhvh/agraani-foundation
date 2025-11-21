'use client';

import { RichTextEditor } from '@/components/RichTextEditor';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { LoadingCard } from '@/components/ui/loading';
import { Textarea } from '@/components/ui/textarea';
import { createBlogPost, deleteBlogPost, getBlogPosts, updateBlogPost } from '@/lib/actions';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { Resource } from '@/lib/permissions';
import { showError, showPromiseToast } from '@/lib/toast-utils';
import { Calendar, Edit, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  imageUrl?: string | null;
  author: string;
  category?: string | null;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({
    tags: [],
    isPublished: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const permissions = usePermissions(Resource.BLOG_POSTS);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    const result = await getBlogPosts(true);
    if (result.success && result.data) {
      setPosts(result.data);
    } else {
      showError('Failed to load blog posts');
    }
    setIsLoading(false);
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
        await fetchPosts();
        setIsEditing(false);
        setCurrentPost({ tags: [], isPublished: false });
      }
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const promise = deleteBlogPost(id);
    const result = await showPromiseToast(promise, {
      loading: 'Deleting post...',
      success: 'Post deleted successfully!',
      error: 'Failed to delete post',
    });

    if (result.success) {
      await fetchPosts();
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">Blog & News</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage blog posts and news updates
          </p>
        </div>
        <PermissionGate resource={Resource.BLOG_POSTS} action="create">
          <Button
            onClick={() => {
              setIsEditing(true);
              setCurrentPost({ tags: [], isPublished: false });
            }}
            className="btn-gradient-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </PermissionGate>
      </div>

      {isEditing && (
        <Card className="border-2 border-primary/20 shadow-lg animate-fade-in">
          <CardHeader className="bg-linear-to-r from-primary/5 to-transparent">
            <CardTitle>{currentPost.id ? 'Edit Post' : 'Create New Post'}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
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
              <div className="flex flex-wrap gap-2">
                {currentPost.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <input
                type="checkbox"
                checked={currentPost.isPublished || false}
                onChange={(e) => setCurrentPost({ ...currentPost, isPublished: e.target.checked })}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
              <label className="text-sm font-medium">
                {currentPost.isPublished
                  ? 'Published (visible on website)'
                  : 'Draft (not published)'}
              </label>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={handleSave}
                disabled={isSaving || !permissions.canUpdate}
                className="btn-gradient-primary"
              >
                {isSaving ? 'Saving...' : currentPost.id ? 'Update Post' : 'Create Post'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentPost({ tags: [], isPublished: false });
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts List */}
      <div className="grid gap-4">
        {posts.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No blog posts yet"
            description="Create your first post to get started"
            action={
              permissions.canCreate ? (
                <Button onClick={() => setIsEditing(true)} className="btn-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              ) : undefined
            }
          />
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{post.title}</h3>
                      <Badge variant={post.isPublished ? 'default' : 'secondary'}>
                        {post.isPublished ? (
                          <>
                            <Eye className="h-3 w-3 mr-1" /> Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" /> Draft
                          </>
                        )}
                      </Badge>
                      {post.category && <Badge variant="outline">{post.category}</Badge>}
                    </div>

                    {post.excerpt && (
                      <p className="text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>By {post.author}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      {post.tags.length > 0 && (
                        <>
                          <span>•</span>
                          <div className="flex gap-1">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <PermissionGate resource={Resource.BLOG_POSTS} action="update">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCurrentPost(post);
                          setIsEditing(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </PermissionGate>
                    <PermissionGate resource={Resource.BLOG_POSTS} action="delete">
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(post.id)}>
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
