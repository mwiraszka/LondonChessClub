import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { query } from '@app/utils';

import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  let fixture: ComponentFixture<LoginFormComponent>;
  let component: LoginFormComponent;

  let requestLoginSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent, ReactiveFormsModule, RouterLink],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: { paramMap: [] },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;

    requestLoginSpy = jest.spyOn(component.requestLogin, 'emit');

    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    it('should initialize form with empty values', () => {
      expect(component.form.controls.email.value).toBe('');
      expect(component.form.controls.password.value).toBe('');
    });
  });

  describe('onSubmit', () => {
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
      expect(requestLoginSpy).not.toHaveBeenCalled();
    });
  });

  describe('template rendering', () => {
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

      expect(query(fixture.debugElement, '.login-button').nativeElement.disabled).toBe(
        true,
      );
    });

    it('should have enabled login button when form is valid', () => {
      component.form.patchValue({
        email: 'valid@example.com',
        password: 'password123',
      });
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.login-button').nativeElement.disabled).toBe(
        false,
      );
    });

    it('should emit request login event on submission', () => {
      component.form.patchValue({
        email: 'test@example.com',
        password: 'password123',
      });
      fixture.detectChanges();

      query(fixture.debugElement, 'form').triggerEventHandler('ngSubmit');

      expect(requestLoginSpy).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
