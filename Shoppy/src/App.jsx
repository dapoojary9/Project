import { lazy, Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import Loader from './components/Loader';

// Header is also code-split; it loads in its own chunk
const Header = lazy(() => import('./components/Header'));

// Main component: shared layout (header + the page chosen by the router)
export default function App() {
  return (
    <>
      <Suspense fallback={<div className="header header--placeholder" />}>
        <Header />
      </Suspense>

      <main className="container">
        {/* Outlet renders the matched route; Suspense shows a loader while its chunk downloads */}
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>

      <ScrollRestoration />
    </>
  );
}
