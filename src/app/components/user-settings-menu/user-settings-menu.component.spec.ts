import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToggleSwitchComponent, UserSettingsMenuComponent],
      providers: [provideMockStore()],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(UserSettingsMenuComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(MockStore);

        store.overrideSelector(AuthSelectors.selectUser, null);
        store.overrideSelector(AppSelectors.selectIsDarkMode, false);
        store.overrideSelector(AppSelectors.selectIsSafeMode, true);

        closeSpy = jest.spyOn(component.close, 'emit');
        dispatchSpy = jest.spyOn(store, 'dispatch');
        // @ts-expect-error Private class member
        routerSpy = jest.spyOn(component.router, 'navigate');

        fixture.detectChanges();
      });
  });

  it('should display user name when user is logged in', () => {
    store.overrideSelector(AuthSelectors.selectUser, mockUser);
    store.refreshState();
    fixture.detectChanges();

    expect(queryTextContent(fixture.debugElement, '.user-name span')).toBe(
      `${mockUser.firstName} ${mockUser.lastName}`,
    );
  });

  it('should not display user name when user is not logged in', () => {
    expect(query(fixture.debugElement, '.user-name')).toBeNull();
  });

  it('should show admin login button when user is not logged in', () => {
    expect(query(fixture.debugElement, '.admin-login')).not.toBeNull();
  });

  it('should show logout and change password options when user is logged in', () => {
    store.overrideSelector(AuthSelectors.selectUser, mockUser);
    store.refreshState();
    fixture.detectChanges();

    expect(query(fixture.debugElement, '.change-password')).not.toBeNull();
    expect(query(fixture.debugElement, '.admin-logout')).not.toBeNull();
  });

  it('should dispatch themeToggled action when theme toggle is clicked', () => {
    component.onToggleTheme();

    expect(dispatchSpy).toHaveBeenCalledWith(AppActions.themeToggled());
  });

  it('should dispatch safeModeToggled action when safe mode toggle is clicked', () => {
    component.onToggleSafeMode();

    expect(dispatchSpy).toHaveBeenCalledWith(AppActions.safeModeToggled());
  });

  it('should navigate to login page and emit close event when login is clicked', () => {
    component.onLogin();

    expect(routerSpy).toHaveBeenCalledWith(['login']);
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('should dispatch logout action and emit close event when logout is clicked', () => {
    component.onLogout();

    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.logoutRequested({}));
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to change password page and emit close event when change password is clicked', () => {
    component.onChangePassword();

    expect(routerSpy).toHaveBeenCalledWith(['change-password']);
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('should set correct toggle switch properties based on store state', () => {
    store.overrideSelector(AppSelectors.selectIsDarkMode, true);
    store.overrideSelector(AppSelectors.selectIsSafeMode, false);
    store.refreshState();
    fixture.detectChanges();

    const themeToggle = fixture.debugElement.query(
      By.css('.theme-toggle lcc-toggle-switch'),
    );
    expect(themeToggle.componentInstance.switchedOn).toBe(true);

    store.overrideSelector(AuthSelectors.selectUser, mockUser);
    store.refreshState();
    fixture.detectChanges();

    const safeModeToggle = fixture.debugElement.query(
      By.css('.safe-mode-toggle lcc-toggle-switch'),
    );
    expect(safeModeToggle.componentInstance.switchedOn).toBe(false);
    expect(safeModeToggle.componentInstance.warningWhenOff).toBe(true);
  });
});
