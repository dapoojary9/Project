import { Link, useLocation } from "react-router-dom";

// 404 page: shows the invalid URL and a link home. No Header here.
export default function NotFound() {
  const { pathname } = useLocation();
  return (
    <div className="notfound">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>No page exists at <code>{pathname}</code></p>
      <Link className="btn" to="/">Go back Home</Link>
    </div>
  );
}
