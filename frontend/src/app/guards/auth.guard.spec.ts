import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom } from 'rxjs';

import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';

import { AuthSelectors } from '@app/store/auth';
import { NavActions } from '@app/store/nav';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let store: MockStore;

  let dispatchSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        provideMockStore({
          selectors: [{ selector: AuthSelectors.selectIsAdmin, value: false }],
        }),
      ],
    });

    guard = TestBed.inject(AuthGuard);
    store = TestBed.inject(MockStore);

    dispatchSpy = jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should allow navigation when user is an admin', async () => {
      store.overrideSelector(AuthSelectors.selectIsAdmin, true);
      const route = Object.assign(new ActivatedRouteSnapshot(), {
        _routerState: { url: '/article/add' },
      });

      const result = await firstValueFrom(guard.canActivate(route));

      expect(result).toBe(true);
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should block navigation and dispatch pageAccessDenied when user is not admin', async () => {
      store.overrideSelector(AuthSelectors.selectIsAdmin, false);
      const route = Object.assign(new ActivatedRouteSnapshot(), {
        _routerState: { url: '/article/add' },
      });

      const result = await firstValueFrom(guard.canActivate(route));

      expect(result).toBe(false);
      expect(dispatchSpy).toHaveBeenCalledWith(
        NavActions.pageAccessDenied({ pageHeading: 'Add Article' }),
      );
    });
  });
});
