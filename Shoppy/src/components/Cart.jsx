import { lazy, Suspense, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from '../store/cartSlice';
import { selectCartCount, selectCartItems, selectCartTotal } from '../store/selectors';
import Loader from './Loader';

const CartItem = lazy(() => import('./CartItem'));

// Cart page: lists the items and lets the user change quantities or remove them
export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const total = useSelector(selectCartTotal);

  const handleRemove = useCallback((id) => dispatch(removeFromCart(id)), [dispatch]);
  const handleIncrease = useCallback((id) => dispatch(increaseQuantity(id)), [dispatch]);
  const handleDecrease = useCallback((id) => dispatch(decreaseQuantity(id)), [dispatch]);

  if (items.length === 0) {
    return (
      <section className="empty-state">
        <h1>Your cart is empty</h1>
        <p>Add something you like and it will show up here.</p>
        <Link to="/" className="btn">
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section>
      <div className="toolbar">
        <h1>Your cart</h1>
        <button type="button" className="btn btn--ghost" onClick={() => dispatch(clearCart())}>
          Clear cart
        </button>
      </div>

      <div className="two-col">
        <Suspense fallback={<Loader />}>
          <ul className="cart-list">
            {/* key = unique product id */}
            {items.map((item) => (
              <li key={item.id}>
                <CartItem item={item} onRemove={handleRemove} onIncrease={handleIncrease}
                  onDecrease={handleDecrease} />
              </li>
            ))}
          </ul>
        </Suspense>

        <aside className="summary">
          <h2>Order summary</h2>
          <p className="summary__row"><span>Items</span><span>{count}</span></p>
          <p className="summary__row summary__total">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </p>
          <Link to="/checkout" className="btn btn--block">
            Go to checkout
          </Link>
        </aside>
      </div>
    </section>
  );
}
