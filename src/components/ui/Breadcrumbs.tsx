import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ikea-gray-600">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <Fragment key={`${item.label}-${i}`}>
              <li className="flex items-center">
                {item.to && !isLast ? (
                  <Link to={item.to} className="hover:underline">
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current={isLast ? 'page' : undefined} className="text-ikea-black">
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast && (
                <ChevronRight className="h-4 w-4 text-ikea-gray-400" aria-hidden />
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
