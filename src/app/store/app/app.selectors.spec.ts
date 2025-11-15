import { CallState } from '@app/models';

import { AppState } from './app.reducer';
import * as AppSelectors from './app.selectors';

describe('App Selectors', () => {
  const mockAppState: AppState = {
    isDarkMode: true,
    isSafeMode: false,
    bannerLastCleared: '2025-01-15T10:30:00.000Z',
    showUpcomingEventBanner: false,
  };

  const mockArticlesCallState: CallState = {
    status: 'idle',
    error: null,
    loadStart: null,
  };

  const mockAuthCallState: CallState = {
    status: 'loading',
    error: null,
    loadStart: null,
  };

  const mockEventsCallState: CallState = {
    status: 'idle',
    error: null,
    loadStart: null,
  };

  const mockImagesCallState: CallState = {
    status: 'idle',
    error: null,
    loadStart: null,
  };

  const mockMembersCallState: CallState = {
    status: 'idle',
    error: null,
    loadStart: null,
  };

  describe('selectAppState', () => {
    it('should select the app state', () => {
      const state = {
        appState: mockAppState,
      };

      const result = AppSelectors.selectAppState(state as { appState: AppState });

      expect(result).toEqual(mockAppState);
    });
  });

  describe('selectIsLoading', () => {
    it('should return true when any call state is loading', () => {
      const result = AppSelectors.selectIsLoading.projector(
        mockArticlesCallState,
        mockAuthCallState,
        mockEventsCallState,
        mockImagesCallState,
        mockMembersCallState,
      );

      expect(result).toBe(true);
    });

    it('should return false when no call states are loading', () => {
      const result = AppSelectors.selectIsLoading.projector(
        mockArticlesCallState,
        mockEventsCallState,
        mockEventsCallState,
        mockImagesCallState,
        mockMembersCallState,
      );

      expect(result).toBe(false);
    });

    it('should return true when articles call state is loading', () => {
      const loadingArticlesCallState: CallState = {
        status: 'loading',
        error: null,
        loadStart: null,
      };

      const result = AppSelectors.selectIsLoading.projector(
        loadingArticlesCallState,
        mockEventsCallState,
        mockEventsCallState,
        mockImagesCallState,
        mockMembersCallState,
      );

      expect(result).toBe(true);
    });

    it('should return true when events call state is loading', () => {
      const loadingEventsCallState: CallState = {
        status: 'loading',
        error: null,
        loadStart: null,
      };

      const result = AppSelectors.selectIsLoading.projector(
        mockArticlesCallState,
        mockEventsCallState,
        loadingEventsCallState,
        mockImagesCallState,
        mockMembersCallState,
      );

      expect(result).toBe(true);
    });

    it('should return true when images call state is loading', () => {
      const loadingImagesCallState: CallState = {
        status: 'loading',
        error: null,
        loadStart: null,
      };

      const result = AppSelectors.selectIsLoading.projector(
        mockArticlesCallState,
        mockEventsCallState,
        mockEventsCallState,
        loadingImagesCallState,
        mockMembersCallState,
      );

      expect(result).toBe(true);
    });

    it('should return true when members call state is loading', () => {
      const loadingMembersCallState: CallState = {
        status: 'loading',
        error: null,
        loadStart: null,
      };

      const result = AppSelectors.selectIsLoading.projector(
        mockArticlesCallState,
        mockEventsCallState,
        mockEventsCallState,
        mockImagesCallState,
        loadingMembersCallState,
      );

      expect(result).toBe(true);
    });

    it('should return true when multiple call states are loading', () => {
      const loadingCallState: CallState = {
        status: 'loading',
        error: null,
        loadStart: null,
      };

      const result = AppSelectors.selectIsLoading.projector(
        loadingCallState,
        loadingCallState,
        loadingCallState,
        mockImagesCallState,
        mockMembersCallState,
      );

      expect(result).toBe(true);
    });
  });

  describe('selectIsDarkMode', () => {
    it('should select isDarkMode when true', () => {
      const result = AppSelectors.selectIsDarkMode.projector(mockAppState);

      expect(result).toBe(true);
    });

    it('should select isDarkMode when false', () => {
      const state: AppState = {
        ...mockAppState,
        isDarkMode: false,
      };

      const result = AppSelectors.selectIsDarkMode.projector(state);

      expect(result).toBe(false);
    });
  });

  describe('selectIsSafeMode', () => {
    it('should select isSafeMode when false', () => {
      const result = AppSelectors.selectIsSafeMode.projector(mockAppState);

      expect(result).toBe(false);
    });

    it('should select isSafeMode when true', () => {
      const state: AppState = {
        ...mockAppState,
        isSafeMode: true,
      };

      const result = AppSelectors.selectIsSafeMode.projector(state);

      expect(result).toBe(true);
    });
  });

  describe('selectShowUpcomingEventBanner', () => {
    it('should select showUpcomingEventBanner when false', () => {
      const result = AppSelectors.selectShowUpcomingEventBanner.projector(mockAppState);

      expect(result).toBe(false);
    });

    it('should select showUpcomingEventBanner when true', () => {
      const state: AppState = {
        ...mockAppState,
        showUpcomingEventBanner: true,
      };

      const result = AppSelectors.selectShowUpcomingEventBanner.projector(state);

      expect(result).toBe(true);
    });
  });

  describe('selectBannerLastCleared', () => {
    it('should select bannerLastCleared when it has a value', () => {
      const result = AppSelectors.selectBannerLastCleared.projector(mockAppState);

      expect(result).toBe('2025-01-15T10:30:00.000Z');
    });

    it('should select bannerLastCleared when it is null', () => {
      const state: AppState = {
        ...mockAppState,
        bannerLastCleared: null,
      };

      const result = AppSelectors.selectBannerLastCleared.projector(state);

      expect(result).toBeNull();
    });
  });
});
