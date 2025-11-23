/**
 * Custom React Query hooks for admin data fetching
 */

'use client';

import type { ApiResponse } from '@/types/api';
import type {
  AboutSection,
  BlogPost,
  ContactSubmission,
  GalleryItem,
  HeroBanner,
  LegalDocument,
  Objective,
  Program,
  TeamMember,
  User,
} from '@/types/models';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook to fetch about content for admin
 */
export function useAboutContent() {
  return useQuery({
    queryKey: ['admin', 'about'],
    queryFn: async (): Promise<AboutSection[]> => {
      const response = await fetch('/api/admin/about');
      const result: ApiResponse<AboutSection[]> = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch about content');
      }

      return result.data;
    },
  });
}

/**
 * Hook to fetch blog posts for admin
 */
export function useBlogPosts() {
  return useQuery({
    queryKey: ['admin', 'blog'],
    queryFn: async (): Promise<BlogPost[]> => {
      const response = await fetch('/api/admin/blog');
      const result: ApiResponse<BlogPost[]> = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch blog posts');
      }

      return result.data;
    },
  });
}

/**
 * Hook to fetch programs for admin
 */
export function usePrograms() {
  return useQuery({
    queryKey: ['admin', 'programs'],
    queryFn: async (): Promise<Program[]> => {
      const response = await fetch('/api/admin/programs');
      const result: ApiResponse<Program[]> = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch programs');
      }

      return result.data;
    },
  });
}

/**
 * Hook to fetch gallery items for admin
 */
export function useGalleryItems() {
  return useQuery({
    queryKey: ['admin', 'gallery'],
    queryFn: async (): Promise<GalleryItem[]> => {
      const response = await fetch('/api/admin/gallery');
      const result: ApiResponse<GalleryItem[]> = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch gallery items');
      }

      return result.data;
    },
  });
}

/**
 * Hook to fetch team members for admin
 */
export function useTeamMembers() {
  return useQuery({
    queryKey: ['admin', 'team'],
    queryFn: async (): Promise<TeamMember[]> => {
      const response = await fetch('/api/admin/team');
      const result: ApiResponse<TeamMember[]> = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch team members');
      }

      return result.data;
    },
  });
}

/**
 * Hook to fetch hero banners for admin
 */
export function useHeroBanners() {
  return useQuery({
    queryKey: ['admin', 'hero-banners'],
    queryFn: async (): Promise<HeroBanner[]> => {
      const response = await fetch('/api/admin/hero-banners');
      const result: ApiResponse<HeroBanner[]> = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch hero banners');
      }

      return result.data;
    },
  });
}

/**
 * Hook to fetch objectives for admin
 */
export function useObjectives() {
  return useQuery({
    queryKey: ['admin', 'objectives'],
    queryFn: async (): Promise<Objective[]> => {
      const response = await fetch('/api/admin/objectives');
      const result: ApiResponse<Objective[]> = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch objectives');
      }

      return result.data;
    },
  });
}

/**
 * Hook to fetch legal documents for admin
 */
export function useLegalDocuments() {
  return useQuery({
    queryKey: ['admin', 'legal'],
    queryFn: async (): Promise<LegalDocument[]> => {
      const response = await fetch('/api/admin/legal');
      const result: ApiResponse<LegalDocument[]> = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch legal documents');
      }

      return result.data;
    },
  });
}

/**
 * Hook to fetch contact submissions for admin
 */
export function useContactSubmissions() {
  return useQuery({
    queryKey: ['admin', 'contact-submissions'],
    queryFn: async (): Promise<ContactSubmission[]> => {
      const response = await fetch('/api/admin/contact-submissions');
      const result: ApiResponse<ContactSubmission[]> = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch contact submissions');
      }

      return result.data;
    },
  });
}

/**
 * Hook to fetch users for admin
 */
export function useUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async (): Promise<User[]> => {
      const response = await fetch('/api/admin/users');
      const result: ApiResponse<User[]> = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to fetch users');
      }

      return result.data;
    },
  });
}
