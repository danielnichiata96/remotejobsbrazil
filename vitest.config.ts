import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"]
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
  // Stub Next.js server-only marker during tests to a no-op module
  "server-only": path.resolve(__dirname, "test/mocks/server-only.ts"),
    },
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
    loader: "tsx",
  },
});
