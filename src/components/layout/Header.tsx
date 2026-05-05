import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { categories } from '@/data/categories';
import { selectCartCount, useCart } from '@/store/cart';
import { useWishlist } from '@/store/wishlist';
import { cn } from '@/lib/cn';

function Logo() {
  return (
    <Link to="/" aria-label="IKEA home" className="shrink-0">
      <div className="flex h-10 w-20 items-center justify-center rounded-md bg-ikea-yellow">
        <span className="text-xl font-extrabold tracking-tight text-ikea-blue">
          IKEA
        </span>
      </div>
    </Link>
  );
}

function SearchBar({ onSubmit }: { onSubmit?: () => void }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const trimmed = q.trim();
        if (trimmed) {
          navigate(`/search?q=${encodeURIComponent(trimmed)}`);
          onSubmit?.();
        }
      }}
      className="relative flex-1"
    >
      <label htmlFor="site-search" className="sr-only">
        Search products
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ikea-gray-500"
      />
      <input
        id="site-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="What are you looking for?"
        className="h-12 w-full rounded-full border border-ikea-gray-200 bg-ikea-gray-50 pl-12 pr-4 text-sm placeholder:text-ikea-gray-500 focus:border-ikea-blue focus:bg-white"
      />
    </form>
  );
}

interface IconLinkProps {
  to: string;
  label: string;
  count?: number;
  children: React.ReactNode;
}

function IconLink({ to, label, count, children }: IconLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'relative flex flex-col items-center gap-0.5 rounded-md px-3 py-1.5 text-xs text-ikea-black hover:bg-ikea-gray-100',
          isActive && 'bg-ikea-gray-100',
        )
      }
      aria-label={label}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
      {count != null && count > 0 && (
        <span
          aria-hidden
          className="absolute right-1 top-0.5 min-w-[18px] rounded-full bg-ikea-blue px-1 text-center text-[10px] font-semibold leading-[18px] text-white"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </NavLink>
  );
}

export function Header() {
  const cartCount = useCart(selectCartCount);
  const wishlistCount = useWishlist((s) => s.ids.length);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-ikea-gray-200 bg-white">
      {/* Top utility bar */}
      <div className="hidden bg-ikea-gray-50 text-xs text-ikea-gray-600 md:block">
        <div className="container-page flex h-8 items-center justify-end gap-6">
          <Link to="/" className="hover:underline">
            Find a store
          </Link>
          <Link to="/" className="hover:underline">
            Customer service
          </Link>
          <Link to="/" className="hover:underline">
            IKEA Family
          </Link>
        </div>
      </div>

      {/* Main bar */}
      <div className="container-page flex h-16 items-center gap-4">
        <button
          type="button"
          className="rounded-md p-2 text-ikea-black hover:bg-ikea-gray-100 lg:hidden"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <Logo />

        <div className="hidden flex-1 lg:block">
          <SearchBar />
        </div>

        <nav className="ml-auto flex items-center gap-1">
          <IconLink to="/account" label="Profile">
            <User className="h-5 w-5" aria-hidden />
          </IconLink>
          <IconLink to="/wishlist" label="Favorites" count={wishlistCount}>
            <Heart className="h-5 w-5" aria-hidden />
          </IconLink>
          <IconLink to="/cart" label="Cart" count={cartCount}>
            <ShoppingBag className="h-5 w-5" aria-hidden />
          </IconLink>
        </nav>
      </div>

      {/* Search on mobile */}
      <div className="container-page pb-3 lg:hidden">
        <SearchBar />
      </div>

      {/* Category nav */}
      <nav
        aria-label="Product categories"
        className="hidden border-t border-ikea-gray-200 bg-white lg:block"
      >
        <div className="container-page flex h-12 items-center gap-1 overflow-x-auto">
          {categories.map((cat) => (
            <NavLink
              key={cat.id}
              to={`/category/${cat.id}`}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-ikea-gray-600 hover:bg-ikea-gray-100 hover:text-ikea-black',
                  isActive && 'bg-ikea-gray-100 text-ikea-black',
                )
              }
            >
              {cat.name}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden">
          <nav
            aria-label="Mobile menu"
            className="container-page space-y-1 border-t border-ikea-gray-200 py-4"
          >
            {categories.map((cat) => (
              <NavLink
                key={cat.id}
                to={`/category/${cat.id}`}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block rounded-md px-3 py-3 text-base font-medium hover:bg-ikea-gray-100',
                    isActive && 'bg-ikea-gray-100',
                  )
                }
              >
                {cat.name}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
