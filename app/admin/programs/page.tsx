'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, GripVertical, CheckCircle, XCircle, Target } from 'lucide-react';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingCard } from '@/components/ui/loading';
import { Resource } from '@/lib/permissions';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { getPrograms, createProgram, updateProgram, deleteProgram } from '@/lib/actions';
import { showError, showPromiseToast } from '@/lib/toast-utils';

interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  icon?: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<Partial<Program>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  const permissions = usePermissions(Resource.PROGRAMS);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setIsLoading(true);
    const result = await getPrograms();
    if (result.success && result.data) {
      setPrograms(result.data);
    } else {
      showError('Failed to load programs');
    }
    setIsLoading(false);
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
        await fetchPrograms();
        setIsEditing(false);
        setCurrentProgram({});
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;

    const result = await showPromiseToast(deleteProgram(id), {
      loading: 'Deleting program...',
      success: 'Program deleted!',
      error: 'Failed to delete program',
    });

    if (result.success) {
      await fetchPrograms();
    }
  };

  if (isLoading) {
    return <LoadingCard />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">Programs & Activities</h1>
          <p className="text-muted-foreground mt-1">Manage your organization's programs and initiatives</p>
        </div>
        <PermissionGate resource={Resource.PROGRAMS} action="create">
          <Button 
            onClick={() => { 
              setIsEditing(true); 
              setCurrentProgram({ order: programs.length, isActive: true }); 
            }}
            className="btn-gradient-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Program
          </Button>
        </PermissionGate>
      </div>

      {isEditing && (
        <Card className="border-2 border-primary/20 shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle>
              {currentProgram.id ? 'Edit Program' : 'Add New Program'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
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
                  onChange={(e) => setCurrentProgram({ ...currentProgram, description: e.target.value })}
                  placeholder="Describe the program and its impact..."
                />
              </div>

              <div>
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
                  onChange={(e) => setCurrentProgram({ ...currentProgram, order: parseInt(e.target.value) })}
                />
              </div>

              <div className="flex items-center gap-3 col-span-2">
                <input
                  type="checkbox"
                  checked={currentProgram.isActive ?? true}
                  onChange={(e) => setCurrentProgram({ ...currentProgram, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <label className="text-sm font-medium">Active (visible on public website)</label>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button 
                onClick={handleSave} 
                disabled={isSaving || !currentProgram.title || !permissions.canUpdate}
                className="btn-gradient-primary"
              >
                {isSaving ? 'Saving...' : 'Save Program'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => { setIsEditing(false); setCurrentProgram({}); }}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {programs.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No programs yet"
            description="Click 'Add Program' to create your first one"
            action={
              permissions.canCreate ? (
                <Button onClick={() => setIsEditing(true)} className="btn-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Program
                </Button>
              ) : undefined
            }
          />
        ) : (
          programs.map((program) => (
            <Card key={program.id} className="card-hover group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="cursor-grab text-muted-foreground opacity-0 group-hover:opacity-100 transition-smooth">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{program.title}</h3>
                        {program.isActive ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{program.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Order: {program.order}</span>
                        {program.slug && <span>Slug: {program.slug}</span>}
                        {program.icon && <span>Icon: {program.icon}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <PermissionGate resource={Resource.PROGRAMS} action="update">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setCurrentProgram(program); setIsEditing(true); }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </PermissionGate>
                    <PermissionGate resource={Resource.PROGRAMS} action="delete">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(program.id)}
                      >
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
