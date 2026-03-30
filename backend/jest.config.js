module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  setupFiles: ["<rootDir>/tests/setupEnv.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  clearMocks: true,
};
