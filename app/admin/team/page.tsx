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
import { createTeamMember, deleteTeamMember, updateTeamMember } from '@/lib/actions';
import { useTeamMembers } from '@/lib/hooks/useAdminData';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { Resource } from '@/lib/permissions';
import { showError, showPromiseToast } from '@/lib/toast-utils';
import type { TeamMember } from '@/types/models';
import { Edit, Plus, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

export default function TeamMembersPage() {
  const { data: members = [], isLoading, refetch } = useTeamMembers();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<Partial<TeamMember>>({});
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const permissions = usePermissions(Resource.TEAM_MEMBERS);

  const handleOpenDialog = (member?: TeamMember) => {
    if (member) {
      setCurrentMember(member);
    } else {
      setCurrentMember({ order: members.length, isActive: true });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!currentMember.name || !currentMember.position) {
      showError('Please fill in required fields');
      return;
    }

    setIsSaving(true);
    try {
      const promise = currentMember.id
        ? updateTeamMember(currentMember.id, {
            name: currentMember.name,
            position: currentMember.position,
            bio: currentMember.bio ?? undefined,
            imageUrl: currentMember.imageUrl ?? undefined,
            email: currentMember.email ?? undefined,
            phone: currentMember.phone ?? undefined,
            linkedIn: currentMember.linkedIn ?? undefined,
            order: currentMember.order,
            isActive: currentMember.isActive,
          })
        : createTeamMember({
            name: currentMember.name,
            position: currentMember.position,
            bio: currentMember.bio ?? undefined,
            imageUrl: currentMember.imageUrl ?? undefined,
            email: currentMember.email ?? undefined,
            phone: currentMember.phone ?? undefined,
            linkedIn: currentMember.linkedIn ?? undefined,
            order: currentMember.order ?? members.length,
            isActive: currentMember.isActive ?? true,
          });

      const result = await showPromiseToast(promise, {
        loading: currentMember.id ? 'Updating...' : 'Creating...',
        success: currentMember.id ? 'Team member updated!' : 'Team member added!',
        error: 'Failed to save team member',
      });

      if (result.success) {
        await refetch();
        setIsDialogOpen(false);
        setCurrentMember({});
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
      const result = await showPromiseToast(deleteTeamMember(deleteId), {
        loading: 'Deleting...',
        success: 'Team member deleted!',
        error: 'Failed to delete team member',
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
        title="Team Members"
        description="Manage your organization's team and leadership"
        action={
          <PermissionGate resource={Resource.TEAM_MEMBERS} action="create">
            <Button onClick={() => handleOpenDialog()} className="btn-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </PermissionGate>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {members.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Users}
              title="No team members yet"
              description="Add your first team member to get started"
              action={
                permissions.canCreate ? (
                  <Button onClick={() => handleOpenDialog()} className="btn-gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team Member
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          members.map((member) => (
            <AdminCard
              key={member.id}
              title={member.name}
              subtitle={member.position}
              image={member.imageUrl}
              placeholderIcon={Users}
              status={{ isActive: member.isActive }}
              actions={
                <>
                  <PermissionGate resource={Resource.TEAM_MEMBERS} action="update">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDialog(member)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </PermissionGate>
                  <PermissionGate resource={Resource.TEAM_MEMBERS} action="delete">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(member.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </PermissionGate>
                </>
              }
            >
              <div className="space-y-2 text-sm text-muted-foreground">
                {member.bio && <p className="line-clamp-2">{member.bio}</p>}
                <div className="flex flex-wrap gap-2 text-xs">
                  {member.email && (
                    <span className="bg-muted px-2 py-1 rounded-md">{member.email}</span>
                  )}
                  {member.phone && (
                    <span className="bg-muted px-2 py-1 rounded-md">{member.phone}</span>
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
        title={currentMember.id ? 'Edit Team Member' : 'Add New Team Member'}
        description={
          currentMember.id
            ? 'Update team member details below.'
            : 'Enter details for the new team member.'
        }
        onSave={handleSave}
        isLoading={isSaving}
        disabled={!currentMember.name || !currentMember.position}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <Input
              value={currentMember.name || ''}
              onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
              placeholder="Full Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Position *</label>
            <Input
              value={currentMember.position || ''}
              onChange={(e) => setCurrentMember({ ...currentMember, position: e.target.value })}
              placeholder="e.g., Executive Director"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Bio</label>
            <Textarea
              rows={3}
              value={currentMember.bio || ''}
              onChange={(e) => setCurrentMember({ ...currentMember, bio: e.target.value })}
              placeholder="Brief background and expertise..."
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Profile Image URL</label>
            <Input
              value={currentMember.imageUrl || ''}
              onChange={(e) => setCurrentMember({ ...currentMember, imageUrl: e.target.value })}
              placeholder="/images/team/member.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={currentMember.email || ''}
              onChange={(e) => setCurrentMember({ ...currentMember, email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <Input
              value={currentMember.phone || ''}
              onChange={(e) => setCurrentMember({ ...currentMember, phone: e.target.value })}
              placeholder="+91 XXX XXX XXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn Profile</label>
            <Input
              value={currentMember.linkedIn || ''}
              onChange={(e) => setCurrentMember({ ...currentMember, linkedIn: e.target.value })}
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Display Order</label>
            <Input
              type="number"
              value={currentMember.order || 0}
              onChange={(e) =>
                setCurrentMember({ ...currentMember, order: parseInt(e.target.value) })
              }
            />
          </div>

          <div className="flex items-center gap-3 col-span-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={currentMember.isActive ?? true}
              onChange={(e) => setCurrentMember({ ...currentMember, isActive: e.target.checked })}
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
        title="Delete Team Member"
        description="Are you sure you want to delete this team member? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
