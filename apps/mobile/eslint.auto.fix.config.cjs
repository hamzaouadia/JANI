// Temporary config used only for an automated aggressive cleanup run.
// It reuses the project's base config and adds `eslint-plugin-unused-imports`
// to remove unused imports automatically. This file is safe to remove after use.
const base = require('./.eslintrc.js');

module.exports = {
  ...base,
  plugins: Array.from(new Set([...(base.plugins || []), 'unused-imports'])),
  rules: {
    // Let the unused-imports plugin handle removing unused imports.
    'unused-imports/no-unused-imports': 'error',
    // prevent conflicts: disable overlapping rules
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    // keep existing rules from base
    ...(base.rules || {}),
  },
};
