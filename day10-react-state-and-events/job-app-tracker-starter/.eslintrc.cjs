module.exports = {
  env: { browser: true, es2020: true },
  plugins: ['testing-library', 'jest-dom', 'vitest'],
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended',
    'plugin:vitest/recommended',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'warn',
  },
}
