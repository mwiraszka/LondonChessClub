import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { query, queryTextContent } from '@app/utils';

import { ChangePasswordFormComponent } from './change-password-form.component';

describe('ChangePasswordFormComponent', () => {
  let fixture: ComponentFixture<ChangePasswordFormComponent>;
  let component: ChangePasswordFormComponent;

  let initFormSpy: jest.SpyInstance;
  let initFormValueChangeListenerSpy: jest.SpyInstance;
  let requestChangePasswordSpy: jest.SpyInstance;
  let requestCodeForPasswordChangeSpy: jest.SpyInstance;
  let requestNewCodeSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordFormComponent, ReactiveFormsModule, RouterLink],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of([]) },
        },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordFormComponent);
    component = fixture.componentInstance;

    component.hasCode = false;
    fixture.detectChanges();

    // @ts-expect-error Private class member
    initFormSpy = jest.spyOn(component, 'initForm');
    initFormValueChangeListenerSpy = jest.spyOn(
      component,
      // @ts-expect-error Private class member
      'initFormValueChangeListener',
    );
    requestChangePasswordSpy = jest.spyOn(component.requestChangePassword, 'emit');
    requestCodeForPasswordChangeSpy = jest.spyOn(
      component.requestCodeForPasswordChange,
      'emit',
    );
    requestNewCodeSpy = jest.spyOn(component.requestNewCode, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should initialize form and its value change listener', () => {
      expect(initFormSpy).toHaveBeenCalledTimes(1);
      expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);
    });

    it('should initialize the form with empty values', () => {
      expect(component.form.controls.email.value).toBe('');
      expect(component.form.controls.code.value).toBe('');
      expect(component.form.controls.newPassword.value).toBe('');
      expect(component.form.controls.confirmPassword.value).toBe('');
    });
  });

  describe('form validation', () => {
    describe('code field', () => {
      it('should mark invalid code format as invalid', () => {
        component.form.patchValue({ code: '12345' }); // 5 digits instead of 6
        component.form.controls.code.markAsTouched();
        fixture.detectChanges();

        expect(component.form.controls.code.hasError('pattern')).toBe(true);
      });

      it('should mark valid code format as valid', () => {
        component.form.patchValue({ code: '123456' });
        component.form.controls.code.markAsTouched();
        fixture.detectChanges();

        expect(component.form.controls.code.hasError('pattern')).toBe(false);
      });
    });

    describe('password fields', () => {
      it('should mark password without required characteristics as invalid', () => {
        component.form.patchValue({ newPassword: 'password' }); // Missing uppercase, special char, number
        component.form.controls.newPassword.markAsTouched();
        fixture.detectChanges();

        expect(component.form.controls.newPassword.hasError('noUppercaseLetter')).toBe(
          true,
        );
        expect(component.form.controls.newPassword.hasError('noNumber')).toBe(true);
        expect(component.form.controls.newPassword.hasError('noSpecialChar')).toBe(true);
      });

      it('should mark valid password as valid', () => {
        component.form.patchValue({ newPassword: 'Password123!' });
        component.form.controls.newPassword.markAsTouched();
        fixture.detectChanges();

        expect(component.form.controls.newPassword.valid).toBe(true);
      });

      it('should mark mismatched passwords as invalid', () => {
        component.form.patchValue({
          newPassword: 'Password123!',
          confirmPassword: 'DifferentPassword123!',
        });
        fixture.detectChanges();

        expect(component.form.hasError('passwordMismatch')).toBe(true);
      });

      it('should mark matching passwords as valid', () => {
        component.form.patchValue({
          newPassword: 'Password123!',
          confirmPassword: 'Password123!',
        });
        fixture.detectChanges();

        expect(component.form.hasError('passwordMismatch')).toBe(false);
      });
    });
  });

  describe('onSubmit', () => {
    it('should mark all fields as touched if form is invalid when hasCode is true', () => {
      component.hasCode = true;
      component.form.patchValue({
        email: 'valid@example.com',
        code: '', // Invalid - code field is required
        newPassword: 'Password123!',
        confirmPassword: 'Password123!',
      });
      fixture.detectChanges();
      component.form.markAsUntouched();

      component.onSubmit(true);
      fixture.detectChanges();

      expect(component.form.controls.code.touched).toBe(true);
      expect(component.form.touched).toBe(true);
      expect(requestChangePasswordSpy).not.toHaveBeenCalled();
    });

    it('should mark email field as touched if it is invalid when hasCode is false', () => {
      component.hasCode = false;
      component.form.patchValue({ email: 'invalid-email' });
      component.form.markAsUntouched();
      fixture.detectChanges();

      component.onSubmit(false);
      fixture.detectChanges();

      expect(component.form.controls.email.touched).toBe(true);
      expect(requestChangePasswordSpy).not.toHaveBeenCalled();
      expect(requestCodeForPasswordChangeSpy).not.toHaveBeenCalled();
      expect(requestNewCodeSpy).not.toHaveBeenCalled();
    });

    it('should emit request code for password change event when hasCode is false and email is valid', () => {
      component.hasCode = false;
      const testEmail = 'valid@example.com';
      component.form.patchValue({ email: testEmail });
      fixture.detectChanges();

      component.onSubmit(false);
      fixture.detectChanges();

      expect(requestCodeForPasswordChangeSpy).toHaveBeenCalledWith(testEmail);
      expect(requestChangePasswordSpy).not.toHaveBeenCalled();
      expect(requestNewCodeSpy).not.toHaveBeenCalled();
    });

    it('should emit request change password event when hasCode is true and form is valid', () => {
      component.hasCode = true;
      component.form.patchValue({
        email: 'valid@example.com',
        code: '123456',
        newPassword: 'Password123!',
        confirmPassword: 'Password123!',
      });
      fixture.detectChanges();

      component.onSubmit(true);
      fixture.detectChanges();

      expect(requestChangePasswordSpy).toHaveBeenCalledWith({
        email: 'valid@example.com',
        password: 'Password123!',
        code: '123456',
      });
      expect(requestCodeForPasswordChangeSpy).not.toHaveBeenCalled();
      expect(requestNewCodeSpy).not.toHaveBeenCalled();
    });
  });

  describe('onRequestNewCode', () => {
    it('should emit request new code event', () => {
      component.onRequestNewCode();
      fixture.detectChanges();

      expect(requestNewCodeSpy).toHaveBeenCalledTimes(1);
      expect(requestChangePasswordSpy).not.toHaveBeenCalled();
      expect(requestCodeForPasswordChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe('template rendering', () => {
    describe('with verification code', () => {
      beforeEach(() => {
        fixture.componentRef.setInput('hasCode', true);
        fixture.detectChanges();
      });

      it('should render form with all fields', () => {
        expect(query(fixture.debugElement, '#email-input')).toBeTruthy();
        expect(query(fixture.debugElement, '#code-input')).toBeTruthy();
        expect(query(fixture.debugElement, '#new-password-input')).toBeTruthy();
        expect(query(fixture.debugElement, '#confirm-password-input')).toBeTruthy();
      });

      it('should show "Change password" button', () => {
        expect(queryTextContent(fixture.debugElement, '.submit-button')).toBe(
          'Change password',
        );
      });

      it('should disable submit button when form is invalid', () => {
        component.form.patchValue({
          email: 'valid@example.com',
          code: '12345', // Invalid code (not 6 digits)
          newPassword: 'Password123!',
          confirmPassword: 'Password123!',
        });
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.submit-button').nativeElement.disabled).toBe(
          true,
        );
      });

      it('should enable submit button when form is valid', () => {
        component.form.patchValue({
          email: 'valid@example.com',
          code: '123456',
          newPassword: 'Password123!',
          confirmPassword: 'Password123!',
        });
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.submit-button').nativeElement.disabled).toBe(
          false,
        );
      });

      it('should display "Return to login" and "Request new code" links', () => {
        expect(queryTextContent(fixture.debugElement, '.return-to-login-link')).toBe(
          'Return to login',
        );
        expect(queryTextContent(fixture.debugElement, '.request-new-code-link')).toBe(
          'Request new code',
        );
      });

      it('should call onRequestNewCode when "Request new code" link is clicked', () => {
        query(fixture.debugElement, '.request-new-code-link').triggerEventHandler(
          'click',
        );
        fixture.detectChanges();

        expect(requestNewCodeSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('without verification code', () => {
      beforeEach(() => {
        fixture.componentRef.setInput('hasCode', false);
        fixture.detectChanges();
      });

      it('should render form with email field only', () => {
        expect(query(fixture.debugElement, '#email-input')).toBeTruthy();
        expect(query(fixture.debugElement, '#code-input')).toBeFalsy();
        expect(query(fixture.debugElement, '#new-password-input')).toBeFalsy();
        expect(query(fixture.debugElement, '#confirm-password-input')).toBeFalsy();
      });

      it('should show "Get code" button', () => {
        expect(queryTextContent(fixture.debugElement, '.submit-button')).toBe('Get code');
      });

      it('should disable submit button when email is invalid', () => {
        component.form.patchValue({ email: 'invalid-email' });
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.submit-button').nativeElement.disabled).toBe(
          true,
        );
      });

      it('should enable submit button when email is valid', () => {
        component.form.patchValue({ email: 'valid@example.com' });
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.submit-button').nativeElement.disabled).toBe(
          false,
        );
      });

      it('should not show "Request new code" link', () => {
        expect(query(fixture.debugElement, '.request-new-code-link')).toBeFalsy();
      });
    });
  });
});
