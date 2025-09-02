import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MetaAndTitleService } from '@app/services';
import { AuthActions, initialState as authInitialState } from '@app/store/auth';
import { query } from '@app/utils';

import { ChangePasswordPageComponent } from './change-password-page.component';

describe('ChampionPageComponent', () => {
  let fixture: ComponentFixture<ChangePasswordPageComponent>;
  let component: ChangePasswordPageComponent;

  let metaAndTitleService: MetaAndTitleService;
  let store: MockStore;

  let dispatchSpy: jest.SpyInstance;
  let updateDescriptionSpy: jest.SpyInstance;
  let updateTitleSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordPageComponent],
      providers: [
        {
          provide: MetaAndTitleService,
          useValue: {
            updateTitle: jest.fn(),
            updateDescription: jest.fn(),
          },
        },
        provideMockStore({
          initialState: {
            authState: authInitialState,
          },
        }),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordPageComponent);
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
      expect(updateTitleSpy).toHaveBeenCalledWith('Change Password');
      expect(updateDescriptionSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onRequestChangePassword', () => {
    it('should dispatch codeForPasswordChangeRequested action', () => {
      const mockCredentials = {
        email: 'user@londonchass',
        password: 'newPassw0rd',
        code: '1234',
      };

      component.onRequestChangePassword(mockCredentials);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        AuthActions.passwordChangeRequested({ ...mockCredentials }),
      );
    });
  });

  describe('onRequestCodeForPasswordChange', () => {
    it('should dispatch codeForPasswordChangeRequested action', () => {
      const mockEmail = 'user@domain.com';
      component.onRequestCodeForPasswordChange(mockEmail);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        AuthActions.codeForPasswordChangeRequested({ email: mockEmail }),
      );
    });
  });

  describe('onRequestNewCode', () => {
    it('should dispatch requestNewCodeSelected action', () => {
      component.onRequestNewCode();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.requestNewCodeSelected());
    });
  });

  describe('template rendering', () => {
    describe('when viewModel$ is undefined', () => {
      it('should not render page components', () => {
        expect(query(fixture.debugElement, 'lcc-page-header')).toBeFalsy();
        expect(query(fixture.debugElement, 'lcc-change-password-form')).toBeFalsy();
      });
    });

    describe('when viewModel$ is defined', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should render page components', () => {
        expect(query(fixture.debugElement, 'lcc-page-header')).toBeTruthy();
        expect(query(fixture.debugElement, 'lcc-change-password-form')).toBeTruthy();
      });
    });
  });
});
