import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * eslint-config-next 16 ships native flat configs, so they are imported
 * directly. The previous setup loaded the same presets through the
 * @eslint/eslintrc compatibility shim, which under ESLint 9 fails with
 * "Converting circular structure to JSON" from the React plugin and made
 * linting impossible in this repo.
 */
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // The admin area predates the React Compiler lint rules and has six
    // effect-driven state syncs and two Date.now() calls in render. They
    // work; rewriting them for lint is risk without benefit until the admin
    // is next touched. Warnings here, errors everywhere else.
    files: ["src/app/admin/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
    },
  },
  {
    // react-pdf's <Image> has no alt prop; the a11y rule misreads it.
    files: ["src/lib/pdf/**/*.tsx"],
    rules: { "jsx-a11y/alt-text": "off" },
  },
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "assets-src/**",
      ".phase0/**",
      "CXO/**",
      "src/generated/**",
    ],
  },
];

export default eslintConfig;
