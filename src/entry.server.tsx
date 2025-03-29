import type * as express from "express";
import * as React from "react";
import ReactDOMServer from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router";
// import { routes } from "./routes";
import { routes } from '@generouted/react-router'
export { ApiRouter } from "./express-routes/router";

var PRESERVED = import.meta.glob("/src/pages/(_app|404).{jsx,tsx}", { eager: true });
var MODALS = import.meta.glob("/src/pages/**/[+]*.{jsx,tsx}", { eager: true });
var ROUTES = import.meta.glob(["/src/pages/**/[\\w[-]*.{jsx,tsx,mdx}", "!/src/pages/**/(_!(layout)*(/*)?|_app|404)*"], { eager: true });
console.log("PRESERVED, MODALS, ROUTES", PRESERVED, MODALS, ROUTES);

export async function render(
  request: express.Request,
  response: express.Response
) {
  let { query, dataRoutes } = createStaticHandler(routes);
  let remixRequest = createFetchRequest(request, response);
  let context = await query(remixRequest);

  if (context instanceof Response) {
    throw context;
  }

  let router = createStaticRouter(dataRoutes, context);
  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <StaticRouterProvider
        router={router}
        context={context}
        nonce="the-nonce"
      />
    </React.StrictMode>
  );
}

export function createFetchRequest(
  req: express.Request,
  res: express.Response
): Request {
  let origin = `${req.protocol}://${req.get("host")}`;
  // Note: This had to take originalUrl into account for presumably vite's proxying
  let url = new URL(req.originalUrl || req.url, origin);

  let controller = new AbortController();
  res.on("close", () => controller.abort());

  let headers = new Headers();

  for (let [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (let value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  let init: RequestInit = {
    method: req.method,
    headers,
    signal: controller.signal,
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req.body;
  }

  return new Request(url.href, init);
}
