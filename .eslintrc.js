module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2025,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    },
    project: './tsconfig.json'
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: ['@typescript-eslint', 'react-hooks'],
  rules: {
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [2, {
      args: 'none',
      vars: 'all'
    }],
    'consistent-return': 'off',
    'func-names': 'off',
    'import/no-unresolved': 'off',
    'no-continue': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-return-assign': 'off',
    'no-shadow': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-expressions': 'off',
    'no-use-before-define': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error'
  },
  settings: {
    react: {
      version: require('./package.json').dependencies.react,
    },
  },
  globals: {
    'define': true,
    '__DEV__': true,
    '__ENV__': true,
    '__VERSION__': true,
    '__WATCH__': true,
  }
};
