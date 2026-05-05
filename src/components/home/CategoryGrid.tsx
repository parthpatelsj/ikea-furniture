import { Link } from 'react-router-dom';
import { categories } from '@/data/categories';
import { Image } from '@/components/ui/Image';

export function CategoryGrid() {
  return (
    <section className="container-page mt-16">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-bold sm:text-3xl">Shop by room</h2>
        <Link to="/" className="link-underline text-sm">
          See all rooms
        </Link>
      </div>
      <ul
        role="list"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
      >
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link
              to={`/category/${cat.id}`}
              className="group block focus:outline-none"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                aspect="square"
                rounded
                className="transition-transform group-hover:scale-[1.02]"
              />
              <div className="mt-2">
                <h3 className="text-sm font-semibold group-hover:underline">
                  {cat.name}
                </h3>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
