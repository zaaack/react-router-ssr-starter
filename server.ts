import path from "path";
import fsp from "fs/promises"
import express from "express"
import type { ViteDevServer } from "vite";
import { ApiRouter } from "./src/express-routes/router";
import compression from 'compression'

let root = process.cwd();
let isProduction = process.env.NODE_ENV === "production";

function resolve(p: string) {
  return path.resolve(__dirname, p);
}

async function createServer() {
  let app = express();
  let vite: ViteDevServer;

  if (!isProduction) {
    vite = await import("vite")
      .then((m) => m.createServer({ server: { middlewareMode: true }, root, appType: 'custom' }));

    app.use(vite.middlewares);
  } else {
    app.use(compression());
    app.use(express.static(resolve("dist/client")));
  }

  app.use("/api", ApiRouter);

  app.use("*", async (req, res) => {
    let url = req.originalUrl;
    try {
      let template;
      let render;

      if (!isProduction) {
        template = await fsp.readFile(resolve("index.html"), "utf8");
        template = await vite.transformIndexHtml(url, template);
        render = await vite
          .ssrLoadModule("src/entry.server.tsx")
          .then((m) => m.render);
      } else {
        template = await fsp.readFile(
          resolve("dist/client/index.html"),
          "utf8"
        );
        render = require(resolve("dist/server/entry.server.js")).render;
      }

      try {
        let appHtml = await render(req, res);
        let html = template.replace("<!--app-html-->", appHtml);
        res.setHeader("Content-Type", "text/html");
        return res.status(200).end(html);
      } catch (e) {
        if (e instanceof Response && e.status >= 300 && e.status <= 399) {
          return res.location(e.headers.get("Location") as string);
        }
        throw e;
      }
    } catch (error) {
      if (error instanceof Error) {
        if (!isProduction) {
          vite.ssrFixStacktrace(error);
        }
        console.log(error.stack);
        res.status(500).end(error.message+'\n'+error.stack);
      } else {
        res.status(500).end("Internal Server Error："+error);
      }
    }
  });

  return app;
}

createServer().then((app) => {
  app.listen(3000, () => {
    console.log("HTTP server is running at http://localhost:3000");
  });
});
