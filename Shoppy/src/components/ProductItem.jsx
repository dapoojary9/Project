import { memo } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// One product card. Data and the add-to-cart handler arrive through props.
function ProductItem({ product, onAddToCart }) {
  const { id, title, price, thumbnail, rating, category } = product;

  return (
    <article className="card">
      <Link to={`/product/${id}`} className="card__media">
        {/* loading="lazy" defers off-screen images until the user scrolls near them */}
        <img src={thumbnail} alt={title} loading="lazy" width="300" height="300" />
      </Link>
      <div className="card__body">
        <span className="tag">{category}</span>
        <h2 className="card__title">
          <Link to={`/product/${id}`}>{title}</Link>
        </h2>
        <p className="muted">Rated {rating} out of 5</p>
        <div className="card__foot">
          <strong className="price">${price.toFixed(2)}</strong>
          <button type="button" className="btn" onClick={() => onAddToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

ProductItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    thumbnail: PropTypes.string,
    rating: PropTypes.number,
    category: PropTypes.string,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

// memo: skip re-rendering cards whose props did not change (e.g. while typing in search)
export default memo(ProductItem);
