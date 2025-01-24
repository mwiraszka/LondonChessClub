import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import IconsModule from '@app/icons';
import type {
  ChangePasswordFormGroup,
  LoginRequest,
  PasswordChangeRequest,
  User,
} from '@app/models';
import { RouterLinkPipe } from '@app/pipes';
import { AuthActions, AuthSelectors } from '@app/store/auth';
import {
  emailValidator,
  hasLowercaseLetterValidator,
  hasNumberValidator,
  hasSpecialCharValidator,
  hasUppercaseLetterValidator,
  matchingPasswordsValidator,
} from '@app/validators';

@UntilDestroy()
@Component({
  selector: 'lcc-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrl: './change-password-form.component.scss',
  imports: [
    CommonModule,
    IconsModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkPipe,
    TooltipDirective,
  ],
})
export class ChangePasswordFormComponent implements OnInit {
  public readonly changePasswordFormViewModel$ = this.store.select(
    AuthSelectors.selectChangePasswordFormViewModel,
  );
  public form: FormGroup<ChangePasswordFormGroup> | null = null;

  private readonly passwordValidators: ValidatorFn[] = [
    Validators.required,
    Validators.minLength(8),
    hasLowercaseLetterValidator,
    hasUppercaseLetterValidator,
    hasSpecialCharValidator,
    hasNumberValidator,
  ];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initPasswordMatchListener();
  }

  hasError(control: AbstractControl): boolean {
    return control.dirty && control.invalid;
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.hasError('required')) {
      return 'This field is required';
    } else if (control.hasError('invalidEmailFormat')) {
      return 'Invalid email';
    } else if (control.hasError('pattern')) {
      return 'Invalid input (incorrect format)';
    } else if (control.hasError('noLowercaseLetter')) {
      return 'Password needs to include at least one lowercase letter';
    } else if (control.hasError('noUppercaseLetter')) {
      return 'Password needs to include at least one uppercase letter';
    } else if (control.hasError('noSpecialChar')) {
      return 'Password needs to include at least one special character';
    } else if (control.hasError('noNumber')) {
      return 'Password needs to include at least one number';
    } else if (control.hasError('minlength')) {
      return 'Password needs to be at least 8 characters long';
    } else if (control.hasError('passwordMismatch')) {
      return "Passwords don't match";
    } else {
      return 'Unknown error';
    }
  }

  onSubmit(
    user: User | null,
    userHasCode: boolean,
    temporaryPassword: string | null,
  ): void {
    if (
      ((!userHasCode || temporaryPassword) && this.form?.controls.email.invalid) ||
      (userHasCode && this.form?.invalid)
    ) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form?.value.email ?? '';
    const newPassword = this.form?.value.newPassword ?? '';
    const code = this.form?.value.code?.toString();

    if (user && !user?.isVerified && temporaryPassword) {
      const request: LoginRequest = {
        email,
        password: newPassword,
        temporaryPassword,
      };
      this.store.dispatch(AuthActions.loginRequested({ request }));
    } else if (userHasCode) {
      const request: PasswordChangeRequest = {
        email,
        newPassword,
        code: code!,
      };
      this.store.dispatch(AuthActions.passwordChangeRequested({ request }));
    } else {
      this.store.dispatch(AuthActions.codeForPasswordChangeRequested({ email }));
    }
  }

  public onRequestNewCode(): void {
    this.store.dispatch(AuthActions.requestNewCodeSelected());
  }

  private initForm(): void {
    this.form = this.formBuilder.group(
      {
        email: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, emailValidator],
        }),
        code: new FormControl('', {
          nonNullable: true,
          validators: [Validators.pattern(/\d{6}/)],
        }),
        newPassword: new FormControl('', {
          nonNullable: true,
          validators: this.passwordValidators,
        }),
        confirmPassword: new FormControl('', {
          nonNullable: true,
          validators: this.passwordValidators,
        }),
      },
      { validators: matchingPasswordsValidator },
    );
  }

  private initPasswordMatchListener(): void {
    this.form?.controls.newPassword.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.form?.controls.confirmPassword.updateValueAndValidity();
      });
  }
}
