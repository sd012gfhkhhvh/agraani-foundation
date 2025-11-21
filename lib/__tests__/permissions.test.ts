import { describe, it, expect } from 'vitest';
import { hasPermission, getPermissionDescription, Resource, Action } from '@/lib/permissions';
import { UserRole } from '@prisma/client';

/**
 * Permission Test Utilities
 * 
 * These tests verify that the RBAC permission matrix is correctly configured
 * and that all roles have appropriate access levels.
 */

describe('RBAC Permission System', () => {
  describe('Permission Descriptions', () => {
    it('should generate human-readable permission descriptions', () => {
      expect(getPermissionDescription(Resource.GALLERY, Action.CREATE))
        .toBe('create gallery items');
      
      expect(getPermissionDescription(Resource.USERS, Action.MANAGE_ROLES))
        .toBe('manage roles for users');
      
      expect(getPermissionDescription(Resource.BLOG_POSTS, Action.UPDATE))
        .toBe('update blog posts');
    });
  });

  describe('SUPER_ADMIN Role', () => {
    const role = UserRole.SUPER_ADMIN;

    it('should have full access to all content resources', () => {
      const resources = [
        Resource.HERO_BANNERS,
        Resource.ABOUT_CONTENT,
        Resource.PROGRAMS,
        Resource.OBJECTIVES,
        Resource.TEAM_MEMBERS,
        Resource.GALLERY,
        Resource.BLOG_POSTS,
        Resource.LEGAL_DOCUMENTS,
      ];

      resources.forEach(resource => {
        expect(hasPermission(role, resource, Action.VIEW)).toBe(true);
        expect(hasPermission(role, resource, Action.CREATE)).toBe(true);
        expect(hasPermission(role, resource, Action.UPDATE)).toBe(true);
        expect(hasPermission(role, resource, Action.DELETE)).toBe(true);
      });
    });

    it('should have user management permissions', () => {
      expect(hasPermission(role, Resource.USERS, Action.VIEW)).toBe(true);
      expect(hasPermission(role, Resource.USERS, Action.UPDATE)).toBe(true);
      expect(hasPermission(role, Resource.USERS, Action.MANAGE_ROLES)).toBe(true);
    });

    it('should have contact submission access', () => {
      expect(hasPermission(role, Resource.CONTACT_SUBMISSIONS, Action.VIEW)).toBe(true);
      expect(hasPermission(role, Resource.CONTACT_SUBMISSIONS, Action.DELETE)).toBe(true);
    });
  });

  describe('CONTENT_ADMIN Role', () => {
    const role = UserRole.CONTENT_ADMIN;

    it('should have full access to content resources', () => {
      expect(hasPermission(role, Resource.GALLERY, Action.CREATE)).toBe(true);
      expect(hasPermission(role, Resource.GALLERY, Action.UPDATE)).toBe(true);
      expect(hasPermission(role, Resource.GALLERY, Action.DELETE)).toBe(true);
      expect(hasPermission(role, Resource.BLOG_POSTS, Action.DELETE)).toBe(true);
    });

    it('should NOT have user management permissions', () => {
      expect(hasPermission(role, Resource.USERS, Action.VIEW)).toBe(false);
      expect(hasPermission(role, Resource.USERS, Action.MANAGE_ROLES)).toBe(false);
    });

    it('should have contact submission access', () => {
      expect(hasPermission(role, Resource.CONTACT_SUBMISSIONS, Action.VIEW)).toBe(true);
      expect(hasPermission(role, Resource.CONTACT_SUBMISSIONS, Action.DELETE)).toBe(true);
    });
  });

  describe('EDITOR Role', () => {
    const role = UserRole.EDITOR;

    it('should be able to create and update content', () => {
      const resources = [
        Resource.GALLERY,
        Resource.BLOG_POSTS,
        Resource.PROGRAMS,
        Resource.OBJECTIVES,
      ];

      resources.forEach(resource => {
        expect(hasPermission(role, resource, Action.VIEW)).toBe(true);
        expect(hasPermission(role, resource, Action.CREATE)).toBe(true);
        expect(hasPermission(role, resource, Action.UPDATE)).toBe(true);
      });
    });

    it('should NOT be able to delete content', () => {
      expect(hasPermission(role, Resource.GALLERY, Action.DELETE)).toBe(false);
      expect(hasPermission(role, Resource.BLOG_POSTS, Action.DELETE)).toBe(false);
      expect(hasPermission(role, Resource.PROGRAMS, Action.DELETE)).toBe(false);
    });

    it('should be able to view but not delete contact submissions', () => {
      expect(hasPermission(role, Resource.CONTACT_SUBMISSIONS, Action.VIEW)).toBe(true);
      expect(hasPermission(role, Resource.CONTACT_SUBMISSIONS, Action.DELETE)).toBe(false);
    });

    it('should NOT have user management permissions', () => {
      expect(hasPermission(role, Resource.USERS, Action.VIEW)).toBe(false);
      expect(hasPermission(role, Resource.USERS, Action.MANAGE_ROLES)).toBe(false);
    });
  });

  describe('VIEWER Role', () => {
    const role = UserRole.VIEWER;

    it('should only have view permissions', () => {
      const resources = [
        Resource.GALLERY,
        Resource.BLOG_POSTS,
        Resource.PROGRAMS,
        Resource.TEAM_MEMBERS,
        Resource.LEGAL_DOCUMENTS,
      ];

      resources.forEach(resource => {
        expect(hasPermission(role, resource, Action.VIEW)).toBe(true);
        expect(hasPermission(role, resource, Action.CREATE)).toBe(false);
        expect(hasPermission(role, resource, Action.UPDATE)).toBe(false);
        expect(hasPermission(role, resource, Action.DELETE)).toBe(false);
      });
    });

    it('should be able to view contact submissions', () => {
      expect(hasPermission(role, Resource.CONTACT_SUBMISSIONS, Action.VIEW)).toBe(true);
      expect(hasPermission(role, Resource.CONTACT_SUBMISSIONS, Action.DELETE)).toBe(false);
    });

    it('should NOT have any user management permissions', () => {
      expect(hasPermission(role, Resource.USERS, Action.VIEW)).toBe(false);
      expect(hasPermission(role, Resource.USERS, Action.UPDATE)).toBe(false);
      expect(hasPermission(role, Resource.USERS, Action.MANAGE_ROLES)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should deny permissions for undefined role', () => {
      expect(hasPermission(undefined, Resource.GALLERY, Action.VIEW)).toBe(false);
      expect(hasPermission(null, Resource.GALLERY, Action.CREATE)).toBe(false);
    });

    it('should deny permissions for all roles on resources without explicit grants', () => {
      // Test that VIEWER can't create anything
      expect(hasPermission(UserRole.VIEWER, Resource.GALLERY, Action.CREATE)).toBe(false);
      
      // Test that EDITOR can't delete
      expect(hasPermission(UserRole.EDITOR, Resource.LEGAL_DOCUMENTS, Action.DELETE)).toBe(false);
    });
  });

  describe('Permission Matrix Consistency', () => {
    it('should have VIEW permission for all resources where other actions are granted', () => {
      const roles = [UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN, UserRole.EDITOR];
      const resources = Object.values(Resource);

      roles.forEach(role => {
        resources.forEach(resource => {
          const canCreate = hasPermission(role, resource, Action.CREATE);
          const canUpdate = hasPermission(role, resource, Action.UPDATE);
          const canDelete = hasPermission(role, resource, Action.DELETE);
          
          // If any mutating action is allowed, VIEW should also be allowed
          if (canCreate || canUpdate || canDelete) {
            expect(hasPermission(role, resource, Action.VIEW)).toBe(true);
          }
        });
      });
    });

    it('should enforce deletion hierarchy (DELETE implies UPDATE)', () => {
      const roles = [UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN];
      const resources = Object.values(Resource).filter(r => r !== Resource.USERS);

      roles.forEach(role => {
        resources.forEach(resource => {
          const canDelete = hasPermission(role, resource, Action.DELETE);
          
          // If DELETE is allowed, UPDATE should also be allowed
          if (canDelete) {
            expect(hasPermission(role, resource, Action.UPDATE)).toBe(true);
          }
        });
      });
    });
  });
});
