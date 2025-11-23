/**
 * Central export for all data loaders
 * Import data fetching functions from this file
 */

// About
export { getAboutContent, getAboutSection } from './about';

// Blog
export { getAllBlogPosts, getBlogPostBySlug, getPublishedBlogPosts } from './blog';

// Contact
export { getContactSubmissions, getUnreadSubmissionsCount } from './contact';

// Gallery
export { getActiveGalleryItems, getAllGalleryItems } from './gallery';
export type { GalleryFilters } from './gallery';

// Hero Banners
export { getActiveHeroBanners, getAllHeroBanners } from './hero-banners';

// Legal
export { getLegalDocuments, getLegalDocumentsByType } from './legal';

// Objectives
export { getActiveObjectives, getAllObjectives } from './objectives';

// Programs
export { getActivePrograms, getAllPrograms, getProgramBySlug } from './programs';

// Team
export { getActiveTeamMembers, getAllTeamMembers } from './team';

// Users
export { getAllUsers, getUserById } from './users';
