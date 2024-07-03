import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subscription } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { NavPathTypes, PasswordChangeFormData } from '@app/types';
import {
  emailValidator,
  hasLowercaseLetterValidator,
  hasNumberValidator,
  hasSpecialCharValidator,
  hasUppercaseLetterValidator,
  matchingPasswordsValidator,
} from '@app/validators';

import { ChangePasswordFormFacade } from './change-password-form.facade';

@UntilDestroy()
@Component({
  selector: 'lcc-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss'],
  providers: [ChangePasswordFormFacade],
})
export class ChangePasswordFormComponent implements OnInit {
  readonly NavPathTypes = NavPathTypes;
  readonly PASSWORD_VALIDATORS: ValidatorFn[] = [
    Validators.required,
    Validators.minLength(8),
    hasLowercaseLetterValidator,
    hasUppercaseLetterValidator,
    hasSpecialCharValidator,
    hasNumberValidator,
  ];

  form!: FormGroup;
  passwordValueChangeSubscription!: Subscription;
  userHasCode!: boolean;
  tempInitialPassword!: string | null;

  constructor(
    public facade: ChangePasswordFormFacade,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setUpListeners();
  }

  hasError(control: AbstractControl): boolean {
    return control.value !== '' && control.invalid;
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

  onSubmit(): void {
    if (
      ((!this.userHasCode || this.tempInitialPassword) &&
        this.form.controls['email'].invalid) ||
      (this.userHasCode && this.form.invalid)
    ) {
      this.form.markAllAsTouched();
      return;
    }

    const formData: PasswordChangeFormData = {
      email: this.form.value['email'],
      newPassword: this.form.value['newPassword'],
      code: this.form.value['code'].toString(),
    };
    this.facade.onSubmit(formData);
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required, emailValidator]),
      code: new FormControl('', [Validators.pattern(/\d{6}/)]),
      newPassword: new FormControl('', this.PASSWORD_VALIDATORS),
      confirmPassword: new FormControl('', [
        ...this.PASSWORD_VALIDATORS,
        matchingPasswordsValidator,
      ]),
    });

    this.passwordValueChangeSubscription = this.form.controls['newPassword'].valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.form.controls['confirmPassword'].updateValueAndValidity();
      });
  }

  private setUpListeners(): void {
    this.facade.tempInitialPassword$
      .pipe(untilDestroyed(this))
      .subscribe(
        (tempInitialPassword) => (this.tempInitialPassword = tempInitialPassword),
      );

    this.facade.user$.pipe(untilDestroyed(this)).subscribe((user) => {
      if (user?.email) {
        this.form.controls['email'].setValue(user.email);
      }
    });

    this.facade.userHasCode$
      .pipe(untilDestroyed(this))
      .subscribe((hasCode) => (this.userHasCode = hasCode));
  }
}
