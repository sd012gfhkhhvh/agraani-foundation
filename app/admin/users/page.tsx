'use client';

import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { RoleBadge } from '@/components/admin/RoleBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingCard } from '@/components/ui/loading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { updateUserRole } from '@/lib/actions';
import { useUsers } from '@/lib/hooks/useAdminData';
import { useCanManageUsers } from '@/lib/hooks/usePermissions';
import { showPromiseToast } from '@/lib/toast-utils';
import { UserRole } from '@prisma/client';
import { AlertTriangle, Clock, Edit2, Shield, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UsersPage() {
  const { data: users = [], isLoading, refetch } = useUsers();
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.VIEWER);

  const { canManageUsers, isLoading: permCheck } = useCanManageUsers();
  const router = useRouter();

  // Redirect if user cannot manage users
  useEffect(() => {
    if (!permCheck && !isLoading && !canManageUsers) {
      router.push('/admin/unauthorized');
    }
  }, [canManageUsers, permCheck, isLoading, router]);

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    const promise = updateUserRole(userId, { role: newRole });
    const result = await showPromiseToast(promise, {
      loading: 'Updating user role...',
      success: 'User role updated successfully!',
      error: 'Failed to update user role',
    });

    if (result.success) {
      await refetch();
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
          icon={UserIcon}
          title="No users found"
          description="No users have been created yet."
        />
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <Image
                          src={user.image}
                          width={36}
                          height={36}
                          alt={user.name || 'User'}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                          <UserIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{user.name || 'Unnamed User'}</span>
                        <span className="text-xs text-muted-foreground">
                          {user.email || 'No email'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {editingUser === user.id ? (
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                        className="text-sm border rounded px-2 py-1 bg-background focus:ring-2 focus:ring-primary focus:outline-none w-full max-w-[140px]"
                      >
                        <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                        <option value={UserRole.CONTENT_ADMIN}>Content Admin</option>
                        <option value={UserRole.EDITOR}>Editor</option>
                        <option value={UserRole.VIEWER}>Viewer</option>
                      </select>
                    ) : (
                      user.role && <RoleBadge role={user.role} />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {editingUser === user.id ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateRole(user.id, selectedRole)}
                          className="btn-gradient-primary h-8 px-3"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingUser(null)}
                          className="h-8 px-3"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingUser(user.id);
                          setSelectedRole(user.role || UserRole.VIEWER);
                        }}
                        className="h-8"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                  <span className="w-1 h-1 rounded-full bg-blue-400" /> Content creation and editing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-blue-400" /> Content approval
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-blue-400" /> Content deletion
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
                  <span className="w-1 h-1 rounded-full bg-green-400" /> Content creation and
                  editing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-green-400" /> Content approval
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
                  <span className="w-1 h-1 rounded-full bg-gray-400" /> Content viewing
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
