import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import BrowseBooks from "./pages/BrowseBooks.jsx";
import BookDetails from "./pages/BookDetails.jsx";
import AddBook from "./pages/AddBook.jsx";
import NotFound from "./pages/NotFound.jsx";

// Layout route: renders the Header above whichever child page matches.
function MainLayout() {
  return (
    <>
      <Header />
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Pages that show the Header */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<BrowseBooks />} />
        {/* Dynamic route: filter by category, e.g. /books/Sci-Fi */}
        <Route path="/books/:category" element={<BrowseBooks />} />
        {/* Dynamic route: single book by id */}
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/add" element={<AddBook />} />
      </Route>
      {/* Catch-all 404 route lives OUTSIDE the layout, so no Header */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
