import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import searchReducer from './searchSlice';

const STORAGE_KEY = 'shoppyglobe-cart';

// Restore the cart after a page refresh (fails safely if storage is unavailable)
const loadCart = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : undefined;
  } catch {
    return undefined;
  }
};

const savedItems = loadCart();

const store = configureStore({
  reducer: { cart: cartReducer, search: searchReducer },
  preloadedState: savedItems ? { cart: { items: savedItems } } : undefined,
});

// Save the cart whenever it changes
store.subscribe(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState().cart.items));
  } catch {
    /* storage full or blocked: the cart still works in memory */
  }
});

export default store;
