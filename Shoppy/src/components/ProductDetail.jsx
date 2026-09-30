import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

// Detail page for /product/:id. Fetches the product whenever the id changes.
export default function ProductDetail() {
  const { id } = useParams(); // route parameter
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(null); // null = show the thumbnail
  const [attempt, setAttempt] = useState(0); // bump to retry after an error

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setActiveImage(null);

    fetch(`https://dummyjson.com/products/${id}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? `Product #${id} does not exist.`
              : `Request failed with status ${res.status}`,
          );
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return; // component unmounted or id changed
        setError(err.message || 'Could not load this product.');
        setLoading(false);
      });

    return () => controller.abort();
  }, [id, attempt]);

  if (loading) return <Loader label="Loading product…" />;

  if (error) {
    return (
      <>
        <ErrorMessage message={error} onRetry={() => setAttempt((n) => n + 1)} />
        <Link to="/" className="back-link">
          ← Back to products
        </Link>
      </>
    );
  }

  const { title, description, price, discountPercentage, rating, stock, brand, category,
    thumbnail, images = [] } = product;

  return (
    <article>
      <Link to="/" className="back-link">
        ← Back to products
      </Link>

      <div className="detail">
        <div className="gallery">
          <img className="gallery__main" src={activeImage || thumbnail} alt={title} />
          {images.length > 1 && (
            <ul className="gallery__thumbs">
              {images.map((src, i) => (
                <li key={src}>
                  <button type="button" onClick={() => setActiveImage(src)}
                    aria-label={`Show image ${i + 1}`}>
                    <img src={src} alt="" loading="lazy" width="80" height="80" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="detail__info">
          <span className="tag">{category}</span>
          <h1>{title}</h1>
          {brand && <p className="muted">By {brand}</p>}
          <p>{description}</p>
          <p className="price price--lg">
            ${price.toFixed(2)} <small>{discountPercentage}% off</small>
          </p>
          <ul className="facts">
            <li>Rated {rating} out of 5</li>
            <li>{stock > 0 ? `${stock} in stock` : 'Out of stock'}</li>
          </ul>
          <button type="button" className="btn btn--lg" disabled={stock === 0}
            onClick={() => dispatch(addToCart(product))}>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
