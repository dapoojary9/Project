import { createSlice } from "@reduxjs/toolkit";
import { initialBooks } from "../data/books.js";

// Redux slice that manages the list of books.
const booksSlice = createSlice({
  name: "books",
  initialState: { list: initialBooks },
  reducers: {
    // Adds the new book to the START of the list so it shows first.
    addBook(state, action) {
      state.list.unshift(action.payload);
    },
  },
});

export const { addBook } = booksSlice.actions;
export default booksSlice.reducer;
