/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.base.json",
      },
    ],
  },
  collectCoverageFrom: ["**/src/*.ts"],
  testPathIgnorePatterns: ["packages/extension/"],
};
