import { createSlice } from '@reduxjs/toolkit';

// Holds the text typed in the product search box
const searchSlice = createSlice({
  name: 'search',
  initialState: { query: '' },
  reducers: {
    setSearchQuery(state, action) {
      state.query = action.payload;
    },
  },
});

export const { setSearchQuery } = searchSlice.actions;
export default searchSlice.reducer;
