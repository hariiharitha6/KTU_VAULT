import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    plugins: { react },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // JSX references must count as usage so no-unused-vars doesn't flag components.
      'react/jsx-uses-vars': 'error',
      // `_` is the codebase-wide convention for intentionally-ignored args AND catch params.
      'no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      // Intentional empty catch blocks (`catch (_) {}`) are used to swallow errors codebase-wide.
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
])