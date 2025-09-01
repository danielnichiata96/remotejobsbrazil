import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  // Forbid importing server-only jobs module em código client (componentes/hooks)
  {
    files: ["src/components/**/*.ts", "src/components/**/*.tsx", "src/hooks/**/*.ts", "src/hooks/**/*.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/jobs",
              message: "Não importe '@/lib/jobs' em componentes client. Use '@/lib/jobs.shared'.",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
