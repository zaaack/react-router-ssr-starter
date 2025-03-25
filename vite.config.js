import * as path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import rollupReplace from "@rollup/plugin-replace";

import generouted from '@generouted/react-router/plugin'
// https://vitejs.dev/config/
export default defineConfig(conf=>{return {
  build: {
    minify: conf.isSsrBuild ? false : 'oxc',
  },
  server: {
    port: 3000,
  },
  esbuild: false,
  experimental: {
    enableNativePlugin: false, // only build, dev cause error
  },
  plugins: [
    generouted({
      output: './src/router.gen.ts',
    }),
    // rollupReplace({
    //   preventAssignment: true,
    //   values: {
    //     "process.env.NODE_ENV": JSON.stringify("development"),
    //   },
    // }),
    // react(),
  ],
  ssr: {
    noExternal: ['@generouted/react-router']
  }
}});
