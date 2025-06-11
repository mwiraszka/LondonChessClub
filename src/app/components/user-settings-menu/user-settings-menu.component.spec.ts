import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';

import { AppActions, AppSelectors } from '@app/store/app';
import { AuthSelectors } from '@app/store/auth';
import { query, queryTextContent } from '@app/utils';

import { UserSettingsMenuComponent } from './user-settings-menu.component';

describe('UserSettingsMenuComponent', () => {
  let component: UserSettingsMenuComponent;
  let fixture: ComponentFixture<UserSettingsMenuComponent>;
  let router: Router;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [RouterModule.forRoot([]), UserSettingsMenuComponent],
      providers: [provideMockStore()],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(UserSettingsMenuComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        store = TestBed.inject(MockStore);
      });
  });

  afterEach(() => {
    store.resetSelectors();
  });

  describe('when NOT logged in', () => {
    beforeEach(() => {
      store.overrideSelector(AppSelectors.selectIsDarkMode, true);
      store.overrideSelector(AppSelectors.selectIsSafeMode, true);
      store.overrideSelector(AuthSelectors.selectUser, null);

      fixture.detectChanges();
    });

    it('should update visibility on init after 30ms', done => {
      component.ngOnInit();
      expect(component['visibility']).toBe('hidden');

      setTimeout(() => {
        expect(component['visibility']).toBe('visible');
        done();
      }, 30);
    });

    it("should NOT render user's first and last name", () => {
      expect(query(fixture.debugElement, '.user-name')).toBeNull();
    });

    it('should render theme toggle menu item', () => {
      expect(query(fixture.debugElement, '.theme-toggle')).not.toBeNull();
    });

    it('should dispatch `themeToggled` action when theme toggle menu item is clicked', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.onToggleTheme();

      expect(dispatchSpy).toHaveBeenCalledWith(AppActions.themeToggled());
    });

    it('should NOT render safe mode toggle menu item', () => {
      expect(query(fixture.debugElement, '.safe-mode-toggle')).toBeNull();
    });

    it('should NOT render change password menu item', () => {
      expect(query(fixture.debugElement, '.change-password')).toBeNull();
    });

    it('should NOT render admin logout menu item', () => {
      expect(query(fixture.debugElement, '.admin-logout')).toBeNull();
    });

    it('should render admin login menu item', () => {
      expect(query(fixture.debugElement, '.admin-login')).not.toBeNull();
    });

    it('should navigate to login route and emit `close` event when admin login menu item is clicked', () => {
      const navigateSpy = jest
        .spyOn(router, 'navigate')
        .mockImplementation(() => Promise.resolve(true));
      const closeSpy = jest.spyOn(component.close, 'emit');

      component.onLogin();
      expect(navigateSpy).toHaveBeenCalledWith(['login']);
      expect(closeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      store.overrideSelector(AppSelectors.selectIsDarkMode, true);
      store.overrideSelector(AppSelectors.selectIsSafeMode, true);
      store.overrideSelector(AuthSelectors.selectUser, {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john_doe@test.com',
        isAdmin: true,
      });

      fixture.detectChanges();
    });

    it('should update visibility on init after 30ms', done => {
      component.ngOnInit();
      expect(component['visibility']).toBe('hidden');

      setTimeout(() => {
        expect(component['visibility']).toBe('visible');
        done();
      }, 30);
    });

    it("should render user's first and last name", () => {
      expect(queryTextContent(fixture.debugElement, '.user-name')).toBe('John Doe');
    });

    it('should render theme toggle menu item', () => {
      expect(query(fixture.debugElement, '.theme-toggle')).not.toBeNull();
    });

    it('should dispatch `themeToggled` action when theme toggle menu item is clicked', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.onToggleTheme();

      expect(dispatchSpy).toHaveBeenCalledWith(AppActions.themeToggled());
    });

    it('should render safe mode toggle menu item', () => {
      expect(query(fixture.debugElement, '.safe-mode-toggle')).not.toBeNull();
    });

    it('should dispatch `safeModeToggled` action when safe mode toggle menu item is clicked', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.onToggleSafeMode();

      expect(dispatchSpy).toHaveBeenCalledWith(AppActions.safeModeToggled());
    });

    it('should render change password menu item', () => {
      expect(query(fixture.debugElement, '.change-password')).not.toBeNull();
    });

    it('should navigate to change-password route and emit `close` event when change password menu item is clicked', () => {
      const navigateSpy = jest
        .spyOn(router, 'navigate')
        .mockImplementation(() => Promise.resolve(true));
      const closeSpy = jest.spyOn(component.close, 'emit');

      component.onChangePassword();
      expect(navigateSpy).toHaveBeenCalledWith(['change-password']);
      expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it('should render admin logout menu item', () => {
      expect(query(fixture.debugElement, '.admin-logout')).not.toBeNull();
    });

    it('should emit `close` event on logout', () => {
      const closeSpy = jest.spyOn(component.close, 'emit');
      component.onLogout();

      expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it('should NOT render admin login menu item', () => {
      expect(query(fixture.debugElement, '.admin-login')).toBeNull();
    });
  });
});
