'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, User, Edit2, Clock, AlertTriangle } from 'lucide-react';
import { RoleBadge } from '@/components/admin/RoleBadge';
import { LoadingCard } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { UserRole } from '@prisma/client';
import { getUsers, updateUserRole } from '@/lib/actions';
import { showSuccess, showError, showPromiseToast } from '@/lib/toast-utils';
import { useCanManageUsers } from '@/lib/hooks/usePermissions';
import { useRouter } from 'next/navigation';

interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole | null;
  image?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.VIEWER);
  
  const { canManageUsers, isLoading: permCheck } = useCanManageUsers();
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  // Redirect if user cannot manage users
  useEffect(() => {
    if (!permCheck && !isLoading && !canManageUsers) {
      router.push('/admin/unauthorized');
    }
  }, [canManageUsers, permCheck, isLoading, router]);

  const fetchUsers = async () => {
    setIsLoading(true);
    const result = await getUsers();
    if (result.success && result.data) {
      setUsers(result.data);
    } else {
      if (result.error?.statusCode === 403) {
        router.push('/admin/unauthorized');
      } else {
        showError('Failed to load users');
      }
    }
    setIsLoading(false);
  };

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    const promise = updateUserRole(userId, newRole);
    const result = await showPromiseToast(promise, {
      loading: 'Updating user role...',
      success: 'User role updated successfully!',
      error: 'Failed to update user role',
    });

    if (result.success) {
      await fetchUsers();
      setEditingUser(null);
    }
  };

  if (isLoading || permCheck) {
    return <LoadingCard />;
  }

  if (!canManageUsers) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Access Denied"
        description="Only Super Administrators can manage users."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gradient-primary">User Management</h1>
        <p className="text-muted-foreground mt-1">Manage user roles and permissions (Super Admin Only)</p>
      </div>

      {users.length === 0 ? (
        <EmptyState 
          icon={User}
          title="No users found"
          description="No users have been created yet."
        />
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {user.image ? (
                        <img 
                          src={user.image} 
                          alt={user.name || 'User'} 
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold">{user.name || 'Unnamed User'}</h3>
                      <p className="text-sm text-muted-foreground">{user.email || 'No email'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {editingUser === user.id ? (
                          <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                            className="text-xs border rounded px-2 py-1 bg-background"
                          >
                            <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                            <option value={UserRole.CONTENT_ADMIN}>Content Admin</option>
                            <option value={UserRole.EDITOR}>Editor</option>
                            <option value={UserRole.VIEWER}>Viewer</option>
                          </select>
                        ) : (
                          user.role && <RoleBadge role={user.role} />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground text-right">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {editingUser === user.id ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateRole(user.id, selectedRole)}
                          className="btn-gradient-primary"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingUser(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingUser(user.id);
                          setSelectedRole(user.role || UserRole.VIEWER);
                        }}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Change Role
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <Badge className="bg-purple-100 text-purple-800 border-purple-300 mb-2">
                <Shield className="h-3 w-3 mr-1" />
                Super Admin
              </Badge>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Full system access</li>
                <li>• User management</li>
                <li>• All content operations</li>
              </ul>
            </div>
            <div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-300 mb-2">
                <Shield className="h-3 w-3 mr-1" />
                Content Admin
              </Badge>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Manage all content</li>
                <li>• Create, edit & delete</li>
                <li>• Publish content</li>
              </ul>
            </div>
            <div>
              <Badge className="bg-green-100 text-green-800 border-green-300 mb-2">
                <Shield className="h-3 w-3 mr-1" />
                Editor
              </Badge>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Create & edit content</li>
                <li>• Publish content</li>
                <li>• Cannot delete</li>
              </ul>
            </div>
            <div>
              <Badge className="bg-gray-100 text-gray-800 border-gray-300 mb-2">
                <Shield className="h-3 w-3 mr-1" />
                Viewer
              </Badge>
              <ul className="space-y-1 text-muted-foreground">
                <li>• View dashboard</li>
                <li>• View content</li>
                <li>• No edit/delete rights</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
