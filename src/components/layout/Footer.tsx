import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'Products',
    links: [
      ['New', '/'],
      ['Sofas & armchairs', '/category/sofas'],
      ['Beds & mattresses', '/category/beds'],
      ['Tables & chairs', '/category/tables-chairs'],
      ['Storage', '/category/storage'],
    ],
  },
  {
    title: 'Services',
    links: [
      ['Delivery', '/'],
      ['Assembly', '/'],
      ['Click & collect', '/'],
      ['Returns', '/'],
      ['Financing', '/'],
    ],
  },
  {
    title: 'Customer service',
    links: [
      ['Contact us', '/'],
      ['Track your order', '/'],
      ['Product recalls', '/'],
      ['FAQ', '/'],
    ],
  },
  {
    title: 'About IKEA',
    links: [
      ['This is IKEA', '/'],
      ['Sustainability', '/'],
      ['IKEA Family', '/'],
      ['Press room', '/'],
      ['Careers', '/'],
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-20 bg-ikea-gray-50 text-ikea-black">
      <div className="container-page py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">
                {col.title}
              </h3>
              <ul className="space-y-2 text-sm text-ikea-gray-600">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link to={href} className="hover:text-ikea-black hover:underline">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-ikea-gray-200 bg-white">
        <div className="container-page flex flex-col items-start justify-between gap-3 py-6 text-xs text-ikea-gray-600 sm:flex-row sm:items-center">
          <p>© Inter IKEA Systems B.V. {new Date().getFullYear()}. Demo project.</p>
          <div className="flex gap-4">
            <Link to="/" className="hover:underline">Privacy</Link>
            <Link to="/" className="hover:underline">Cookies</Link>
            <Link to="/" className="hover:underline">Terms</Link>
            <Link to="/" className="hover:underline">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
