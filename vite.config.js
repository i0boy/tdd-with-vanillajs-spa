import legacy from "@vitejs/plugin-legacy";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [
    legacy({
      targets: ["ie >= 11"],
    }),
  ],
  resolve: {
    alias: [{ find: "src", replacement: path.resolve(__dirname, "./src") }],
  },
  test: {
    environment: "jsdom", // or 'jsdom', 'node',
    setupFiles: ["./src/setup.js"],
    globals: true,
  },
});
