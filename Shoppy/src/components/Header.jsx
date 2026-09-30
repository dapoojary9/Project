import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartCount } from '../store/selectors';

// Top navigation bar with the brand, menu links and the cart icon + item count
export default function Header() {
  const count = useSelector(selectCartCount);

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="brand">
          ShoppyGlobe
        </Link>

        <nav className="nav" aria-label="Main menu">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/checkout">Checkout</NavLink>
          <NavLink to="/cart" className="cart-link" aria-label={`Cart with ${count} items`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
