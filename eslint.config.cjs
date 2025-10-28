/**
 * Conservative flat ESLint config (CommonJS)
 * This file avoids requiring special helper libraries so it can run with the
 * `npx eslint` environment. It enables a conservative `no-unused-vars` rule
 * so `--fix` can remove unused imports/vars safely.
 */
module.exports = [
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js"],
    languageOptions: {
      // Use the TypeScript parser module directly so ESLint sees its parse API.
      // If the parser is not installed, this will throw; in most runs we
      // provide it via `npx -p` so it's available in the runtime.
      parser: (() => {
        try {
          return require("@typescript-eslint/parser");
        } catch (e) {
          // If the parser is not available, leave undefined so ESLint will
          // fall back to default parsing (and produce parse errors).
          return undefined;
        }
      })(),
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    rules: {
      // Base rule is less TypeScript-aware than the TS plugin, but it's
      // safe and avoids requiring additional packages in the config.
      "no-unused-vars": [
        "error",
        { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }
      ],
    },
  },
];
