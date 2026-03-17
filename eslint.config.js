import js from "@eslint/js";
import perfectionist from "eslint-plugin-perfectionist";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["dist/*"],
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: { ecmaVersion: 2020, globals: globals.browser },
    plugins: { perfectionist },
    rules: {
      "@typescript-eslint/array-type": "off",
      "import/consistent-type-specifier-style": ["warn", "prefer-inline"],
      "@typescript-eslint/no-unnecessary-condition": "off",
      "no-unsafe-optional-chaining": "warn",
      "no-empty-pattern": "off",
      "import/order": "off",
      "perfectionist/sort-imports": [
        "warn",
        {
          type: "natural",
          order: "asc",
          ignoreCase: true,
          internalPattern: ["^@/.*"],
          groups: ["builtin", "external", "internal", ["parent", "sibling"], "index", "type"],
        },
      ],
      "perfectionist/sort-jsx-props": [
        "warn",
        {
          type: "natural",
          order: "asc",
          ignoreCase: true,
          groups: ["group-key-id", "unknown", "group-className", "group-props", "group-callback-on"],
          customGroups: [
            { groupName: "group-key-id", elementNamePattern: "^(key|id|name|label)|(^.+Id$)" },
            { groupName: "group-className", elementNamePattern: "^className" },
            { groupName: "group-callback-on", elementNamePattern: "^on.+" },
            { groupName: "group-props", elementNamePattern: ".+Props$" },
          ],
        },
      ],
    },
  },
]);
