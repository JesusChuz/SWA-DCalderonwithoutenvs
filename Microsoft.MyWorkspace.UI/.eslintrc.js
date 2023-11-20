module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:react-redux/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:jest/recommended',
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2015,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'react-hooks',
    'import',
    'react-redux',
    'jsx-a11y',
    'jest',
    'testing-library',
    'jest-dom',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  overrides: [
    {
      files: ['./src/**/*.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'import/namespace': 'off',
        'react/prop-types': 'off', // Does not work properly with TypeScript
        'react/display-name': 'off',
        'react-hooks/exhaustive-deps': 'off',
        'react-redux/no-unused-prop-types': 'off', // Does not work properly with TypeScript
        'jsx-a11y/click-events-have-key-events': 'warn', // Will keep as warning for awareness
        'jsx-a11y/no-static-element-interactions': 'warn', // Will keep as warning for awareness
        'jsx-a11y/interactive-supports-focus': 'warn', // Will keep as warning for awareness
        'jest/no-large-snapshots': 'error',
        'jest/no-identical-title': 'error',
        'import/no-duplicates': 'error',
        'import/no-named-as-default': 'off',
      },
      parserOptions: {
        project: ['./tsconfig.json'], // Specify it only for TypeScript files
      },
    },
  ],
};
