import moment from 'moment-timezone';

import * as AppActions from './app.actions';
import { AppState, appReducer, initialState } from './app.reducer';

describe('App Reducer', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = { type: 'Unknown' };
      const state = appReducer(initialState, action);

      expect(state).toBe(initialState);
    });
  });

  describe('initialState', () => {
    it('should have the correct initial state', () => {
      expect(initialState).toEqual({
        isDarkMode: expect.any(Boolean),
        isSafeMode: false,
        bannerLastCleared: null,
        showUpcomingEventBanner: true,
      });
    });

    it('should initialize isDarkMode based on system preference', () => {
      // The initialState is already evaluated, so we just verify it's a boolean
      // (the actual value depends on the system's color scheme at module load time)
      expect(typeof initialState.isDarkMode).toBe('boolean');
    });
  });

  describe('themeToggled', () => {
    it('should toggle isDarkMode from false to true', () => {
      const previousState: AppState = {
        ...initialState,
        isDarkMode: false,
      };

      const action = AppActions.themeToggled();
      const state = appReducer(previousState, action);

      expect(state.isDarkMode).toBe(true);
      expect(state).not.toBe(previousState);
    });

    it('should toggle isDarkMode from true to false', () => {
      const previousState: AppState = {
        ...initialState,
        isDarkMode: true,
      };

      const action = AppActions.themeToggled();
      const state = appReducer(previousState, action);

      expect(state.isDarkMode).toBe(false);
    });

    it('should preserve other state properties', () => {
      const previousState: AppState = {
        ...initialState,
        isDarkMode: false,
        isSafeMode: true,
        showUpcomingEventBanner: false,
      };

      const action = AppActions.themeToggled();
      const state = appReducer(previousState, action);

      expect(state.isSafeMode).toBe(true);
      expect(state.showUpcomingEventBanner).toBe(false);
    });
  });

  describe('safeModeToggled', () => {
    it('should toggle isSafeMode from false to true', () => {
      const previousState: AppState = {
        ...initialState,
        isSafeMode: false,
      };

      const action = AppActions.safeModeToggled();
      const state = appReducer(previousState, action);

      expect(state.isSafeMode).toBe(true);
      expect(state).not.toBe(previousState);
    });

    it('should toggle isSafeMode from true to false', () => {
      const previousState: AppState = {
        ...initialState,
        isSafeMode: true,
      };

      const action = AppActions.safeModeToggled();
      const state = appReducer(previousState, action);

      expect(state.isSafeMode).toBe(false);
    });

    it('should preserve other state properties', () => {
      const previousState: AppState = {
        ...initialState,
        isSafeMode: false,
        isDarkMode: true,
        showUpcomingEventBanner: false,
      };

      const action = AppActions.safeModeToggled();
      const state = appReducer(previousState, action);

      expect(state.isDarkMode).toBe(true);
      expect(state.showUpcomingEventBanner).toBe(false);
    });
  });

  describe('upcomingEventBannerCleared', () => {
    it('should set showUpcomingEventBanner to false', () => {
      const previousState: AppState = {
        ...initialState,
        showUpcomingEventBanner: true,
        bannerLastCleared: null,
      };

      const action = AppActions.upcomingEventBannerCleared();
      const state = appReducer(previousState, action);

      expect(state.showUpcomingEventBanner).toBe(false);
    });

    it('should set bannerLastCleared to current timestamp', () => {
      const beforeTime = Date.now();

      const previousState: AppState = {
        ...initialState,
        showUpcomingEventBanner: true,
        bannerLastCleared: null,
      };

      const action = AppActions.upcomingEventBannerCleared();
      const state = appReducer(previousState, action);

      const afterTime = Date.now();

      expect(state.bannerLastCleared).toBeTruthy();
      const timestamp = new Date(state.bannerLastCleared!).getTime();
      expect(timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(timestamp).toBeLessThanOrEqual(afterTime);
    });

    it('should preserve other state properties', () => {
      const previousState: AppState = {
        ...initialState,
        isDarkMode: true,
        isSafeMode: true,
        showUpcomingEventBanner: true,
      };

      const action = AppActions.upcomingEventBannerCleared();
      const state = appReducer(previousState, action);

      expect(state.isDarkMode).toBe(true);
      expect(state.isSafeMode).toBe(true);
    });
  });

  describe('upcomingEventBannerReinstated', () => {
    it('should set showUpcomingEventBanner to true', () => {
      const previousState: AppState = {
        ...initialState,
        showUpcomingEventBanner: false,
        bannerLastCleared: moment().toISOString(),
      };

      const action = AppActions.upcomingEventBannerReinstated();
      const state = appReducer(previousState, action);

      expect(state.showUpcomingEventBanner).toBe(true);
    });

    it('should reset bannerLastCleared to null', () => {
      const previousState: AppState = {
        ...initialState,
        showUpcomingEventBanner: false,
        bannerLastCleared: moment().toISOString(),
      };

      const action = AppActions.upcomingEventBannerReinstated();
      const state = appReducer(previousState, action);

      expect(state.bannerLastCleared).toBeNull();
    });

    it('should preserve other state properties', () => {
      const previousState: AppState = {
        ...initialState,
        isDarkMode: true,
        isSafeMode: true,
        showUpcomingEventBanner: false,
      };

      const action = AppActions.upcomingEventBannerReinstated();
      const state = appReducer(previousState, action);

      expect(state.isDarkMode).toBe(true);
      expect(state.isSafeMode).toBe(true);
    });
  });

  describe('state immutability', () => {
    it('should not mutate the previous state', () => {
      const previousState: AppState = {
        ...initialState,
        isDarkMode: false,
        isSafeMode: false,
        showUpcomingEventBanner: true,
        bannerLastCleared: null,
      };
      const originalState = { ...previousState };

      const action = AppActions.themeToggled();
      const state = appReducer(previousState, action);

      expect(previousState).toEqual(originalState);
      expect(state).not.toBe(previousState);
    });
  });
});
