import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  // Next.js base rules: Core Web Vitals + React Hooks + a11y
  ...nextVitals,

  // TypeScript-aware rules
  ...nextTs,

  // ---- Custom rules layered on top (order matters: these override the above) ----
  {
    rules: {
      // Catch dead imports / unused vars (allow intentionally-unused args prefixed with _)
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      // Flag missing/incorrect useEffect/useCallback deps (guards against stale closures)
      "react-hooks/exhaustive-deps": "warn",

      // Keep console noise out of production, but allow warn/error
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // Discourage `any` — keeps things honest alongside Zod schemas
      "@typescript-eslint/no-explicit-any": "warn",

      // Catch risky `!` non-null assertions that can bypass Zod-validated checks
      "@typescript-eslint/no-non-null-assertion": "warn",
    },
  },

  // ---- Folder-scoped overrides ----
   {
    // Relax console rule inside API routes / server code
    files: ["src/app/api/**/*.ts", "server/**/*.ts"],
    rules: {
      "no-console": "off",
    },
  },
  {
    // Email templates aren't browser-rendered JSX, so raw apostrophes/quotes are fine
    files: ["emails/**/*.tsx"],
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },


  // ---- Ignores ----
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
]);

export default eslintConfig;