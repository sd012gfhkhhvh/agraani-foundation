'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Users } from 'lucide-react';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingCard } from '@/components/ui/loading';
import { Resource } from '@/lib/permissions';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '@/lib/actions';
import { showError, showPromiseToast } from '@/lib/toast-utils';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string | null;
  imageUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  linkedIn?: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function TeamMembersPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState<Partial<TeamMember>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  const permissions = usePermissions(Resource.TEAM_MEMBERS);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setIsLoading(true);
    const result = await getTeamMembers(false);
    if (result.success && result.data) {
      setMembers(result.data);
    } else {
      showError('Failed to load team members');
    }
    setIsLoading(false);
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
        await fetchMembers();
        setIsEditing(false);
        setCurrentMember({});
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    const result = await showPromiseToast(deleteTeamMember(id), {
      loading: 'Deleting...',
      success: 'Team member deleted!',
      error: 'Failed to delete team member',
    });

    if (result.success) {
      await fetchMembers();
    }
  };

  if (isLoading) {
    return <LoadingCard />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">Team Members</h1>
          <p className="text-muted-foreground  mt-1">Manage your organization's team and leadership</p>
        </div>
        <PermissionGate resource={Resource.TEAM_MEMBERS} action="create">
          <Button 
            onClick={() => { 
              setIsEditing(true); 
              setCurrentMember({ order: members.length, isActive: true }); 
            }}
            className="btn-gradient-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </PermissionGate>
      </div>

      {isEditing && (
        <Card className="border-2 border-primary/20 shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle>{currentMember.id ? 'Edit Team Member' : 'Add New Team Member'}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
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
                  onChange={(e) => setCurrentMember({ ...currentMember, order: parseInt(e.target.value) })}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={currentMember.isActive ?? true}
                  onChange={(e) => setCurrentMember({ ...currentMember, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <label className="text-sm font-medium">Active (visible on public website)</label>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button 
                onClick={handleSave} 
                disabled={isSaving || !currentMember.name || !currentMember.position || !permissions.canUpdate}
                className="btn-gradient-primary"
              >
                {isSaving ? 'Saving...' : 'Save Member'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => { setIsEditing(false); setCurrentMember({}); }}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Users}
              title="No team members yet"
              description="Add your first team member to get started"
              action={
                permissions.canCreate ? (
                  <Button onClick={() => setIsEditing(true)} className="btn-gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team Member
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          members.map((member) => (
            <Card key={member.id} className="card-hover group overflow-hidden">
              <div className="relative aspect-square overflow-hidden bg-linear-to-br from-primary/5 to-secondary/5">
                {member.imageUrl ? (
                  <img 
                    src={member.imageUrl} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {member.isActive ? (
                    <CheckCircle className="h-5 w-5 text-green-600 bg-white rounded-full" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 bg-white rounded-full" />
                  )}
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">{member.position}</p>
                {member.bio && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{member.bio}</p>
                )}

                <div className="flex gap-2 pt-3 border-t opacity-0 group-hover:opacity-100 transition-smooth">
                  <PermissionGate resource={Resource.TEAM_MEMBERS} action="update">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setCurrentMember(member); setIsEditing(true); }}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </PermissionGate>
                  <PermissionGate resource={Resource.TEAM_MEMBERS} action="delete">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </PermissionGate>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
