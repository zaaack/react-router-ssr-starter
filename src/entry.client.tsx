import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  matchRoutes,
  RouterProvider,
} from "react-router";
import { Routes, routes } from '@generouted/react-router'
// import { routes, createRoutes } from './routes'
// const Routes = createRoutes()
hydrate();

async function hydrate() {
  // Determine if any of the initial routes are lazy
  let lazyMatches = matchRoutes(routes, window.location)?.filter(
    (m) => m.route.lazy
  );

  // Load the lazy matches and update the routes before creating your router
  // so we can hydrate the SSR-rendered content synchronously
  if (lazyMatches && lazyMatches?.length > 0) {
    await Promise.all(
      lazyMatches.map(async (m) => {
        let routeModule = await m.route.lazy!();
        Object.assign(m.route, { ...routeModule, lazy: undefined });
      })
    );
  }

// ReactDOM.createRoot(document.getElementById('app')!).render(
//   <React.StrictMode>
//      <Routes />
//   </React.StrictMode>
// )
  ReactDOM.hydrateRoot(
    document.getElementById('app')!,
    <React.StrictMode>
      <Routes />
    </React.StrictMode>
  )
}
