import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Loader from './components/Loader';

// Every page is loaded on demand (code splitting)
const ProductList = lazy(() => import('./components/ProductList'));
const ProductDetail = lazy(() => import('./components/ProductDetail'));
const Cart = lazy(() => import('./components/Cart'));
const Checkout = lazy(() => import('./components/Checkout'));
const NotFound = lazy(() => import('./components/NotFound'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    // errorElement renders outside <App />, so it needs its own Suspense boundary
    errorElement: (
      <Suspense fallback={<Loader />}>
        <NotFound />
      </Suspense>
    ),
    children: [
      { index: true, element: <ProductList /> }, // Home
      { path: 'product/:id', element: <ProductDetail /> }, // dynamic route parameter
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: '*', element: <NotFound /> }, // any unknown URL -> 404 page
    ],
  },
]);

export default router;
