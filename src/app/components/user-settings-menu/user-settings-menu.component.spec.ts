import { StoreModule } from '@ngrx/store';
import { ngMocks } from 'ng-mocks';
import { of } from 'rxjs';

import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';

import { AppActions } from '@app/store/app';

import { UserSettingsMenuComponent } from './user-settings-menu.component';

describe('UserSettingsMenuComponent', () => {
  let component: UserSettingsMenuComponent;
  let fixture: ComponentFixture<UserSettingsMenuComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        StoreModule.forRoot({}),
        RouterModule.forRoot([]),
        UserSettingsMenuComponent,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(UserSettingsMenuComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
      });
  });

  describe('when NOT logged in', () => {
    beforeEach(() => {
      ngMocks.stubMember(
        component,
        'userSettingsMenuViewModel$',
        of({
          user: null,
          isDarkMode: true,
          isSafeMode: true,
        }),
      );

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
      expect(element('.user-name')).toBeNull();
    });

    it('should render theme toggle menu item', () => {
      expect(element('.theme-toggle')).not.toBeNull();
    });

    it('should dispatch `themeToggled` action when theme toggle menu item is clicked', () => {
      const dispatchSpy = jest.spyOn(component['store'], 'dispatch');
      component.onToggleTheme();

      expect(dispatchSpy).toHaveBeenCalledWith(AppActions.themeToggled());
    });

    it('should NOT render safe mode toggle menu item', () => {
      expect(element('.safe-mode-toggle')).toBeNull();
    });

    it('should NOT render change password menu item', () => {
      expect(element('.change-password')).toBeNull();
    });

    it('should NOT render admin logout menu item', () => {
      expect(element('.admin-logout')).toBeNull();
    });

    it('should render admin login menu item', () => {
      expect(element('.admin-login')).not.toBeNull();
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
      ngMocks.stubMember(
        component,
        'userSettingsMenuViewModel$',
        of({
          user: {
            id: '123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john_doe@test.com',
            isAdmin: true,
          },
          isDarkMode: true,
          isSafeMode: true,
        }),
      );

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
      expect(element('.user-name').nativeElement.textContent.trim()).toBe('John Doe');
    });

    it('should render theme toggle menu item', () => {
      expect(element('.theme-toggle')).not.toBeNull();
    });

    it('should dispatch `themeToggled` action when theme toggle menu item is clicked', () => {
      const dispatchSpy = jest.spyOn(component['store'], 'dispatch');
      component.onToggleTheme();

      expect(dispatchSpy).toHaveBeenCalledWith(AppActions.themeToggled());
    });

    it('should render safe mode toggle menu item', () => {
      expect(element('.safe-mode-toggle')).not.toBeNull();
    });

    it('should dispatch `safeModeToggled` action when safe mode toggle menu item is clicked', () => {
      const dispatchSpy = jest.spyOn(component['store'], 'dispatch');
      component.onToggleSafeMode();

      expect(dispatchSpy).toHaveBeenCalledWith(AppActions.safeModeToggled());
    });

    it('should render change password menu item', () => {
      expect(element('.change-password')).not.toBeNull();
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
      expect(element('.admin-logout')).not.toBeNull();
    });

    it('should emit `close` event on logout', () => {
      const closeSpy = jest.spyOn(component.close, 'emit');
      component.onLogout();

      expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it('should NOT render admin login menu item', () => {
      expect(element('.admin-login')).toBeNull();
    });
  });

  function element(selector: string): DebugElement {
    return fixture.debugElement.query(By.css(selector));
  }
});
