import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "./booksSlice.js";

// Central Redux store
export default configureStore({ reducer: { books: booksReducer } });
