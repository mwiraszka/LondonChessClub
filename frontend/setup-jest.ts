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

// Silence expected console errors/warnings/logs/infos during tests to reduce noise
const ORIGINAL_CONSOLE_ERROR = console.error;
const ORIGINAL_CONSOLE_WARN = console.warn;
const ORIGINAL_CONSOLE_LOG = console.log;
const ORIGINAL_CONSOLE_INFO = console.info;

const IGNORED_ERROR_PATTERNS: RegExp[] = [
  /\[LCC] Could not parse document load progress data:/, // Document viewer progress edge cases
  /\[LCC] Unable to parse ratings to determine new peak rating/, // Rating util invalid inputs in tests
  /\[LCC] Sort error: property 'key' does not exist/, // custom sort util negative tests
  /\[LCC] Unable to convert data URL and filename to File:/, // dataUrlToFile negative test cases
  /Could not parse CSS stylesheet/, // JSDOM CSS parsing errors with Angular CDK
  /\[LCC].*"name":"LCCError"/, // LCCError test cases (stringified objects)
  /"name":"LCCError"/, // LCCError test cases without prefix
  /NG0304:.*'lcc-markdown-renderer' is not a known element/, // Markdown renderer in test mocks
  /NG0303:.*Can't bind to 'data' since it isn't a known property of 'lcc-markdown-renderer'/, // Markdown renderer binding in test mocks
  /NG0303:.*Can't bind to 'images' since it isn't a known property of 'lcc-markdown-renderer'/, // Markdown renderer binding in test mocks
  /NG0303:.*Can't bind to 'isWideView' since it isn't a known property of 'lcc-markdown-renderer'/, // Markdown renderer binding in test mocks
  /NG0303:.*Can't bind to 'disableSanitizer' since it isn't a known property of 'markdown'/, // Markdown renderer binding in test mocks
  /Cannot read properties of undefined \(reading 'isDarkMode'\)/, // App state selector in tests without mock app state
  /Cannot read properties of undefined \(reading 'isSafeMode'\)/, // App state selector in tests without mock app state
  /Cannot read properties of undefined \(reading 'isDesktopView'\)/, // App state selector in tests without mock app state
  /Cannot read properties of undefined \(reading 'isWideView'\)/, // App state selector in tests without mock app state
  /Cannot read properties of undefined \(reading 'bannerLastCleared'\)/, // App state selector in tests without mock app state
  /Cannot read properties of undefined \(reading 'showUpcomingEventBanner'\)/, // App state selector in tests without mock app state
];

const IGNORED_WARN_PATTERNS: RegExp[] = [
  /\[LCC] Found game with an invalid score/, // PGN viewer test data
  /\[LCC] Found game with an undefined (White|Black) player/, // PGN viewer test data
  /Deprecation warning: value provided is not in a recognized RFC2822 or ISO format/, // moment fallback in tests
  /loadPackages: TypeError \[ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG]/, // ng2-pdf-viewer dynamic import noise
];

const IGNORED_LOG_PATTERNS: RegExp[] = [
  /Warning: loadPackages: TypeError \[ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG]/,
];

const IGNORED_INFO_PATTERNS: RegExp[] = [
  /^Request$/, // Logging interceptor request logs
  /\[LCC] Clearing stale data from local storage/, // Meta-reducer version migration logs
  /\[LCC] Removed stale key:/, // Meta-reducer removing old storage keys
  /\[LCC] Welcome to version/, // App version welcome message
];

function shouldIgnore(message: unknown, patterns: RegExp[]): boolean {
  let msg: string;
  if (typeof message === 'string') {
    msg = message.trim();
  } else if (message instanceof Error) {
    msg = message.toString();
  } else if (typeof message === 'object' && message !== null) {
    // Handle objects (like LCCError) by stringifying them
    msg = JSON.stringify(message);
  } else {
    msg = (message?.toString?.() ?? '').trim();
  }
  return patterns.some(p => p.test(msg));
}

console.error = (...args: unknown[]) => {
  // Check if any argument should be ignored
  if (args.some(arg => shouldIgnore(arg, IGNORED_ERROR_PATTERNS))) {
    return;
  }
  ORIGINAL_CONSOLE_ERROR(...(args as unknown[]));
};

console.warn = (...args: unknown[]) => {
  if (shouldIgnore(args[0], IGNORED_WARN_PATTERNS)) {
    return;
  }
  ORIGINAL_CONSOLE_WARN(...(args as unknown[]));
};

console.log = (...args: unknown[]) => {
  if (shouldIgnore(args[0], IGNORED_LOG_PATTERNS)) {
    return;
  }
  ORIGINAL_CONSOLE_LOG(...(args as unknown[]));
};

console.info = (...args: unknown[]) => {
  if (shouldIgnore(args[0], IGNORED_INFO_PATTERNS)) {
    return;
  }
  ORIGINAL_CONSOLE_INFO(...(args as unknown[]));
};
