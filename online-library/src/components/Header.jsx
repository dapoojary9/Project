import { NavLink } from "react-router-dom";

// Navigation bar shown on every page except 404.
export default function Header() {
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <span className="logo">📚 Online Library</span>
        <nav>
          {/* NavLink adds an "active" class to the current page's link */}
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/books">Browse Books</NavLink>
          <NavLink to="/add">Add Book</NavLink>
        </nav>
      </div>
    </header>
  );
}
