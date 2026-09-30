import { Link } from "react-router-dom";

// Reusable card used on the Home and Browse pages.
export default function BookCard({ book }) {
  return (
    <div className="card">
      <span className="badge">{book.category}</span>
      <h3>{book.title}</h3>
      <p className="muted">by {book.author}</p>
      <p className="rating">⭐ {Number(book.rating).toFixed(1)}</p>
      <Link className="btn" to={`/book/${book.id}`}>View Details</Link>
    </div>
  );
}
