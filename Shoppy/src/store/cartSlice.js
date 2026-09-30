import { createSlice } from '@reduxjs/toolkit';

// Cart state: { items: [{ id, title, price, thumbnail, quantity }] }
// createSlice generates the action creators and the reducer for us.
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    // Add a product, or bump its quantity if it is already in the cart
    addToCart(state, action) {
      const { id, title, price, thumbnail } = action.payload;
      const existing = state.items.find((item) => item.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ id, title, price, thumbnail, quantity: 1 });
      }
    },
    // Remove a product completely (payload = product id)
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    increaseQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
    },
    // Quantity can never go below 1 (use removeFromCart to delete)
    decreaseQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
