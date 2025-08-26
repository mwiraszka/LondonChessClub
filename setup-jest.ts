import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(), // deprecated
  removeListener: jest.fn(), // deprecated
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

setupZoneTestEnv();

// Silence expected console warnings/errors during tests to reduce noise while preserving unexpected logs.
const ORIGINAL_CONSOLE_WARN = console.warn;
const ORIGINAL_CONSOLE_ERROR = console.error;
const ORIGINAL_CONSOLE_LOG = console.log;

const IGNORED_WARN_PATTERNS: RegExp[] = [
  /\[LCC] Found game with an invalid score/, // PGN viewer test data
  /\[LCC] Found game with an undefined (White|Black) player/, // PGN viewer test data
  /Deprecation warning: value provided is not in a recognized RFC2822 or ISO format/, // moment fallback in tests
  /loadPackages: TypeError \[ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG]/, // ng2-pdf-viewer dynamic import noise
];

const IGNORED_LOG_PATTERNS: RegExp[] = [
  /Warning: loadPackages: TypeError \[ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG]/,
];

const IGNORED_ERROR_PATTERNS: RegExp[] = [
  /\[LCC] Could not parse document load progress data:/, // Document viewer progress edge cases
  /\[LCC] Unable to parse ratings to determine new peak rating/, // Rating util invalid inputs in tests
  /\[LCC] Sort error: property 'key' does not exist/, // custom sort util negative tests
  /\[LCC] Unable to convert data URL and filename to File:/, // dataUrlToFile negative test cases
];

function shouldIgnore(message: unknown, patterns: RegExp[]): boolean {
  const msg = typeof message === 'string' ? message : (message?.toString?.() ?? '');
  return patterns.some(p => p.test(msg));
}

console.warn = (...args: unknown[]) => {
  if (shouldIgnore(args[0], IGNORED_WARN_PATTERNS)) {
    return;
  }
  ORIGINAL_CONSOLE_WARN(...(args as unknown[]));
};

console.error = (...args: unknown[]) => {
  if (shouldIgnore(args[0], IGNORED_ERROR_PATTERNS)) {
    return;
  }
  ORIGINAL_CONSOLE_ERROR(...(args as unknown[]));
};

console.log = (...args: unknown[]) => {
  if (shouldIgnore(args[0], IGNORED_LOG_PATTERNS)) {
    return;
  }
  ORIGINAL_CONSOLE_LOG(...(args as unknown[]));
};
