import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function BookDetails() {
  const { id } = useParams();
  // Find the book matching the :id in the URL
  const book = useSelector((s) => s.books.list.find((b) => String(b.id) === id));

  // Handle an id that doesn't exist
  if (!book) {
    return (
      <div className="panel">
        <h2>Book not found</h2>
        <Link className="btn" to="/books">← Back to Browse</Link>
      </div>
    );
  }

  return (
    <div className="panel">
      <span className="badge">{book.category}</span>
      <h1>{book.title}</h1>
      <p className="muted">by {book.author}</p>
      <p className="rating">⭐ {Number(book.rating).toFixed(1)} / 5</p>
      <p>{book.description}</p>
      <Link className="btn" to="/books">← Back to Browse</Link>
    </div>
  );
}
