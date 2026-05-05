import { Link } from 'react-router-dom';
import { placeholderImage } from '@/lib/images';

export function Hero() {
  return (
    <section className="container-page mt-4">
      <div className="relative overflow-hidden rounded-2xl bg-ikea-gray-100">
        <img
          src={placeholderImage('living-room-hero', 1800, 900)}
          alt="A bright living room styled with a sofa, sideboard and warm wood accents."
          className="h-[420px] w-full object-cover sm:h-[520px]"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container-page">
            <div className="max-w-md text-white">
              <p className="text-sm font-semibold uppercase tracking-wide">
                New for 2026
              </p>
              <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">
                A home that grows with you
              </h1>
              <p className="mt-3 text-base text-white/90 sm:text-lg">
                Discover the new STOCKHOLM 2025 collection — pieces designed to
                last a lifetime, at prices that work for everyone.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/category/sofas" className="btn btn-primary">
                  Shop the collection
                </Link>
                <Link
                  to="/category/sideboards"
                  className="btn bg-white text-ikea-black hover:bg-ikea-gray-50"
                >
                  Browse sideboards
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
