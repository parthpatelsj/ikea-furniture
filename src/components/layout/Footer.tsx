import { Link } from 'react-router-dom';

const productLinks = [
  ['Sofas & armchairs', '/category/sofas'],
  ['Beds & mattresses', '/category/beds'],
  ['Tables & chairs', '/category/tables-chairs'],
  ['Storage', '/category/storage'],
] as const;

export function Footer() {
  return (
    <footer className="mt-20 bg-ikea-gray-50 text-ikea-black">
      <div className="container-page py-10">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">
          Shop by category
        </h3>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ikea-gray-600">
          {productLinks.map(([label, href]) => (
            <li key={label}>
              <Link to={href} className="hover:text-ikea-black hover:underline">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-ikea-gray-200 bg-white">
        <div className="container-page py-6 text-xs text-ikea-gray-600">
          <p>© Inter IKEA Systems B.V. {new Date().getFullYear()}. Demo project.</p>
        </div>
      </div>
    </footer>
  );
}
