Shoppy

A small e-commerce app built with React + Vite, Redux Toolkit and React Router (createBrowserRouter).
Products come from the https://dummyjson.com/products API.

Features

- Product list with live search (search text lives in Redux)
- Product detail page fetched by route parameter (`/product/:id`)
- Cart: add, remove, change quantity (never below 1), clear
- Checkout: dummy form + order summary, "Order placed" message, cart is emptied and you return Home
- 404 / route-error page showing status, path and message
- Every page and component is code-split with `React.lazy` + `Suspense`; images use `loading="lazy"`
- Responsive layout (mobile to desktop)

