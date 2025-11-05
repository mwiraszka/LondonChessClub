import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DialogService } from '@app/services';
import { AuthActions, AuthSelectors } from '@app/store/auth';

import { UserActivityService } from './user-activity.service';

describe('UserActivityService', () => {
  let service: UserActivityService;
  let dialogService: DialogService;
  let store: MockStore;

  let dialogOpenSpy: jest.SpyInstance;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserActivityService,
        provideMockStore({
          selectors: [
            { selector: AuthSelectors.selectSessionStartTime, value: null },
            { selector: AuthSelectors.selectCallState, value: { status: 'idle' } },
          ],
        }),
        { provide: DialogService, useValue: { open: jest.fn() } },
      ],
    });

    service = TestBed.inject(UserActivityService);
    dialogService = TestBed.inject(DialogService);
    store = TestBed.inject(MockStore);

    dialogOpenSpy = jest.spyOn(dialogService, 'open');
    dispatchSpy = jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('auto-refresh', () => {
    it('should request session refresh when user is active and session is past minimum duration for auto-refresh', fakeAsync(() => {
      const sessionStartTime =
        Date.now() - UserActivityService.MIN_SESSION_DURATION_FOR_AUTO_REFRESH_MS;
      store.overrideSelector(AuthSelectors.selectSessionStartTime, sessionStartTime);

      service.monitorSessionExpiry();

      document.dispatchEvent(new Event('mousemove'));
      tick(UserActivityService.SESSION_CHECK_INTERVAL_MS);

      expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.sessionRefreshRequested());
    }));

    it('should NOT request session refresh when user is active but session is NOT past minimum duration for auto-refresh', fakeAsync(() => {
      const sessionStartTime =
        Date.now() -
        UserActivityService.MIN_SESSION_DURATION_FOR_AUTO_REFRESH_MS +
        UserActivityService.SESSION_CHECK_INTERVAL_MS;
      store.overrideSelector(AuthSelectors.selectSessionStartTime, sessionStartTime);

      service.monitorSessionExpiry();

      document.dispatchEvent(new Event('mousemove'));
      tick(UserActivityService.SESSION_CHECK_INTERVAL_MS);

      expect(dispatchSpy).not.toHaveBeenCalled();
    }));

    it('should NOT request session refresh when session is past minimum duration for auto-refresh but user is NOT active', fakeAsync(() => {
      const sessionStartTime =
        Date.now() - UserActivityService.MIN_SESSION_DURATION_FOR_AUTO_REFRESH_MS;
      store.overrideSelector(AuthSelectors.selectSessionStartTime, sessionStartTime);

      service.monitorSessionExpiry();

      tick(UserActivityService.SESSION_CHECK_INTERVAL_MS);

      expect(dispatchSpy).not.toHaveBeenCalled();
    }));
  });

  describe('warning dialog', () => {
    it('should show warning dialog when session is past minimum duration for warning dialog', fakeAsync(() => {
      const sessionStartTime =
        Date.now() - UserActivityService.MIN_SESSION_DURATION_FOR_WARNING_DIALOG_MS;
      store.overrideSelector(AuthSelectors.selectSessionStartTime, sessionStartTime);

      service.monitorSessionExpiry();
      tick(UserActivityService.SESSION_CHECK_INTERVAL_MS);

      expect(dialogOpenSpy).toHaveBeenCalled();
    }));

    it('should not show dialog if already open', fakeAsync(() => {
      const sessionStartTime =
        Date.now() - UserActivityService.MIN_SESSION_DURATION_FOR_WARNING_DIALOG_MS;
      store.overrideSelector(AuthSelectors.selectSessionStartTime, sessionStartTime);

      service.monitorSessionExpiry();
      tick(UserActivityService.SESSION_CHECK_INTERVAL_MS);

      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);

      tick(UserActivityService.SESSION_CHECK_INTERVAL_MS);

      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
    }));

    it('should not trigger actions when session start time is null', fakeAsync(() => {
      store.overrideSelector(AuthSelectors.selectSessionStartTime, null);

      service.monitorSessionExpiry();
      tick(UserActivityService.SESSION_CHECK_INTERVAL_MS);

      expect(dispatchSpy).not.toHaveBeenCalled();
    }));
  });
});
