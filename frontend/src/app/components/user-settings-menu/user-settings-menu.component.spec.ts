import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleSwitchComponent } from '@app/components/toggle-switch/toggle-switch.component';
import { User } from '@app/models';
import { AppActions } from '@app/store/app';
import { AppSelectors } from '@app/store/app';
import { AuthActions, AuthSelectors } from '@app/store/auth';
import { query, queryTextContent } from '@app/utils';

import { UserSettingsMenuComponent } from './user-settings-menu.component';

describe('UserSettingsMenuComponent', () => {
  let fixture: ComponentFixture<UserSettingsMenuComponent>;
  let component: UserSettingsMenuComponent;

  let store: MockStore;

  let closeSpy: jest.SpyInstance;
  let dispatchSpy: jest.SpyInstance;
  let routerSpy: jest.SpyInstance;

  const mockUser: User = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    isAdmin: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleSwitchComponent, UserSettingsMenuComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSettingsMenuComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(MockStore);

    store.overrideSelector(AuthSelectors.selectUser, null);
    store.overrideSelector(AppSelectors.selectIsDarkMode, false);
    store.overrideSelector(AppSelectors.selectIsSafeMode, true);
    store.overrideSelector(AppSelectors.selectIsDesktopView, false);
    store.overrideSelector(AppSelectors.selectIsWideView, false);

    closeSpy = jest.spyOn(component.close, 'emit');
    dispatchSpy = jest.spyOn(store, 'dispatch');
    // @ts-expect-error Private class member
    routerSpy = jest.spyOn(component.router, 'navigate');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onToggleTheme', () => {
    it('should dispatch themeToggled action', () => {
      component.onToggleTheme();

      expect(dispatchSpy).toHaveBeenCalledWith(AppActions.themeToggled());
    });
  });

  describe('onToggleSafeMode', () => {
    it('should dispatch safeModeToggled action', () => {
      component.onToggleSafeMode();

      expect(dispatchSpy).toHaveBeenCalledWith(AppActions.safeModeToggled());
    });
  });

  describe('onToggleWideView', () => {
    it('should dispatch wideViewToggled action', () => {
      component.onToggleWideView();

      expect(dispatchSpy).toHaveBeenCalledWith(AppActions.wideViewToggled());
    });
  });

  describe('onRefreshData', () => {
    it('should dispatch refreshAppRequested action and emit close event', () => {
      component.onRefreshData();

      expect(dispatchSpy).toHaveBeenCalledWith(AppActions.refreshAppRequested());
      expect(closeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onLogin', () => {
    it('should navigate to login page and emit close event', () => {
      component.onLogin();

      expect(routerSpy).toHaveBeenCalledWith(['login']);
      expect(closeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onLogout', () => {
    it('should dispatch logout action and emit close event', () => {
      component.onLogout();

      expect(dispatchSpy).toHaveBeenCalledWith(
        AuthActions.logoutRequested({ sessionExpired: false }),
      );
      expect(closeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onChangePassword', () => {
    it('should navigate to change password page and emit close event', () => {
      component.onChangePassword();

      expect(routerSpy).toHaveBeenCalledWith(['change-password']);
      expect(closeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('template rendering', () => {
    it('should display user name when user is logged in', () => {
      store.overrideSelector(AuthSelectors.selectUser, mockUser);
      store.refreshState();
      fixture.detectChanges();

      expect(queryTextContent(fixture.debugElement, '.user-name span')).toBe(
        `${mockUser.firstName} ${mockUser.lastName}`,
      );
    });

    it('should not display user name when user is not logged in', () => {
      expect(query(fixture.debugElement, '.user-name')).toBeFalsy();
    });

    it('should show admin login button when user is not logged in', () => {
      expect(query(fixture.debugElement, '.admin-login')).toBeTruthy();
    });

    it('should show logout and change password options when user is logged in', () => {
      store.overrideSelector(AuthSelectors.selectUser, mockUser);
      store.refreshState();
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.change-password')).toBeTruthy();
      expect(query(fixture.debugElement, '.admin-logout')).toBeTruthy();
    });

    it('should set correct toggle switch properties based on store state', () => {
      store.overrideSelector(AppSelectors.selectIsDarkMode, true);
      store.overrideSelector(AppSelectors.selectIsSafeMode, false);
      store.refreshState();
      fixture.detectChanges();

      const themeToggle = query(fixture.debugElement, '.theme-toggle lcc-toggle-switch');
      expect(themeToggle.componentInstance.switchedOn).toBe(true);

      store.overrideSelector(AuthSelectors.selectUser, mockUser);
      store.refreshState();
      fixture.detectChanges();

      const safeModeToggle = query(
        fixture.debugElement,
        '.safe-mode-toggle lcc-toggle-switch',
      );
      expect(safeModeToggle.componentInstance.switchedOn).toBe(false);
      expect(safeModeToggle.componentInstance.warningWhenOff).toBe(true);
    });
  });
});
