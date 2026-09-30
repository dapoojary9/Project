// Selectors: small functions that read data out of the Redux state.

export const selectCartItems = (state) => state.cart.items;

// Total number of units in the cart (used for the header badge)
export const selectCartCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

// Total price of everything in the cart
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const selectSearchQuery = (state) => state.search.query;
