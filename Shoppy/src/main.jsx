import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import store from './store/store';
import router from './router';
import './styles/base.css';
import './styles/header.css';
import './styles/products.css';
import './styles/cart.css';
import './styles/checkout.css';

// Redux Provider makes the store available everywhere; RouterProvider runs the routes
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
