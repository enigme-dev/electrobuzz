import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  modulePaths: ["<rootDir>/src"],
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/*.type.ts",
    "!<rootDir>/.next/**",
    "!<rootDir>/coverage/**",
    "!<rootDir>/*.config.js",
    "!<rootDir>/src/lib/**",
    "!<rootDir>/src/app/**",
  ],
  testEnvironment: "node",
  openHandlesTimeout: 0,
};

export default createJestConfig(config);
