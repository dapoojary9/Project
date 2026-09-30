import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import BookCard from "../components/BookCard.jsx";
import { categories } from "../data/books.js";

export default function BrowseBooks() {
  // :category comes from the URL (/books/:category); undefined on /books
  const { category } = useParams();
  const selected = category ? decodeURIComponent(category) : "All";
  const books = useSelector((s) => s.books.list);
  const [query, setQuery] = useState("");

  // Filter by category first, then by search text (title or author)
  const q = query.trim().toLowerCase();
  const filtered = books
    .filter((b) => selected === "All" || b.category === selected)
    .filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));

  return (
    <>
      <h1>Browse Books {selected !== "All" && <small>· {selected}</small>}</h1>

      <input
        className="input search"
        type="text"
        placeholder="Search by title or author..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="chips">
        {["All", ...categories].map((c) => (
          <Link
            key={c}
            className={`chip ${selected === c ? "chip-active" : ""}`}
            to={c === "All" ? "/books" : `/books/${encodeURIComponent(c)}`}
          >
            {c}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="muted">No books found.</p>
      ) : (
        <div className="grid">
          {filtered.map((b) => <BookCard key={b.id} book={b} />)}
        </div>
      )}
    </>
  );
}
