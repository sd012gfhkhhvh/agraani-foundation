'use client';

import { AdminCard } from '@/components/admin/AdminCard';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { RoleBadge } from '@/components/admin/RoleBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingCard } from '@/components/ui/loading';
import { getUsers, updateUserRole } from '@/lib/actions';
import { useCanManageUsers } from '@/lib/hooks/usePermissions';
import { showError, showPromiseToast } from '@/lib/toast-utils';
import { UserRole } from '@prisma/client';
import { AlertTriangle, Clock, Edit2, Shield, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
    <div className="space-y-8 animate-fade-in">
      <AdminPageHeader
        title="User Management"
        description="Manage user roles and permissions (Super Admin Only)"
      />

      {users.length === 0 ? (
        <EmptyState
          icon={User}
          title="No users found"
          description="No users have been created yet."
        />
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <AdminCard
              key={user.id}
              title={user.name || 'Unnamed User'}
              subtitle={user.email || 'No email'}
              image={user.image}
              actions={
                editingUser === user.id ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUpdateRole(user.id, selectedRole)}
                      className="btn-gradient-primary"
                    >
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingUser(null)}>
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
                )
              }
            >
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Current Role:</span>
                  {editingUser === user.id ? (
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                      className="text-sm border rounded px-2 py-1 bg-background focus:ring-2 focus:ring-primary focus:outline-none"
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
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Card className="bg-muted/30 border-muted/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Role Permissions Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div className="space-y-2">
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100 mb-1">
                <Shield className="h-3 w-3 mr-1" />
                Super Admin
              </Badge>
              <ul className="space-y-1.5 text-muted-foreground text-xs">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-purple-400" /> Full system access
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-purple-400" /> User management
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-purple-400" /> All content operations
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 mb-1">
                <Shield className="h-3 w-3 mr-1" />
                Content Admin
              </Badge>
              <ul className="space-y-1.5 text-muted-foreground text-xs">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-blue-400" /> Manage all content
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-blue-400" /> Create, edit & delete
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-blue-400" /> Publish content
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 mb-1">
                <Shield className="h-3 w-3 mr-1" />
                Editor
              </Badge>
              <ul className="space-y-1.5 text-muted-foreground text-xs">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-green-400" /> Create & edit content
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-green-400" /> Publish content
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-green-400" /> Cannot delete
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <Badge className="bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100 mb-1">
                <Shield className="h-3 w-3 mr-1" />
                Viewer
              </Badge>
              <ul className="space-y-1.5 text-muted-foreground text-xs">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gray-400" /> View dashboard
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gray-400" /> View content
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gray-400" /> No edit/delete rights
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
