
module.exports = {
  env: { es2021: true, node: true },
  extends: ["eslint:recommended", "plugin:node/recommended", "prettier"],
  parserOptions: { ecmaVersion: 12, sourceType: "module" },
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "node/no-unsupported-features/es-syntax": ["error", { ignores: ["modules"] }],
    // Personnaliser selon vos besoins
  },
};
