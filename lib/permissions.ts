import { UserRole } from '@prisma/client';

/**
 * Permission system for Role-Based Access Control (RBAC)
 */

// Define all resources in the system
export enum Resource {
  HERO_BANNERS = 'HERO_BANNERS',
  ABOUT_CONTENT = 'ABOUT_CONTENT',
  PROGRAMS = 'PROGRAMS',
  OBJECTIVES = 'OBJECTIVES',
  TEAM_MEMBERS = 'TEAM_MEMBERS',
  GALLERY = 'GALLERY',
  BLOG_POSTS = 'BLOG_POSTS',
  LEGAL_DOCUMENTS = 'LEGAL_DOCUMENTS',
  CONTACT_SUBMISSIONS = 'CONTACT_SUBMISSIONS',
  USERS = 'USERS',
  DASHBOARD = 'DASHBOARD',
}

// Define all possible actions
export enum Action {
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  MANAGE_ROLES = 'MANAGE_ROLES',
}

// Permission matrix: Role -> Resource -> Actions[]
const PERMISSIONS: Record<UserRole, Partial<Record<Resource, Action[]>>> = {
  [UserRole.SUPER_ADMIN]: {
    // Super Admin has all permissions on all resources
    [Resource.HERO_BANNERS]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE],
    [Resource.ABOUT_CONTENT]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE],
    [Resource.PROGRAMS]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE],
    [Resource.OBJECTIVES]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE],
    [Resource.TEAM_MEMBERS]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE],
    [Resource.GALLERY]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE],
    [Resource.BLOG_POSTS]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE],
    [Resource.LEGAL_DOCUMENTS]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE],
    [Resource.CONTACT_SUBMISSIONS]: [Action.VIEW, Action.UPDATE, Action.DELETE],
    [Resource.USERS]: [Action.VIEW, Action.UPDATE, Action.MANAGE_ROLES],
    [Resource.DASHBOARD]: [Action.VIEW],
  },

  [UserRole.CONTENT_ADMIN]: {
    // Content Admin can manage all content but not users
    [Resource.HERO_BANNERS]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE],
    [Resource.ABOUT_CONTENT]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE],
    [Resource.PROGRAMS]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE],
    [Resource.OBJECTIVES]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE],
    [Resource.TEAM_MEMBERS]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE],
    [Resource.GALLERY]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE],
    [Resource.BLOG_POSTS]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE],
    [Resource.LEGAL_DOCUMENTS]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE],
    [Resource.CONTACT_SUBMISSIONS]: [Action.VIEW, Action.UPDATE, Action.DELETE],
    [Resource.DASHBOARD]: [Action.VIEW],
  },

  [UserRole.EDITOR]: {
    // Editor can create and update content but not delete
    [Resource.HERO_BANNERS]: [Action.VIEW, Action.CREATE, Action.UPDATE],
    [Resource.ABOUT_CONTENT]: [Action.VIEW, Action.CREATE, Action.UPDATE],
    [Resource.PROGRAMS]: [Action.VIEW, Action.CREATE, Action.UPDATE],
    [Resource.OBJECTIVES]: [Action.VIEW, Action.CREATE, Action.UPDATE],
    [Resource.TEAM_MEMBERS]: [Action.VIEW, Action.CREATE, Action.UPDATE],
    [Resource.GALLERY]: [Action.VIEW, Action.CREATE, Action.UPDATE],
    [Resource.BLOG_POSTS]: [Action.VIEW, Action.CREATE, Action.UPDATE],
    [Resource.LEGAL_DOCUMENTS]: [Action.VIEW, Action.CREATE, Action.UPDATE],
    [Resource.CONTACT_SUBMISSIONS]: [Action.VIEW],
    [Resource.DASHBOARD]: [Action.VIEW],
  },

  [UserRole.VIEWER]: {
    // Viewer can only view, no modifications
    [Resource.HERO_BANNERS]: [Action.VIEW],
    [Resource.ABOUT_CONTENT]: [Action.VIEW],
    [Resource.PROGRAMS]: [Action.VIEW],
    [Resource.OBJECTIVES]: [Action.VIEW],
    [Resource.TEAM_MEMBERS]: [Action.VIEW],
    [Resource.GALLERY]: [Action.VIEW],
    [Resource.BLOG_POSTS]: [Action.VIEW],
    [Resource.LEGAL_DOCUMENTS]: [Action.VIEW],
    [Resource.CONTACT_SUBMISSIONS]: [Action.VIEW],
    [Resource.DASHBOARD]: [Action.VIEW],
  },
};

