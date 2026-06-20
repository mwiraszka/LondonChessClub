import { Config } from 'jest';

const jestConfig: Config = {
  clearMocks: true,
  restoreMocks: true,
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@env': '<rootDir>/src/environments/environment',
    '^lichess-pgn-viewer$': '<rootDir>/src/__mocks__/lichess-pgn-viewer.js',
    '^@angular/core/testing$':
      '<rootDir>/node_modules/@angular/core/fesm2022/testing.mjs',
    '^@angular/common/http/testing$':
      '<rootDir>/node_modules/@angular/common/fesm2022/http-testing.mjs',
    '^@ngrx/store/testing$':
      '<rootDir>/node_modules/@ngrx/store/fesm2022/ngrx-store-testing.mjs',
    '^@angular/platform-browser/testing$':
      '<rootDir>/node_modules/@angular/platform-browser/fesm2022/testing.mjs',
    '^@angular/router/testing$':
      '<rootDir>/node_modules/@angular/router/fesm2022/testing.mjs',
  },
  preset: 'jest-preset-angular',
  transform: {
    '^.+\\.(ts|js|mjs|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@angular/common/locales/.*\\.js$|.*marked/))',
  ],
};

export default jestConfig;
