import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

const Home = lazy(() => import('@/pages/Home'));
const Category = lazy(() => import('@/pages/Category'));
const Product = lazy(() => import('@/pages/Product'));
const SpatialProduct = lazy(() => import('@/pages/SpatialProduct'));
const Cart = lazy(() => import('@/pages/Cart'));
const Wishlist = lazy(() => import('@/pages/Wishlist'));
const Search = lazy(() => import('@/pages/Search'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function PageFallback() {
  return (
    <div className="container-page py-20" role="status" aria-live="polite">
      <div className="h-8 w-1/3 animate-pulse rounded bg-ikea-gray-100" />
      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-square w-full animate-pulse rounded-lg bg-ikea-gray-100" />
            <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-ikea-gray-100" />
            <div className="mt-2 h-3 w-3/4 animate-pulse rounded bg-ikea-gray-100" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}

const withSuspense = (node: React.ReactNode) => (
  <Suspense fallback={<PageFallback />}>{node}</Suspense>
);

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: withSuspense(<Home />) },
      { path: '/category/:categoryId', element: withSuspense(<Category />) },
      { path: '/product/:productId', element: withSuspense(<Product />) },
      { path: '/spatial/:productId', element: withSuspense(<SpatialProduct />) },
      { path: '/cart', element: withSuspense(<Cart />) },
      { path: '/wishlist', element: withSuspense(<Wishlist />) },
      { path: '/search', element: withSuspense(<Search />) },
      { path: '*', element: withSuspense(<NotFound />) },
    ],
  },
]);
