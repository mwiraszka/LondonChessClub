import { Config } from 'jest';

const jestConfig: Config = {
  clearMocks: true,
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@env': '<rootDir>/src/environments/environment',
    '^lichess-pgn-viewer$': '<rootDir>/src/__mocks__/lichess-pgn-viewer.js',
  },
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jest-environment-jsdom',
};

export default jestConfig;
