import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["src/**/*.{js,jsx}"],
    plugins: {
      import: importPlugin,
    },
    // import 경로 해석 및 확장자 관련 설정
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx"],
        },
      },
      "import/extensions": [".js", ".jsx"],
    },
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      // 대문자 상수는 unused-vars 검사 제외
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],

      // import 관련 린트 규칙
      "import/no-unresolved": "error",
      "import/extensions": ["error", "ignorePackages", { js: "never", jsx: "never" }],
    },
  },
]);
