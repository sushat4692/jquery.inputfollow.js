module.exports = {
  env: {
    browser: false,
    node: true,
    es6: false,
    jquery: true
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    sourceType: "module"
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended'
  ],
  plugins: [
    '@typescript-eslint'
  ],
  globals: {
    window: true,
    document: true
  },
  rules: {
    'no-unused-variable': 0,
    'no-unused-vars': 0,
    'no-prototype-builtins': 0,
    'require-atomic-updates': 0,
    '@typescript-eslint/no-unused-vars': [
      2, {'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_'}
    ],
    'prettier/prettier': [
      'error', {
        'singleQuote': true,
        'semi': false,
        'printWidth': 80,
        'tabWidth': 2
      }
    ]
  }
}
