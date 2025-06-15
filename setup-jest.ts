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

jest.useFakeTimers({
  doNotFake: ['nextTick'],
  timerLimit: 1000,
  now: 0,
});

setupZoneTestEnv();
