import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import { selectCartItems, selectCartTotal } from '../store/selectors';

// Form fields are described as data so the JSX below stays short
const FIELDS = [
  { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel', pattern: '[0-9]{10}', title: 'Enter a 10-digit number' },
  { name: 'address', label: 'Street address', type: 'text', autoComplete: 'street-address' },
  { name: 'city', label: 'City', type: 'text', autoComplete: 'address-level2' },
  { name: 'zip', label: 'PIN / ZIP code', type: 'text', pattern: '[0-9]{5,6}', title: 'Enter 5 or 6 digits' },
];

const EMPTY_FORM = { name: '', email: '', phone: '', address: '', city: '', zip: '', payment: 'cod' };

// Checkout page: dummy details form + summary of what is in the cart
export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const [form, setForm] = useState(EMPTY_FORM);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const timer = useRef(null);

  // If the user leaves early, cancel the pending redirect
  useEffect(() => () => clearTimeout(timer.current), []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault(); // browser has already validated the required fields
    dispatch(clearCart()); // empty the cart in Redux
    setOrderPlaced(true);
    timer.current = setTimeout(() => navigate('/'), 3000); // back to Home automatically
  };

  if (orderPlaced) {
    return (
      <section className="empty-state" role="status">
        <h1>Order placed</h1>
        <p>Thank you, {form.name}. Taking you back to the home page…</p>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="empty-state">
        <h1>Nothing to check out</h1>
        <p>Your cart is empty.</p>
        <Link to="/" className="btn">
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Checkout</h1>
      <div className="two-col">
        <form className="form" onSubmit={handlePlaceOrder}>
          {FIELDS.map(({ name, label, ...inputProps }) => (
            <label key={name} className="field">
              <span>{label}</span>
              <input name={name} value={form[name]} onChange={handleChange} required {...inputProps} />
            </label>
          ))}

          <label className="field">
            <span>Payment method</span>
            <select name="payment" value={form.payment} onChange={handleChange}>
              <option value="cod">Cash on delivery</option>
              <option value="card">Credit / debit card</option>
              <option value="upi">UPI</option>
            </select>
          </label>

          <button type="submit" className="btn btn--lg">
            Place Order
          </button>
        </form>

        <aside className="summary">
          <h2>Your order</h2>
          <ul className="summary__list">
            {items.map((item) => (
              <li key={item.id} className="summary__row">
                <span>{item.title} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <p className="summary__row summary__total">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </p>
        </aside>
      </div>
    </section>
  );
}
