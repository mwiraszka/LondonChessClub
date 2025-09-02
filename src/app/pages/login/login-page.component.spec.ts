import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MetaAndTitleService } from '@app/services';
import { AuthActions } from '@app/store/auth';
import { query } from '@app/utils';

import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
  let fixture: ComponentFixture<LoginPageComponent>;
  let component: LoginPageComponent;

  let metaAndTitleService: MetaAndTitleService;
  let store: MockStore;

  let dispatchSpy: jest.SpyInstance;
  let updateDescriptionSpy: jest.SpyInstance;
  let updateTitleSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        {
          provide: MetaAndTitleService,
          useValue: {
            updateTitle: jest.fn(),
            updateDescription: jest.fn(),
          },
        },
        provideMockStore(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;

    metaAndTitleService = TestBed.inject(MetaAndTitleService);
    store = TestBed.inject(MockStore);

    dispatchSpy = jest.spyOn(store, 'dispatch');
    updateDescriptionSpy = jest.spyOn(metaAndTitleService, 'updateDescription');
    updateTitleSpy = jest.spyOn(metaAndTitleService, 'updateTitle');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should set meta title and description', () => {
      component.ngOnInit();

      expect(updateTitleSpy).toHaveBeenCalledTimes(1);
      expect(updateTitleSpy).toHaveBeenCalledWith('Log In');
      expect(updateDescriptionSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onRequestLogin', () => {
    it('should dispatch loginRequested action', () => {
      const credentials = {
        email: 'user@domain.com',
        password: 'password123',
      };
      component.onRequestLogin(credentials);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        AuthActions.loginRequested({ ...credentials }),
      );
    });
  });

  describe('template rendering', () => {
    it('should always render page components', () => {
      expect(query(fixture.debugElement, 'lcc-page-header')).toBeTruthy();
      expect(query(fixture.debugElement, 'lcc-login-form')).toBeTruthy();
    });
  });
});
