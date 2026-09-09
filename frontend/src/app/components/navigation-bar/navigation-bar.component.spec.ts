import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { User } from '@app/models';
import { AuthDrawerService, ClerkService } from '@app/services';
import { AppActions, AppSelectors } from '@app/store/app';
import { AuthSelectors } from '@app/store/auth';
import { query } from '@app/utils';

import { NavigationBarComponent } from './navigation-bar.component';

describe('NavigationBarComponent', () => {
  let fixture: ComponentFixture<NavigationBarComponent>;
  let component: NavigationBarComponent;

  let authDrawerService: AuthDrawerService;
  let store: MockStore;

  let dispatchSpy: MockInstance;
  let openLoginSpy: MockInstance;

  const mockUser: User = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    isAdmin: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationBarComponent, RouterModule.forRoot([])],
      providers: [
        provideMockStore(),
        { provide: ClerkService, useValue: { user: () => null } },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '123' : null),
              },
            },
            queryParamMap: of({
              get: (key: string) => (key === 'queryParam' ? 'queryValue' : null),
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationBarComponent);
    component = fixture.componentInstance;

    authDrawerService = TestBed.inject(AuthDrawerService);
    store = TestBed.inject(MockStore);

    store.overrideSelector(AppSelectors.selectIsDarkMode, false);
    store.overrideSelector(AppSelectors.selectIsDesktopView, false);
    store.overrideSelector(AppSelectors.selectIsWideView, false);
    store.overrideSelector(AuthSelectors.selectUser, null);

    dispatchSpy = vi.spyOn(store, 'dispatch');
    openLoginSpy = vi.spyOn(authDrawerService, 'openLogin');

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navigation links', () => {
    it('should render the correct number of links when screenWidth is above 700px', () => {
      component.screenWidth = 800;
      fixture.detectChanges();

      const renderedLinks = fixture.nativeElement.querySelectorAll('.nav-link');
      expect(renderedLinks.length).toBe(component.links.length);
    });

    it('should render the correct number of links when screenWidth is below 700px', () => {
      component.screenWidth = 600;
      fixture.detectChanges();

      const renderedLinks = fixture.nativeElement.querySelectorAll('.nav-link');
      expect(renderedLinks.length).toBe(component.links.length);
    });
  });

  describe('display toggles', () => {
    it('should dispatch themeToggled when the theme button is clicked', () => {
      component.onToggleTheme();

      expect(dispatchSpy).toHaveBeenCalledWith(AppActions.themeToggled());
    });

    it('should dispatch wideViewToggled when the wide view button is clicked', () => {
      component.onToggleWideView();

      expect(dispatchSpy).toHaveBeenCalledWith(AppActions.wideViewToggled());
    });
  });

  describe('account controls', () => {
    it('should show the log in button and no avatar when logged out', () => {
      expect(query(fixture.debugElement, '.login-button')).toBeTruthy();
      expect(query(fixture.debugElement, '.avatar-button')).toBeFalsy();
    });

    it('should open the login drawer when the log in button is clicked', () => {
      component.onLogin();

      expect(openLoginSpy).toHaveBeenCalled();
    });

    it('should show the avatar button and no log in button when logged in', () => {
      store.overrideSelector(AuthSelectors.selectUser, mockUser);
      store.refreshState();

      fixture.detectChanges();

      expect(query(fixture.debugElement, '.avatar-button')).toBeTruthy();
      expect(query(fixture.debugElement, '.login-button')).toBeFalsy();
    });
  });
});
