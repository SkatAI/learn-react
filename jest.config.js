// jest.config.js

const nextJest = require("next/jest");

const createJestConfig = nextJest({
    dir: "./",
});

const customJestConfig = {
    testEnvironment: "jsdom", // Ensure this is correct
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    transform: {
        "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "babel-jest",
    },
};

module.exports = createJestConfig(customJestConfig);
