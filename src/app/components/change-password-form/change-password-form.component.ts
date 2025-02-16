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

import { TooltipDirective } from '@app/directives/tooltip.directive';
import IconsModule from '@app/icons';
import type { ChangePasswordFormGroup } from '@app/models';
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
  imports: [CommonModule, IconsModule, ReactiveFormsModule, RouterLink, TooltipDirective],
})
export class ChangePasswordFormComponent implements OnInit {
  public form: FormGroup<ChangePasswordFormGroup> | null = null;
  public hasCode: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.store
      .select(AuthSelectors.selectHasCode)
      .pipe(untilDestroyed(this))
      .subscribe(hasCode => (this.hasCode = hasCode));
  }

  public hasError(control: AbstractControl): boolean {
    return control.dirty && control.invalid;
  }

  public getErrorMessage(control: AbstractControl): string {
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
    } else {
      return 'Unknown error';
    }
  }

  public onSubmit(hasCode: boolean): void {
    if (
      !this.form ||
      (!hasCode && this.form.controls.email.invalid) ||
      (hasCode && this.form.invalid)
    ) {
      this.form!.markAllAsTouched();
      return;
    }

    const email = this.form.value.email;
    const password = this.form.value.newPassword;
    const code = this.form.value.code;

    if (!hasCode && email) {
      this.store.dispatch(AuthActions.codeForPasswordChangeRequested({ email }));
    }

    if (hasCode && email && password && code) {
      this.store.dispatch(AuthActions.passwordChangeRequested({ email, password, code }));
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

  private readonly passwordValidators: ValidatorFn[] = [
    Validators.required,
    Validators.minLength(8),
    hasLowercaseLetterValidator,
    hasUppercaseLetterValidator,
    hasSpecialCharValidator,
    hasNumberValidator,
  ];
}
