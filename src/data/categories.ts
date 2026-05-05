import type { Category } from '@/types';

const IKEA = 'https://www.ikea.com/us/en/images/products';

export const categories: Category[] = [
  {
    id: 'sofas',
    name: 'Sofas & armchairs',
    tagline: 'Comfort that brings the room together',
    image: `${IKEA}/stockholm-2025-3-seat-sofa-alhamn-dark-brown__1424961_ph202998_s5.jpg`,
  },
  {
    id: 'beds',
    name: 'Beds & mattresses',
    tagline: 'Better sleep starts here',
    image: `${IKEA}/idanaes-upholstered-storage-bed-naggen-beige__1238378_ph151106_s.jpg`,
  },
  {
    id: 'tables-chairs',
    name: 'Tables & chairs',
    tagline: 'Gather, dine, work, repeat',
    image: `${IKEA}/voxloev-voxloev-table-and-4-chairs-bamboo-bamboo__0997394_ph176797_s5.jpg`,
  },
  {
    id: 'storage',
    name: 'Storage & organization',
    tagline: 'A place for everything',
    image: `${IKEA}/besta-storage-combination-with-doors-white-hedeviken-oesarp-oak-veneer__1060400_ph177999_s5.jpg`,
  },
  {
    id: 'wardrobes',
    name: 'Wardrobes',
    tagline: 'Make space for what matters',
    image: `${IKEA}/pax-wardrobe-combination-white__0570074_ph144610_s5.jpg`,
  },
  {
    id: 'sideboards',
    name: 'Sideboards & cabinets',
    tagline: 'Quiet design, smart storage',
    image: `${IKEA}/stockholm-2025-sideboard-oak-veneer__1425273_ph203050_s5.jpg`,
  },
];

export const categoryById = Object.fromEntries(
  categories.map((c) => [c.id, c]),
) as Record<Category['id'], Category>;
