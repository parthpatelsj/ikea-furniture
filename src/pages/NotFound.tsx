import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-ikea-blue">
        404
      </p>
      <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-base text-ikea-gray-600">
        We couldn't find the page you were looking for. It may have moved, or the
        link could be broken.
      </p>
      <Link to="/" className="btn btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
