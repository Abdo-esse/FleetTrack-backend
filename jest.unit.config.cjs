module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  // No setupFilesAfterEnv - unit tests don't need database
  testMatch: ["**/tests/unit/**/*.test.js"],
  moduleFileExtensions: ["js", "json", "node"],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/app.js", // Exclude app.js which has swagger setup
  ],
};
