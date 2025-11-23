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
import { createProgram, deleteProgram, updateProgram } from '@/lib/actions';
import { usePrograms } from '@/lib/hooks/useAdminData';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { Resource } from '@/lib/permissions';
import { showError, showPromiseToast } from '@/lib/toast-utils';
import type { Program } from '@/types/models';
import { Edit, Plus, Target, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function ProgramsPage() {
  const { data: programs = [], isLoading, refetch } = usePrograms();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<Partial<Program>>({});
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const permissions = usePermissions(Resource.PROGRAMS);

  const handleOpenDialog = (program?: Program) => {
    if (program) {
      setCurrentProgram(program);
    } else {
      setCurrentProgram({ order: programs.length, isActive: true });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!currentProgram.title || !currentProgram.description) {
      showError('Please fill in required fields');
      return;
    }

    setIsSaving(true);
    try {
      const promise = currentProgram.id
        ? updateProgram(currentProgram.id, {
            title: currentProgram.title,
            slug: currentProgram.slug,
            description: currentProgram.description,
            imageUrl: currentProgram.imageUrl ?? undefined,
            icon: currentProgram.icon ?? undefined,
            order: currentProgram.order,
            isActive: currentProgram.isActive,
          })
        : createProgram({
            title: currentProgram.title,
            slug: currentProgram.slug || '',
            description: currentProgram.description,
            imageUrl: currentProgram.imageUrl || '',
            icon: currentProgram.icon ?? undefined,
            order: currentProgram.order ?? programs.length,
            isActive: currentProgram.isActive ?? true,
          });

      const result = await showPromiseToast(promise, {
        loading: currentProgram.id ? 'Updating program...' : 'Creating program...',
        success: currentProgram.id ? 'Program updated!' : 'Program created!',
        error: 'Failed to save program',
      });

      if (result.success) {
        await refetch();
        setIsDialogOpen(false);
        setCurrentProgram({});
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
      const result = await showPromiseToast(deleteProgram(deleteId), {
        loading: 'Deleting program...',
        success: 'Program deleted!',
        error: 'Failed to delete program',
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

  if (isLoading) {
    return <LoadingCard />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <AdminPageHeader
        title="Programs & Activities"
        description="Manage your organization's programs and initiatives"
        action={
          <PermissionGate resource={Resource.PROGRAMS} action="create">
            <Button onClick={() => handleOpenDialog()} className="btn-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Program
            </Button>
          </PermissionGate>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {programs.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Target}
              title="No programs yet"
              description="Click 'Add Program' to create your first one"
              action={
                permissions.canCreate ? (
                  <Button onClick={() => handleOpenDialog()} className="btn-gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Program
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          programs.map((program) => (
            <AdminCard
              key={program.id}
              title={program.title}
              subtitle={program.description}
              image={program.imageUrl}
              placeholderIcon={Target}
              status={{ isActive: program.isActive }}
              actions={
                <>
                  <PermissionGate resource={Resource.PROGRAMS} action="update">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDialog(program)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </PermissionGate>
                  <PermissionGate resource={Resource.PROGRAMS} action="delete">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(program.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </PermissionGate>
                </>
              }
            >
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="bg-muted px-2 py-1 rounded-md">Order: {program.order}</span>
                {program.slug && (
                  <span className="bg-muted px-2 py-1 rounded-md font-mono">/{program.slug}</span>
                )}
                {program.icon && (
                  <span className="bg-muted px-2 py-1 rounded-md">Icon: {program.icon}</span>
                )}
              </div>
            </AdminCard>
          ))
        )}
      </div>

      <AdminDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={currentProgram.id ? 'Edit Program' : 'Add New Program'}
        description={
          currentProgram.id
            ? 'Make changes to the program details below.'
            : 'Fill in the details to create a new program.'
        }
        onSave={handleSave}
        isLoading={isSaving}
        disabled={!currentProgram.title || !currentProgram.description}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              value={currentProgram.title || ''}
              onChange={(e) => setCurrentProgram({ ...currentProgram, title: e.target.value })}
              placeholder="e.g., Women's Empowerment"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Slug</label>
            <Input
              value={currentProgram.slug || ''}
              onChange={(e) => setCurrentProgram({ ...currentProgram, slug: e.target.value })}
              placeholder="womens-empowerment"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">Auto-generated if left empty</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Icon (Optional)</label>
            <Input
              value={currentProgram.icon || ''}
              onChange={(e) => setCurrentProgram({ ...currentProgram, icon: e.target.value })}
              placeholder="e.g., Users, Heart, BookOpen"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Description *</label>
            <Textarea
              rows={4}
              value={currentProgram.description || ''}
              onChange={(e) =>
                setCurrentProgram({ ...currentProgram, description: e.target.value })
              }
              placeholder="Describe the program and its impact..."
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <Input
              value={currentProgram.imageUrl || ''}
              onChange={(e) => setCurrentProgram({ ...currentProgram, imageUrl: e.target.value })}
              placeholder="/images/programs/program.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Display Order</label>
            <Input
              type="number"
              value={currentProgram.order || 0}
              onChange={(e) =>
                setCurrentProgram({ ...currentProgram, order: parseInt(e.target.value) })
              }
            />
          </div>

          <div className="flex items-center gap-3 col-span-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={currentProgram.isActive ?? true}
              onChange={(e) => setCurrentProgram({ ...currentProgram, isActive: e.target.checked })}
              className="w-4 h-4 text-primary rounded focus:ring-primary"
            />
            <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
              Active (visible on public website)
            </label>
          </div>
        </div>
      </AdminDialog>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Program"
        description="Are you sure you want to delete this program? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
