import { Config } from 'jest';

const jestConfig: Config = {
  preset: 'jest-preset-angular',
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@env': '<rootDir>/src/environments/environment',
  },
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  clearMocks: true,
};

export default jestConfig;
