/**
 * Centralized type definitions for domain models
 * These types refine Prisma types for client use
 */

// About Content
export type AboutSection = {
  id: string;
  section: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Blog Posts
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  author: string;
  category: string | null;
  tags: string[];
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PublishedBlogPost = BlogPost & {
  isPublished: true;
  publishedAt: Date;
};

// Programs
export type Program = {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  icon: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Objectives
export type Objective = {
  id: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Team Members
export type TeamMember = {
  id: string;
  name: string;
  position: string;
  bio: string | null;
  imageUrl: string | null;
  email: string | null;
  phone: string | null;
  linkedIn: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Gallery Items
export type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  type: 'IMAGE' | 'VIDEO';
  category: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Hero Banners
export type HeroBanner = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string;
  ctaText: string | null;
  ctaLink: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Legal Documents
export type LegalDocument = {
  id: string;
  name: string;
  registrationNumber: string;
  documentType: string;
  validity: string;
  issueDate: Date | null;
  expiryDate: Date | null;
  fileUrl: string | null;
  notes: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

// Contact Submissions
export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

// Users
export type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: 'SUPER_ADMIN' | 'CONTENT_ADMIN' | 'EDITOR' | 'VIEWER' | null;
  createdAt: Date;
  updatedAt: Date;
};
