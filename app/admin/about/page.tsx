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
  createAboutContent,
  deleteAboutContent,
  getAboutContent,
  updateAboutContent,
} from '@/lib/actions';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { Resource } from '@/lib/permissions';
import { showError, showPromiseToast } from '@/lib/toast-utils';
import { Edit, FileText, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AboutSection {
  id: string;
  section: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function AboutContentPage() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<Partial<AboutSection>>({});
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const permissions = usePermissions(Resource.ABOUT_CONTENT);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setIsLoading(true);
    const result = await getAboutContent();
    if (result.success && result.data) {
      setSections(result.data);
    } else {
      showError('Failed to load about content');
    }
    setIsLoading(false);
  };

  const handleOpenDialog = (section?: AboutSection) => {
    if (section) {
      setCurrentSection(section);
    } else {
      setCurrentSection({ section: '', title: '', content: '', imageUrl: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!currentSection.section || !currentSection.title || !currentSection.content) {
      showError('Please fill in required fields');
      return;
    }

    setIsSaving(true);
    try {
      const promise = currentSection.id
        ? updateAboutContent(currentSection.id, {
            title: currentSection.title,
            content: currentSection.content,
            imageUrl: currentSection.imageUrl ?? undefined,
          })
        : createAboutContent({
            section: currentSection.section,
            title: currentSection.title,
            content: currentSection.content,
            imageUrl: currentSection.imageUrl || undefined,
          });

      const result = await showPromiseToast(promise, {
        loading: currentSection.id ? 'Updating content...' : 'Creating section...',
        success: currentSection.id ? 'Content updated!' : 'Section created!',
        error: 'Failed to save content',
      });

      if (result.success) {
        await fetchSections();
        setIsDialogOpen(false);
        setCurrentSection({});
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
      const result = await showPromiseToast(deleteAboutContent(deleteId), {
        loading: 'Deleting section...',
        success: 'Section deleted!',
        error: 'Failed to delete section',
      });

      if (result.success) {
        await fetchSections();
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
        title="About Content"
        description="Manage your organization's about page content"
        action={
          <PermissionGate resource={Resource.ABOUT_CONTENT} action="create">
            <Button onClick={() => handleOpenDialog()} className="btn-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </PermissionGate>
        }
      />

      <div className="grid grid-cols-1 gap-6">
        {sections.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No content found"
            description="Click 'Add Section' to create your first section"
            action={
              permissions.canCreate ? (
                <Button onClick={() => handleOpenDialog()} className="btn-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              ) : undefined
            }
          />
        ) : (
          sections.map((section) => (
            <AdminCard
              key={section.id}
              title={section.title}
              subtitle={section.content}
              image={section.imageUrl}
              actions={
                <>
                  <PermissionGate resource={Resource.ABOUT_CONTENT} action="update">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDialog(section)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </PermissionGate>
                  <PermissionGate resource={Resource.ABOUT_CONTENT} action="delete">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(section.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </PermissionGate>
                </>
              }
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="bg-muted px-2 py-1 rounded-md font-mono">
                  ID: {section.section}
                </span>
                <span className="bg-muted px-2 py-1 rounded-md">
                  Last updated: {new Date(section.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </AdminCard>
          ))
        )}
      </div>

      <AdminDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={currentSection.id ? 'Edit Section' : 'Add New Section'}
        description={
          currentSection.id
            ? `Edit content for section: ${currentSection.section}`
            : 'Create a new section for the about page.'
        }
        onSave={handleSave}
        isLoading={isSaving}
        disabled={!currentSection.section || !currentSection.title || !currentSection.content}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Section ID *</label>
            <Input
              value={currentSection.section || ''}
              onChange={(e) => setCurrentSection({ ...currentSection, section: e.target.value })}
              placeholder="e.g., our-history"
              disabled={!!currentSection.id}
              className={currentSection.id ? 'bg-muted' : ''}
            />
            {!currentSection.id && (
              <p className="text-xs text-muted-foreground mt-1">
                Unique identifier for this section (no spaces, lowercase)
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              value={currentSection.title || ''}
              onChange={(e) => setCurrentSection({ ...currentSection, title: e.target.value })}
              placeholder="Section Title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
            <Textarea
              rows={8}
              value={currentSection.content || ''}
              onChange={(e) => setCurrentSection({ ...currentSection, content: e.target.value })}
              placeholder="Section content..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Image URL (Optional)</label>
            <Input
              value={currentSection.imageUrl || ''}
              onChange={(e) => setCurrentSection({ ...currentSection, imageUrl: e.target.value })}
              placeholder="/images/about/section.jpg"
            />
          </div>
        </div>
      </AdminDialog>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Section"
        description="Are you sure you want to delete this section? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
