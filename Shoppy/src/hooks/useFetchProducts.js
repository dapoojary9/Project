import { useCallback, useEffect, useState } from 'react';

const PRODUCTS_URL = 'https://dummyjson.com/products';

// Custom hook: fetches the product list when the component mounts.
// Returns { products, loading, error, retry }.
export default function useFetchProducts(url = PRODUCTS_URL) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0); // bump to re-run the request

  useEffect(() => {
    const controller = new AbortController(); // cancels the request on unmount
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        // An abort is expected during cleanup, so it is not shown as an error
        if (err.name !== 'AbortError') setError(err.message || 'Could not load products.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [url, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { products, loading, error, retry };
}