/**
 * Get human-readable action verb
 */
function getActionVerb(action: Action): string {
  const verbs: Record<Action, string> = {
    [Action.VIEW]: 'view',
    [Action.CREATE]: 'create',
    [Action.UPDATE]: 'update',
    [Action.DELETE]: 'delete',
    [Action.MANAGE_ROLES]: 'manage roles for',
  };
  return verbs[action];
}

/**
 * Get human-readable resource name
 */
function getResourceName(resource: Resource): string {
  const names: Record<Resource, string> = {
    [Resource.HERO_BANNERS]: 'hero banners',
    [Resource.ABOUT_CONTENT]: 'about content',
    [Resource.PROGRAMS]: 'programs',
    [Resource.OBJECTIVES]: 'objectives',
    [Resource.TEAM_MEMBERS]: 'team members',
    [Resource.GALLERY]: 'gallery items',
    [Resource.BLOG_POSTS]: 'blog posts',
    [Resource.LEGAL_DOCUMENTS]: 'legal documents',
    [Resource.CONTACT_SUBMISSIONS]: 'contact submissions',
    [Resource.USERS]: 'users',
    [Resource.DASHBOARD]: 'dashboard',
  };
  return names[resource];
}

/**
 * Get type-safe, human-readable permission description
 * Used for error messages and audit logs
 */
export function getPermissionDescription(resource: Resource, action: Action): string {
  return `${getActionVerb(action)} ${getResourceName(resource)}`;
}

/**
 * Check if a user role has permission to perform an action on a resource
 */
export function hasPermission(
  role: UserRole | undefined | null,
  resource: Resource,
  action: Action
): boolean {
  if (!role) return false;

  const rolePermissions = PERMISSIONS[role];
  if (!rolePermissions) return false;

  const resourcePermissions = rolePermissions[resource];
  if (!resourcePermissions) return false;

  return resourcePermissions.includes(action);
}

/**
 * Get all permissions for a specific role and resource
 */
export function getResourcePermissions(
  role: UserRole | undefined | null,
  resource: Resource
): {
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
} {
  return {
    canView: hasPermission(role, resource, Action.VIEW),
    canCreate: hasPermission(role, resource, Action.CREATE),
    canUpdate: hasPermission(role, resource, Action.UPDATE),
    canDelete: hasPermission(role, resource, Action.DELETE),
  };
}

/**
 * Check if role can manage users (Super Admin only)
 */
export function canManageUsers(role: UserRole | undefined | null): boolean {
  return hasPermission(role, Resource.USERS, Action.MANAGE_ROLES);
}

/**
 * Get user-friendly role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'Super Admin',
    [UserRole.CONTENT_ADMIN]: 'Content Admin',
    [UserRole.EDITOR]: 'Editor',
    [UserRole.VIEWER]: 'Viewer',
  };
  return names[role];
}

/**
 * Get role badge color
 */
export function getRoleBadgeColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'bg-purple-100 text-purple-800 border-purple-300',
    [UserRole.CONTENT_ADMIN]: 'bg-blue-100 text-blue-800 border-blue-300',
    [UserRole.EDITOR]: 'bg-green-100 text-green-800 border-green-300',
    [UserRole.VIEWER]: 'bg-gray-100 text-gray-800 border-gray-300',
  };
  return colors[role];
}
