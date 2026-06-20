import { Config } from 'jest';

const jestConfig: Config = {
  clearMocks: true,
  coveragePathIgnorePatterns: ['/node_modules/'],
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec).[tj]s?(x)'],
  verbose: true,
  transform: { '^.+\\.tsx?$': ['ts-jest', { rootDir: '.' }] },
};

export default jestConfig;
