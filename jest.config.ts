import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  rootDir: 'src',

  // Define the file extensions Jest should recognize
  moduleFileExtensions: ['js', 'json', 'ts'],

  // Use ts-jest to transpile TypeScript files
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  // Define the test regex pattern
  testRegex: '.*\\.spec\\.ts$',

  // Map your path aliases to their corresponding paths
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/$1',
  },

  // Optionally, specify setup files if needed
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Collect coverage information
  collectCoverage: true,
  coverageDirectory: '../coverage',
  coverageReporters: ['text', 'lcov'],
};

export default config;
