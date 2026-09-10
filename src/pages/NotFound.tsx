import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const { pathname } = useLocation();

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-sm text-faint">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">There's nothing at {pathname}</h1>
      <p className="mt-2 text-muted">The page may have moved, or the link has a typo.</p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-md bg-fg px-3.5 py-2 text-sm font-medium text-canvas hover:opacity-90"
      >
        Back to markets
      </Link>
    </div>
  );
}
