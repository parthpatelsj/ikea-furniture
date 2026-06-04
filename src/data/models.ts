// Maps each catalog product to its 3D model asset in the project's `models/`
// folder. The .glb files are processed by Vite as URL assets so they get
// hashed, cache-friendly URLs in production builds.
//
// `import.meta.glob` keys are the literal paths matched from the project root,
// including spaces and non-ASCII characters in the original IKEA file names.
const modelUrls = import.meta.glob('/models/*.glb', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

// Product id -> source file name in `models/`.
const fileByProductId: Record<string, string> = {
  'glostad-sofa-knisa-dark-gray': 'GLOSTAD sofa - Knisa dark gray (40573285).glb',
  'morabo-sofa-gunnared-dark-gray': 'MORABO sofa - Gunnared dark graymetal.glb',
  'stockholm-sofa-seglora-natural': 'STOCKHOLM Sofa - Seglora natural.glb',
  'stockholm-2025-3-seat-sofa-alhamn-dark-brown':
    'STOCKHOLM 2025 3-seat sofa - Alhamn dark brown (79574298).glb',
  'slattum-bed-vissle-dark-gray':
    'SLATTUM upholstered bed frame - Vissle dark gray (70571256).glb',
  'idanas-storage-bed-naggen-beige': 'IDANÄS upholstered storage bed - Naggen beige.glb',
  'ramnefjall-bed-kilanda-light-beige':
    'RAMNEFJÄLL upholstered bed frame - Kilanda light beigeLuröy.glb',
  'lisabo-table-4-chairs-ash-veneer':
    'LISABO  LISABO table and 4 chairs - ash veneerash (49385529).glb',
  'voxlov-table-4-chairs-bamboo': 'VOXLÖV  VOXLÖV table and 4 chairs - bamboobamboo.glb',
  'besta-storage-doors-oak-veneer':
    'BESTÅ storage combination with doors - whiteHedevikenÖsarp oak veneer (59417365).glb',
  'pax-wardrobe-white': 'PAX wardrobe combination - white.glb',
  'stockholm-2025-sideboard-oak-veneer': 'STOCKHOLM 2025 sideboard - oak veneer.glb',
};

/** Resolve the bundled URL of a product's 3D model, if one exists. */
export function modelUrlForProduct(id: string): string | undefined {
  const file = fileByProductId[id];
  if (!file) return undefined;
  return modelUrls[`/models/${file}`];
}
