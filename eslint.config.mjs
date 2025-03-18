import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";
import reactCompiler from "eslint-plugin-react-compiler";

export default tseslint.config(tseslint.configs.recommendedTypeChecked, tseslint.configs.stylisticTypeChecked, {
  plugins: {
    "react-compiler": reactCompiler,
  },
  languageOptions: {
    parser: tsParser,
    ecmaVersion: "latest",
    sourceType: "module",
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
    "react-compiler/react-compiler": "error",
  },
});
