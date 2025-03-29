import * as path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import generouted from '@generouted/react-router/plugin'
// https://vitejs.dev/config/
export default defineConfig(conf => {
  return {
    resolve: {
      alias: {
        "#": path.resolve(__dirname, "./src"),
        "~": path.resolve(__dirname, "./src"),
      },
      external: ['events', 'foy']
    },
    build: {
      minify: conf.isSsrBuild ? false : 'oxc',
      modulePreload: false,
    },
    server: {
      port: 3000,
    },
    esbuild: false,
    experimental: {
      enableNativePlugin: conf.command === 'build', // only build, dev cause error
    },
    plugins: [
      generouted({
        output: './src/router.gen.ts',
      }),

    ],
    ssr: {
      noExternal: ['@generouted/react-router'],
    },
  }
});
