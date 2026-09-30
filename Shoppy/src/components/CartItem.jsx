import { memo } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// One row in the cart. Handlers come from <Cart /> as props (they dispatch Redux actions).
function CartItem({ item, onRemove, onIncrease, onDecrease }) {
  const { id, title, price, thumbnail, quantity } = item;

  return (
    <article className="cart-item">
      <img src={thumbnail} alt={title} loading="lazy" width="90" height="90" />

      <div className="cart-item__info">
        <Link to={`/product/${id}`}>{title}</Link>
        <span className="muted">${price.toFixed(2)} each</span>
      </div>

      <div className="qty" role="group" aria-label={`Quantity for ${title}`}>
        {/* Disabled at 1 so the quantity can't drop below 1 */}
        <button type="button" onClick={() => onDecrease(id)} disabled={quantity <= 1}
          aria-label="Decrease quantity">
          −
        </button>
        <span>{quantity}</span>
        <button type="button" onClick={() => onIncrease(id)} aria-label="Increase quantity">
          +
        </button>
      </div>

      <strong className="cart-item__total">${(price * quantity).toFixed(2)}</strong>

      <button type="button" className="btn btn--ghost" onClick={() => onRemove(id)}>
        Remove
      </button>
    </article>
  );
}

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    thumbnail: PropTypes.string,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  onIncrease: PropTypes.func.isRequired,
  onDecrease: PropTypes.func.isRequired,
};

export default memo(CartItem);
