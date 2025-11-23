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
import { createObjective, deleteObjective, updateObjective } from '@/lib/actions';
import { useObjectives } from '@/lib/hooks/useAdminData';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { Resource } from '@/lib/permissions';
import { showError, showPromiseToast } from '@/lib/toast-utils';
import type { Objective } from '@/types/models';
import { Crosshair, Edit, Plus, Target, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function ObjectivesPage() {
  const { data: objectives = [], isLoading, refetch } = useObjectives();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentObjective, setCurrentObjective] = useState<Partial<Objective>>({});
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const permissions = usePermissions(Resource.OBJECTIVES);

  const handleOpenDialog = (objective?: Objective) => {
    if (objective) {
      setCurrentObjective(objective);
    } else {
      setCurrentObjective({ order: objectives.length, isActive: true });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!currentObjective.title || !currentObjective.description) {
      showError('Please fill in required fields');
      return;
    }

    setIsSaving(true);
    try {
      const promise = currentObjective.id
        ? updateObjective(currentObjective.id, {
            title: currentObjective.title,
            description: currentObjective.description,
            order: currentObjective.order,
            isActive: currentObjective.isActive,
          })
        : createObjective({
            title: currentObjective.title,
            description: currentObjective.description,
            order: currentObjective.order ?? objectives.length,
            isActive: currentObjective.isActive ?? true,
          });

      const result = await showPromiseToast(promise, {
        loading: currentObjective.id ? 'Updating objective...' : 'Creating objective...',
        success: currentObjective.id ? 'Objective updated!' : 'Objective created!',
        error: 'Failed to save objective',
      });

      if (result.success) {
        await refetch();
        setIsDialogOpen(false);
        setCurrentObjective({});
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
      const result = await showPromiseToast(deleteObjective(deleteId), {
        loading: 'Deleting objective...',
        success: 'Objective deleted!',
        error: 'Failed to delete objective',
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
        title="Strategic Objectives"
        description="Define your organization's mission and goals"
        action={
          <PermissionGate resource={Resource.OBJECTIVES} action="create">
            <Button onClick={() => handleOpenDialog()} className="btn-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Objective
            </Button>
          </PermissionGate>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {objectives.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Crosshair}
              title="No objectives yet"
              description="Define your strategic goals"
              action={
                permissions.canCreate ? (
                  <Button onClick={() => handleOpenDialog()} className="btn-gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Objective
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          objectives.map((objective) => (
            <AdminCard
              key={objective.id}
              title={objective.title}
              status={{ isActive: objective.isActive }}
              actions={
                <>
                  <PermissionGate resource={Resource.OBJECTIVES} action="update">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDialog(objective)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </PermissionGate>
                  <PermissionGate resource={Resource.OBJECTIVES} action="delete">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(objective.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </PermissionGate>
                </>
              }
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {objective.description}
                  </p>
                  <div className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md w-fit">
                    Order: {objective.order}
                  </div>
                </div>
              </div>
            </AdminCard>
          ))
        )}
      </div>

      <AdminDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={currentObjective.id ? 'Edit Objective' : 'Add New Objective'}
        description={
          currentObjective.id
            ? 'Update objective details below.'
            : 'Define a new strategic goal for the organization.'
        }
        onSave={handleSave}
        isLoading={isSaving}
        disabled={!currentObjective.title || !currentObjective.description}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              value={currentObjective.title || ''}
              onChange={(e) =>
                setCurrentObjective({
                  ...currentObjective,
                  title: e.target.value,
                })
              }
              placeholder="e.g., Empower 1000 women by 2025"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <Textarea
              rows={3}
              value={currentObjective.description || ''}
              onChange={(e) =>
                setCurrentObjective({
                  ...currentObjective,
                  description: e.target.value,
                })
              }
              placeholder="Explain how this objective contributes to your mission..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-2">Display Order</label>
              <Input
                type="number"
                value={currentObjective.order || 0}
                onChange={(e) =>
                  setCurrentObjective({
                    ...currentObjective,
                    order: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="flex items-center gap-3 pb-3">
              <input
                type="checkbox"
                id="isActive"
                checked={currentObjective.isActive ?? true}
                onChange={(e) =>
                  setCurrentObjective({
                    ...currentObjective,
                    isActive: e.target.checked,
                  })
                }
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
        title="Delete Objective"
        description="Are you sure you want to delete this objective? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
