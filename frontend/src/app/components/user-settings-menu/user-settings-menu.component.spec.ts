import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleSwitchComponent } from '@app/components/toggle-switch/toggle-switch.component';
import { User } from '@app/models';
import { AuthDrawerService, ClerkService } from '@app/services';
import { AppSelectors } from '@app/store/app';
import { AuthSelectors } from '@app/store/auth';
import { query, queryTextContent } from '@app/utils';

import { UserSettingsMenuComponent } from './user-settings-menu.component';

describe('UserSettingsMenuComponent', () => {
  let fixture: ComponentFixture<UserSettingsMenuComponent>;
  let component: UserSettingsMenuComponent;

  let authDrawerService: AuthDrawerService;
  let store: MockStore;

  let closeSpy: MockInstance;
  let logOutSpy: Mock;
  let openLoginSpy: MockInstance;
  let routerSpy: MockInstance;

  const mockUser: User = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    isAdmin: true,
  };

  beforeEach(async () => {
    logOutSpy = vi.fn().mockResolvedValue(undefined);

    await TestBed.configureTestingModule({
      imports: [ToggleSwitchComponent, UserSettingsMenuComponent],
      providers: [
        provideMockStore(),
        { provide: ClerkService, useValue: { user: () => null, logOut: logOutSpy } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSettingsMenuComponent);
    component = fixture.componentInstance;

    authDrawerService = TestBed.inject(AuthDrawerService);
    store = TestBed.inject(MockStore);

    store.overrideSelector(AuthSelectors.selectUser, null);
    store.overrideSelector(AppSelectors.selectIsDarkMode, false);
    store.overrideSelector(AppSelectors.selectIsSafeMode, true);
    store.overrideSelector(AppSelectors.selectIsDesktopView, false);
    store.overrideSelector(AppSelectors.selectIsWideView, false);

    closeSpy = vi.spyOn(component.close, 'emit');
    openLoginSpy = vi.spyOn(authDrawerService, 'openLogin');
    // @ts-expect-error Private class member
    routerSpy = vi.spyOn(component.router, 'navigate');

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logged out', () => {
    it('should show a log in item and no account or log out items', () => {
      expect(queryTextContent(fixture.debugElement, '.admin-login')).toContain('Log in');
      expect(query(fixture.debugElement, '.account')).toBeFalsy();
      expect(query(fixture.debugElement, '.admin-logout')).toBeFalsy();
    });

    it('should open the login drawer and close the menu on log in', () => {
      component.onLogin();

      expect(openLoginSpy).toHaveBeenCalled();
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('logged in', () => {
    beforeEach(() => {
      store.overrideSelector(AuthSelectors.selectUser, mockUser);
      store.refreshState();
      fixture.detectChanges();
    });

    it('should show the user name with account and log out items', () => {
      expect(queryTextContent(fixture.debugElement, '.user-name')).toContain('John Doe');
      expect(query(fixture.debugElement, '.account')).toBeTruthy();
      expect(query(fixture.debugElement, '.admin-logout')).toBeTruthy();
      expect(query(fixture.debugElement, '.admin-login')).toBeFalsy();
    });

    it('should navigate to the account page and close the menu', () => {
      component.onAccount();

      expect(routerSpy).toHaveBeenCalledWith(['account']);
      expect(closeSpy).toHaveBeenCalled();
    });

    it('should log out via Clerk and navigate home', async () => {
      await component.onLogout();

      expect(logOutSpy).toHaveBeenCalled();
      expect(routerSpy).toHaveBeenCalledWith(['/']);
      expect(closeSpy).toHaveBeenCalled();
    });
  });
});
