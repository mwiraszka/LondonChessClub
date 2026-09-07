import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { User } from '@app/models';
import { ClerkService } from '@app/services';
import { AppActions, AppSelectors } from '@app/store/app';
import { AuthSelectors } from '@app/store/auth';
import { query, queryTextContent } from '@app/utils';

import { UserSettingsMenuComponent } from './user-settings-menu.component';

describe('UserSettingsMenuComponent', () => {
  let fixture: ComponentFixture<UserSettingsMenuComponent>;
  let component: UserSettingsMenuComponent;

  let store: MockStore;

  let closeSpy: MockInstance;
  let dispatchSpy: MockInstance;
  let logOutSpy: Mock;
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
      imports: [UserSettingsMenuComponent],
      providers: [
        provideMockStore(),
        { provide: ClerkService, useValue: { user: () => null, logOut: logOutSpy } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSettingsMenuComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(MockStore);

    store.overrideSelector(AuthSelectors.selectUser, mockUser);
    store.overrideSelector(AppSelectors.selectIsSafeMode, true);

    closeSpy = vi.spyOn(component.close, 'emit');
    dispatchSpy = vi.spyOn(store, 'dispatch');
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

  it('should render nothing when no user is logged in', () => {
    store.overrideSelector(AuthSelectors.selectUser, null);
    store.refreshState();

    fixture.detectChanges();

    expect(query(fixture.debugElement, '.menu-items')).toBeFalsy();
  });

  it('should show the user name, email, account, safe mode, and log out items', () => {
    expect(queryTextContent(fixture.debugElement, '.user-name')).toContain('John Doe');
    expect(queryTextContent(fixture.debugElement, '.user-email')).toContain(
      'john.doe@example.com',
    );
    expect(query(fixture.debugElement, '.account')).toBeTruthy();
    expect(query(fixture.debugElement, '.safe-mode-toggle')).toBeTruthy();
    expect(query(fixture.debugElement, '.admin-logout')).toBeTruthy();
  });

  it('should dispatch safeModeToggled', () => {
    component.onToggleSafeMode();

    expect(dispatchSpy).toHaveBeenCalledWith(AppActions.safeModeToggled());
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
