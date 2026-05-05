import type { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'sofas',
    name: 'Sofas & armchairs',
    tagline: 'Comfort that brings the room together',
    imageSeed: 'sofa-room',
  },
  {
    id: 'beds',
    name: 'Beds & mattresses',
    tagline: 'Better sleep starts here',
    imageSeed: 'bedroom',
  },
  {
    id: 'tables-chairs',
    name: 'Tables & chairs',
    tagline: 'Gather, dine, work, repeat',
    imageSeed: 'dining',
  },
  {
    id: 'storage',
    name: 'Storage & organization',
    tagline: 'A place for everything',
    imageSeed: 'storage-living',
  },
  {
    id: 'wardrobes',
    name: 'Wardrobes',
    tagline: 'Make space for what matters',
    imageSeed: 'wardrobe',
  },
  {
    id: 'sideboards',
    name: 'Sideboards & cabinets',
    tagline: 'Quiet design, smart storage',
    imageSeed: 'sideboard',
  },
];

export const categoryById = Object.fromEntries(
  categories.map((c) => [c.id, c]),
) as Record<Category['id'], Category>;
