import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextConfigPath = require.resolve("eslint-config-next");
const nextConfigDir = path.dirname(nextConfigPath);

const resolveFromNext = (moduleName) =>
  require.resolve(moduleName, { paths: [nextConfigDir] });

const reactPlugin = require(resolveFromNext("eslint-plugin-react"));
const reactHooksPlugin = require(resolveFromNext("eslint-plugin-react-hooks"));
const nextPlugin = require(resolveFromNext("@next/eslint-plugin-next"));
const importPlugin = require(resolveFromNext("eslint-plugin-import"));
const jsxA11yPlugin = require(resolveFromNext("eslint-plugin-jsx-a11y"));
const tsParser = require(resolveFromNext("@typescript-eslint/parser"));

const config = [
  {
    ignores: [".next/**", "node_modules/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,cjs}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@next/next": nextPlugin,
      import: importPlugin,
      "jsx-a11y": jsxA11yPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      "import/no-anonymous-default-export": "warn",
      "react/no-unknown-property": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "jsx-a11y/alt-text": [
        "warn",
        {
          elements: ["img"],
          img: ["Image"],
        },
      ],
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/aria-proptypes": "warn",
      "jsx-a11y/aria-unsupported-elements": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "jsx-a11y/role-supports-aria-props": "warn",
      "react/jsx-no-target-blank": "off",
    },
  },
];

export default config;
