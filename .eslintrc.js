module.exports = {
  plugins: ["jest"],
  overrides: [
    {
      files: ["**/*.test.js"],
      env: { "jest/globals": true },
      plugins: ["jest"],
      extends: ["plugin:jest/recommended"],
    },
  ],
};