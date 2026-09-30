import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import BookCard from "../components/BookCard.jsx";
import { categories } from "../data/books.js";

export default function Home() {
  const books = useSelector((s) => s.books.list);
  // "Popular" = top 4 books by rating
  const popular = [...books].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <>
      <section className="hero">
        <h1>Welcome to the Online Library</h1>
        <p>Discover, browse and add your favourite books.</p>
      </section>

      <h2>Categories</h2>
      <div className="chips">
        {categories.map((c) => (
          <Link key={c} className="chip" to={`/books/${encodeURIComponent(c)}`}>{c}</Link>
        ))}
      </div>

      <h2>Popular Books</h2>
      <div className="grid">
        {popular.map((b) => <BookCard key={b.id} book={b} />)}
      </div>
    </>
  );
}
