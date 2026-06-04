import type { Product } from '@/types';

const make = (
  p: Omit<Product, 'currency' | 'model'> & { model?: string },
): Product => ({
  ...p,
  currency: 'USD',
  model: p.model ?? `/models/${p.id}.glb`,
});

const IKEA = 'https://www.ikea.com/us/en/images/products';

export const products: Product[] = [
  make({
    id: 'glostad-sofa-knisa-dark-gray',
    name: 'GLOSTAD',
    series: '2-seat sofa',
    description: 'Knisa dark gray',
    longDescription:
      'A small sofa with a big personality. Knisa, the cover, is a soft and durable polyester that holds its color and shape. Easy to bring home thanks to flat packaging.',
    category: 'sofas',
    price: 249,
    oldPrice: 299,
    rating: 4.4,
    reviewCount: 1284,
    inStock: true,
    isBestseller: true,
    colors: [
      { name: 'Knisa dark gray', hex: '#3a3f44' },
      { name: 'Knisa light beige', hex: '#d4c8b8' },
    ],
    materials: ['100% polyester cover', 'Solid pine frame', 'Polyurethane foam'],
    dimensions: { width: 162, depth: 75, height: 73 },
    features: [
      'Easy to assemble — flat packed',
      'Removable, machine-washable cover',
      '10-year limited warranty',
    ],
    images: [
      `${IKEA}/glostad-sofa-knisa-dark-gray__1234948_pe917261_s5.jpg`,
      `${IKEA}/glostad-sofa-knisa-dark-gray__1235175_pe917294_s5.jpg`,
      `${IKEA}/glostad-sofa-knisa-dark-gray__1235915_pe917390_s5.jpg`,
      `${IKEA}/glostad-sofa-knisa-dark-gray__1235896_pe917385_s5.jpg`,
    ],
  }),
  make({
    id: 'morabo-sofa-gunnared-dark-gray',
    name: 'MORABO',
    series: '3-seat sofa with chaise',
    description: 'Gunnared dark gray, metal',
    longDescription:
      'Generous seats and soft cushions filled with cold foam and polyester fibers offer comfortable support. The chaise lets you stretch out for movie marathons.',
    category: 'sofas',
    price: 1299,
    rating: 4.7,
    reviewCount: 642,
    inStock: true,
    colors: [
      { name: 'Gunnared dark gray', hex: '#4a4d52' },
      { name: 'Gunnared beige', hex: '#a89e8c' },
    ],
    materials: ['90% polyester / 10% nylon cover', 'Steel legs', 'Cold foam cushions'],
    dimensions: { width: 281, depth: 170, height: 81 },
    features: [
      'Reversible chaise — set it up however you like',
      'Removable, machine-washable cover',
      'Soft, durable Gunnared fabric',
    ],
    images: [
      `${IKEA}/morabo-sofa-with-chaise-gunnared-dark-gray-metal__0602364_pe680296_s5.jpg`,
      `${IKEA}/morabo-sofa-with-chaise-gunnared-dark-gray-metal__0816255_pe773405_s5.jpg`,
      `${IKEA}/morabo-sofa-with-chaise-gunnared-dark-gray-metal__0813416_ph166494_s5.jpg`,
    ],
  }),
  make({
    id: 'stockholm-sofa-seglora-natural',
    name: 'STOCKHOLM',
    series: '3-seat sofa',
    description: 'Seglora natural leather',
    longDescription:
      'A leather sofa designed to age beautifully. The frame is solid wood and the cushions are filled with high-resilience foam wrapped in polyester fibers.',
    category: 'sofas',
    price: 2499,
    rating: 4.9,
    reviewCount: 187,
    inStock: true,
    isNew: true,
    colors: [{ name: 'Seglora natural', hex: '#b08768' }],
    materials: ['Full-grain leather', 'Solid birch frame', 'High-resilience foam'],
    dimensions: { width: 217, depth: 96, height: 80 },
    features: [
      'Aniline-dyed full-grain leather',
      '25-year limited warranty',
      'Made in Europe',
    ],
    images: [
      `${IKEA}/stockholm-sofa-seglora-natural__0183763_pe334809_s5.jpg`,
      `${IKEA}/stockholm-sofa-seglora-natural__0820478_pe598993_s5.jpg`,
      `${IKEA}/stockholm-sofa-seglora-natural__0212281_pe339545_s5.jpg`,
    ],
  }),
  make({
    id: 'stockholm-2025-3-seat-sofa-alhamn-dark-brown',
    name: 'STOCKHOLM 2025',
    series: '3-seat sofa',
    description: 'Alhamn dark brown',
    longDescription:
      'Inspired by the design language of the original STOCKHOLM, with refined proportions and durable materials chosen to last a lifetime.',
    category: 'sofas',
    price: 1899,
    rating: 4.6,
    reviewCount: 92,
    inStock: true,
    isNew: true,
    colors: [{ name: 'Alhamn dark brown', hex: '#5a3a2c' }],
    materials: ['Top-grain leather', 'Solid wood frame'],
    dimensions: { width: 233, depth: 96, height: 79 },
    features: ['Hand-finished detailing', 'Replaceable cushion covers'],
    images: [
      `${IKEA}/stockholm-2025-3-seat-sofa-alhamn-dark-brown__1362836_pe955332_s5.jpg`,
      `${IKEA}/stockholm-2025-3-seat-sofa-alhamn-dark-brown__1424961_ph202998_s5.jpg`,
      `${IKEA}/stockholm-2025-3-seat-sofa-alhamn-dark-brown__1421311_ph203263_s5.jpg`,
    ],
  }),
  make({
    id: 'slattum-bed-vissle-dark-gray',
    name: 'SLATTUM',
    series: 'Upholstered bed frame',
    description: 'Queen, Vissle dark gray',
    longDescription:
      'A simple, well-built bed in a soft fabric upholstery. Pairs effortlessly with any bedside table or dresser and works in just about any bedroom.',
    category: 'beds',
    price: 349,
    oldPrice: 429,
    rating: 4.5,
    reviewCount: 3120,
    inStock: true,
    isBestseller: true,
    colors: [{ name: 'Vissle dark gray', hex: '#4d4f55' }],
    materials: ['100% polyester cover', 'Solid pine frame', 'Plywood'],
    dimensions: { width: 161, length: 211, height: 100 },
    features: [
      'Soft fabric headboard for cozy support',
      'Roll-out mattress not included',
      'Compatible with all standard queen mattresses',
    ],
    images: [
      `${IKEA}/slattum-upholstered-bed-frame-vissle-dark-gray__1259335_pe926650_s5.jpg`,
      `${IKEA}/slattum-upholstered-bed-frame-vissle-dark-gray__1259363_pe926663_s5.jpg`,
      `${IKEA}/slattum-upholstered-bed-frame-vissle-dark-gray__1259338_pe926654_s5.jpg`,
    ],
  }),
  make({
    id: 'idanas-storage-bed-naggen-beige',
    name: 'IDANÄS',
    series: 'Upholstered storage bed',
    description: 'Queen, Naggen beige',
    longDescription:
      'Lift-up storage under the mattress keeps spare bedding tucked away. The button-tufted headboard adds warmth and texture to the bedroom.',
    category: 'beds',
    price: 749,
    rating: 4.7,
    reviewCount: 412,
    inStock: true,
    colors: [{ name: 'Naggen beige', hex: '#d4c4a8' }],
    materials: ['100% cotton cover', 'Solid wood frame', 'Steel mechanism'],
    dimensions: { width: 168, length: 215, height: 124 },
    features: [
      'Generous under-bed storage',
      'Gas-spring assisted lift',
      'Button-tufted headboard',
    ],
    images: [
      `${IKEA}/idanaes-upholstered-storage-bed-naggen-beige__1322816_pe942270_s5.jpg`,
      `${IKEA}/idanaes-upholstered-storage-bed-naggen-beige__1322817_pe942271_s5.jpg`,
      `${IKEA}/idanaes-upholstered-storage-bed-naggen-beige__1322818_pe942272_s5.jpg`,
    ],
  }),
  make({
    id: 'ramnefjall-bed-kilanda-light-beige',
    name: 'RAMNEFJÄLL',
    series: 'Upholstered bed frame',
    description: 'King, Kilanda light beige',
    longDescription:
      'A high, sculpted headboard makes RAMNEFJÄLL the focal point of any bedroom. Designed to last with a solid hardwood frame.',
    category: 'beds',
    price: 599,
    rating: 4.6,
    reviewCount: 218,
    inStock: false,
    colors: [{ name: 'Kilanda light beige', hex: '#e7d8be' }],
    materials: ['100% polyester cover', 'Solid hardwood frame'],
    dimensions: { width: 196, length: 215, height: 121 },
    features: ['Sculpted high headboard', 'Slatted base included'],
    images: [
      `${IKEA}/ramnefjaell-upholstered-bed-frame-kilanda-light-beige__1258172_pe927371_s5.jpg`,
      `${IKEA}/ramnefjaell-upholstered-bed-frame-kilanda-light-beige__1258175_pe927363_s5.jpg`,
      `${IKEA}/ramnefjaell-upholstered-bed-frame-kilanda-light-beige__1258195_pe927382_s5.jpg`,
    ],
  }),
  make({
    id: 'lisabo-table-4-chairs-ash-veneer',
    name: 'LISABO / LISABO',
    series: 'Table and 4 chairs',
    description: 'Ash veneer',
    longDescription:
      'A small dining set that makes the most of warm ash veneer and clean lines. The legs of the table are made from solid wood for stability.',
    category: 'tables-chairs',
    price: 549,
    rating: 4.6,
    reviewCount: 540,
    inStock: true,
    colors: [{ name: 'Ash', hex: '#cdb594' }],
    materials: ['Ash veneer', 'Solid birch'],
    dimensions: { width: 140, depth: 78, height: 74 },
    features: ['Seats 4 comfortably', 'Tools included for assembly'],
    images: [
      `${IKEA}/lisabo-lisabo-table-and-4-chairs-ash-veneer-ash__0921113_pe787668_s5.jpg`,
      `${IKEA}/lisabo-lisabo-table-and-4-chairs-ash-veneer-ash__1470751_pe996928_s5.jpg`,
      `${IKEA}/lisabo-lisabo-table-and-4-chairs-ash-veneer-ash__1053173_pe846766_s5.jpg`,
    ],
  }),
  make({
    id: 'voxlov-table-4-chairs-bamboo',
    name: 'VOXLÖV / VOXLÖV',
    series: 'Table and 4 chairs',
    description: 'Bamboo',
    longDescription:
      'Made from bamboo — a fast-growing, renewable material — VOXLÖV brings a warm, natural feel to the dining room.',
    category: 'tables-chairs',
    price: 449,
    rating: 4.4,
    reviewCount: 220,
    inStock: true,
    colors: [{ name: 'Bamboo natural', hex: '#dfc89b' }],
    materials: ['Bamboo'],
    dimensions: { width: 180, depth: 90, height: 74 },
    features: ['Sustainable bamboo', 'Light, airy silhouette'],
    images: [
      `${IKEA}/voxloev-voxloev-table-and-4-chairs-bamboo-bamboo__0926660_pe789444_s5.jpg`,
      `${IKEA}/voxloev-voxloev-table-and-4-chairs-bamboo-bamboo__0926661_pe789443_s5.jpg`,
      `${IKEA}/voxloev-voxloev-table-and-4-chairs-bamboo-bamboo__0997394_ph176797_s5.jpg`,
    ],
  }),
  make({
    id: 'besta-storage-doors-oak-veneer',
    name: 'BESTÅ',
    series: 'Storage combination with doors',
    description: 'White / Hedeviken oak veneer',
    longDescription:
      'Plan and build the storage you need. Adjustable shelves and soft-closing doors keep things tidy and quiet.',
    category: 'storage',
    price: 320,
    rating: 4.7,
    reviewCount: 980,
    inStock: true,
    isBestseller: true,
    colors: [
      { name: 'White / oak', hex: '#e8d9b8' },
      { name: 'Black-brown', hex: '#3b2f25' },
    ],
    materials: ['Particleboard with foil finish', 'Oak veneer doors'],
    dimensions: { width: 180, depth: 42, height: 65 },
    features: ['Soft-close hinges included', 'Cable management cutouts', 'Adjustable shelves'],
    images: [
      `${IKEA}/besta-storage-combination-with-doors-white-hedeviken-oesarp-oak-veneer__0994434_pe821091_s5.jpg`,
      `${IKEA}/besta-storage-combination-with-doors-white-hedeviken-oesarp-oak-veneer__0999272_pe823241_s5.jpg`,
      `${IKEA}/besta-storage-combination-with-doors-white-hedeviken-oesarp-oak-veneer__1060400_ph177999_s5.jpg`,
    ],
  }),
  make({
    id: 'pax-wardrobe-white',
    name: 'PAX',
    series: 'Wardrobe combination',
    description: 'White',
    longDescription:
      'Plan it, build it, and make it yours. The PAX wardrobe is the foundation of a wardrobe system that fits your life and your space.',
    category: 'wardrobes',
    price: 549,
    rating: 4.8,
    reviewCount: 4221,
    inStock: true,
    isBestseller: true,
    colors: [
      { name: 'White', hex: '#f4f4f2' },
      { name: 'Dark gray', hex: '#3d3f44' },
    ],
    materials: ['Particleboard', 'Foil finish'],
    dimensions: { width: 200, depth: 60, height: 236 },
    features: ['Plan it your way in the IKEA Planner', '10-year limited warranty', 'Soft-close hinges'],
    images: [
      `${IKEA}/pax-wardrobe-combination-white__1382086_pe962018_s5.jpg`,
      `${IKEA}/pax-wardrobe-combination-white__0570074_ph144610_s5.jpg`,
      `${IKEA}/pax-wardrobe-combination-white__0563730_pe663961_s5.jpg`,
    ],
  }),
  make({
    id: 'stockholm-2025-sideboard-oak-veneer',
    name: 'STOCKHOLM 2025',
    series: 'Sideboard',
    description: 'Oak veneer',
    longDescription:
      'A sideboard made of oak veneer with rounded corners and slim drawer pulls. The backs of the drawers are reinforced for everyday durability.',
    category: 'sideboards',
    price: 899,
    rating: 4.8,
    reviewCount: 76,
    inStock: true,
    isNew: true,
    colors: [{ name: 'Oak', hex: '#caa46e' }],
    materials: ['Oak veneer', 'Solid oak details'],
    dimensions: { width: 200, depth: 47, height: 80 },
    features: ['Soft-close drawers', 'Cable management', 'Adjustable feet'],
    images: [
      `${IKEA}/stockholm-2025-sideboard-oak-veneer__1397699_pe967720_s5.jpg`,
      `${IKEA}/stockholm-2025-sideboard-oak-veneer__1425273_ph203050_s5.jpg`,
      `${IKEA}/stockholm-2025-sideboard-oak-veneer__1424765_ph203051_s5.jpg`,
    ],
  }),
];

export const productById = Object.fromEntries(
  products.map((p) => [p.id, p]),
) as Record<string, Product>;

export function getProductsByCategory(categoryId: Product['category']): Product[] {
  return products.filter((p) => p.category === categoryId);
}

export function getRelatedProducts(productId: string, limit = 4): Product[] {
  const target = productById[productId];
  if (!target) return [];
  return products
    .filter((p) => p.id !== productId && p.category === target.category)
    .slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter((p) => {
    const haystack = [
      p.name,
      p.series,
      p.description,
      p.category,
      ...p.materials,
      ...p.colors.map((c) => c.name),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}
