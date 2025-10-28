// Minimal ESM flat config that does not require extra packages.
// It mirrors the conservative rule defined in `eslint.config.cjs` so `npx eslint`
// can run consistently whether ESLint loads the CJS or ESM variant.
// ESM flat config that uses @typescript-eslint/parser (if installed) so ESLint
// can parse TypeScript files when running from the repo root. This mirrors the
// conservative rule in `eslint.config.cjs`.
import parser from "@typescript-eslint/parser";

export default [
	{
		files: ["**/*.ts", "**/*.tsx", "**/*.js"],
		languageOptions: {
			parser,
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: "module",
			},
		},
		rules: {
			"no-unused-vars": [
				"error",
				{ "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }
			],
		},
	},
];
