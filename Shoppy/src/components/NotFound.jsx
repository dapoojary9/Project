import { Link, isRouteErrorResponse, useLocation, useRouteError } from 'react-router-dom';

// Used for unknown URLs (path="*") and as the router's errorElement.
// Shows the status, the requested path and a readable message.
export default function NotFound() {
  const error = useRouteError(); // undefined for a plain unknown URL
  const { pathname } = useLocation();

  let status = 404;
  let title = 'Page not found';
  let message = `There is no page at "${pathname}". It may have moved, or the link may be mistyped.`;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    title = error.statusText || title;
    if (typeof error.data === 'string') message = error.data;
  } else if (error instanceof Error) {
    status = 500;
    title = 'Something went wrong';
    message = error.message;
  }

  return (
    <section className="not-found" role="alert">
      <p className="not-found__code">{status}</p>
      <h1>{title}</h1>
      <p>{message}</p>
      <dl className="not-found__details">
        <dt>Status</dt>
        <dd>{status}</dd>
        <dt>Requested path</dt>
        <dd>{pathname}</dd>
      </dl>
      <Link to="/" className="btn">
        Back to home
      </Link>
    </section>
  );
}
