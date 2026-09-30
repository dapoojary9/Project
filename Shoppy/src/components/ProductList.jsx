import { lazy, Suspense, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useFetchProducts from '../hooks/useFetchProducts';
import { addToCart } from '../store/cartSlice';
import { setSearchQuery } from '../store/searchSlice';
import { selectSearchQuery } from '../store/selectors';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

// Code splitting: ProductItem is downloaded only when the list needs it
const ProductItem = lazy(() => import('./ProductItem'));

// Home page: fetches products, filters them by the Redux search query, renders a grid
export default function ProductList() {
  const dispatch = useDispatch();
  const query = useSelector(selectSearchQuery);
  const { products, loading, error, retry } = useFetchProducts();

  // Only recompute the filtered list when products or the query change
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q),
    );
  }, [products, query]);

  // Stable function so memoized ProductItems are not re-rendered needlessly
  const handleAddToCart = useCallback((product) => dispatch(addToCart(product)), [dispatch]);

  return (
    <section>
      <div className="toolbar">
        <h1>Products</h1>
        <input
          type="search"
          className="search"
          placeholder="Search by name, brand or category"
          value={query}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          aria-label="Search products"
        />
      </div>

      {loading && <Loader label="Loading products…" />}
      {error && <ErrorMessage message={error} onRetry={retry} />}

      {!loading && !error && filtered.length === 0 && (
        <p className="empty">No products match "{query}". Try a different word.</p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <Suspense fallback={<Loader />}>
          <ul className="grid">
            {/* key = unique product id */}
            {filtered.map((product) => (
              <li key={product.id}>
                <ProductItem product={product} onAddToCart={handleAddToCart} />
              </li>
            ))}
          </ul>
        </Suspense>
      )}
    </section>
  );
}
