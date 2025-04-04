module.exports = {
  root: true,
  extends: ["@nuxt/eslint-config", "plugin:prettier/recommended"],
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  plugins: ["import"],
  rules: {
    "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
    "@typescript-eslint/no-unused-vars": ["warn"],
    eqeqeq: ["warn", "smart"],
    "import/default": ["warn"],
    "import/export": ["warn"],
    "import/first": ["warn"],
    "import/namespace": ["warn"],
    "import/newline-after-import": ["warn"],
    "import/no-duplicates": ["warn"],
    "import/no-mutable-exports": ["warn"],
    "import/no-named-as-default": ["off"],
    "import/no-named-as-default-member": ["off"],
    "import/no-unresolved": ["off"],
    "import/order": [
      "warn",
      {
        alphabetize: {
          caseInsensitive: true,
          order: "asc",
          orderImportKind: "asc",
        },
        groups: [
          ["builtin", "external"],
          "internal",
          ["index", "sibling", "parent"],
        ],
        "newlines-between": "always",
        pathGroups: [
          {
            group: "internal",
            pattern: "~/**",
          },
          {
            group: "internal",
            pattern: "@/**",
          },
          {
            group: "builtin",
            pattern: "#i18n",
          },
          {
            group: "builtin",
            pattern: "#components",
          },
          {
            group: "builtin",
            pattern: "#app",
          },
          {
            group: "builtin",
            pattern: "#auth/**",
          },
        ],
      },
    ],
    "no-console": "warn",
    "no-unused-vars": "off",
    "padding-line-between-statements": [
      "warn",
      {
        blankLine: "always",
        next: "return",
        prev: "*",
      },
      {
        blankLine: "always",
        next: ["const", "let", "var", "if", "function"],
        prev: ["block-like", "function", "if"],
      },
    ],
    "prefer-template": ["warn"],
    "prettier/prettier": [
      "warn",
      {
        arrowParens: "always",
        endOfLine: "auto",
        htmlWhitespaceSensitivity: "ignore",
        printWidth: 80,
        semi: true,
        singleAttributePerLine: true,
        singleQuote: false,
        trailingComma: "all",
        vueIndentScriptAndStyle: false,
      },
    ],
    quotes: [
      1,
      "double",
      {
        allowTemplateLiterals: false,
        avoidEscape: true,
      },
    ],
    "sort-imports": [
      "warn",
      {
        allowSeparatedGroups: true,
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
      },
    ],
  },
  // to make eslint work with nuxt auto-imports
  globals: {
    ref: "readonly",
    computed: "readonly",
    watch: "readonly",
    watchEffect: "readonly",
  },
  overrides: [
    {
      files: ["*.test.js", "*.spec.js"],
      rules: {
        "no-undef": "off", // eslint doesn't know about vitest globals like `test`, `expect`, etc.
      },
    },
    {
      files: ["pages/**"],
      rules: { "vue/multi-word-component-names": "off" },
    },
    {
      files: ["components/**"],
      rules: { "vue/require-toggle-inside-transition": "off" },
    },
  ],
};
