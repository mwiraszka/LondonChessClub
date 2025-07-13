import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AuthActions } from '@app/store/auth';
import { query } from '@app/utils';

import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  let fixture: ComponentFixture<LoginFormComponent>;
  let component: LoginFormComponent;
  let store: MockStore;

  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent, ReactiveFormsModule, RouterLink],
      providers: [
        FormBuilder,
        provideMockStore(),
        { provide: ActivatedRoute, useValue: { paramMap: [] } },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(LoginFormComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(MockStore);

        dispatchSpy = jest.spyOn(store, 'dispatch');

        component.ngOnInit();
        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('UI elements', () => {
    it('should render login form with correct fields', () => {
      expect(query(fixture.debugElement, 'input#email-input')).toBeTruthy();
      expect(query(fixture.debugElement, 'input#password-input')).toBeTruthy();
      expect(query(fixture.debugElement, 'button.login-button')).toBeTruthy();
      expect(
        query(fixture.debugElement, 'a.lcc-link[routerLink="/change-password"]'),
      ).toBeTruthy();
    });

    it('should have disabled login button when form is invalid', () => {
      component.form.patchValue({
        email: '',
        password: '',
      });
      fixture.detectChanges();

      const loginButton = query(fixture.debugElement, '.login-button');
      expect(loginButton.nativeElement.disabled).toBe(true);
    });

    it('should have enabled login button when form is valid', () => {
      component.form.patchValue({
        email: 'valid@example.com',
        password: 'password123',
      });
      fixture.detectChanges();

      const loginButton = query(fixture.debugElement, '.login-button');
      expect(loginButton.nativeElement.disabled).toBe(false);
    });
  });

  describe('form initialization', () => {
    it('should initialize form with empty values', () => {
      expect(component.form.controls.email.value).toBe('');
      expect(component.form.controls.password.value).toBe('');
    });

    it('should set up validators correctly', () => {
      component.form.patchValue({
        email: '',
        password: '',
      });
      fixture.detectChanges();

      expect(component.form.controls.email.hasError('required')).toBe(true);
      expect(component.form.controls.password.hasError('required')).toBe(true);
    });
  });

  describe('form validation', () => {
    describe('email field', () => {
      it('should mark invalid email format as invalid', () => {
        component.form.patchValue({ email: 'invalid-email' });
        fixture.detectChanges();

        expect(component.form.controls.email.hasError('invalidEmailFormat')).toBe(true);
      });

      it('should mark empty email as invalid', () => {
        component.form.patchValue({ email: '' });
        fixture.detectChanges();

        expect(component.form.controls.email.hasError('required')).toBe(true);
      });

      it('should mark valid email format as valid', () => {
        component.form.patchValue({ email: 'valid@example.com' });
        fixture.detectChanges();

        expect(component.form.controls.email.valid).toBe(true);
      });
    });

    describe('password field', () => {
      it('should mark empty password as invalid', () => {
        component.form.patchValue({ password: '' });
        fixture.detectChanges();

        expect(component.form.controls.password.hasError('required')).toBe(true);
      });

      it('should mark non-empty password as valid', () => {
        component.form.patchValue({ password: 'password123' });
        fixture.detectChanges();

        expect(component.form.controls.password.valid).toBe(true);
      });
    });
  });

  describe('form submission', () => {
    it('should mark all fields as touched if form is invalid on submit', () => {
      component.form.patchValue({
        email: '',
        password: '',
      });
      component.form.markAsPristine();
      component.form.markAsUntouched();
      fixture.detectChanges();

      component.onSubmit();
      fixture.detectChanges();

      expect(component.form.controls.email.touched).toBe(true);
      expect(component.form.controls.password.touched).toBe(true);
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should dispatch login action when form is valid', () => {
      component.form.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });
      fixture.detectChanges();

      query(fixture.debugElement, 'form').triggerEventHandler('ngSubmit');

      expect(dispatchSpy).toHaveBeenCalledWith(
        AuthActions.loginRequested({
          email: 'test@example.com',
          password: 'password123',
        }),
      );
    });
  });
});
