import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { PasswordChangeRequest } from '@app/types';
import {
  hasLowercaseLetterValidator,
  hasNumberValidator,
  hasSpecialCharValidator,
  hasUppercaseLetterValidator,
  matchingPasswordsValidator,
} from '@app/validators';
import { Subscription } from 'rxjs';

import { ChangePasswordFormFacade } from './change-password-form.facade';

@Component({
  selector: 'lcc-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss'],
  providers: [ChangePasswordFormFacade],
})
export class ChangePasswordFormComponent implements OnInit {
  form!: FormGroup;
  passwordValueChangeSubscription!: Subscription;

  PASSWORD_VALIDATORS: ValidatorFn[] = [
    Validators.required,
    Validators.minLength(8),
    hasLowercaseLetterValidator,
    hasUppercaseLetterValidator,
    hasSpecialCharValidator,
    hasNumberValidator,
  ];

  constructor(
    public facade: ChangePasswordFormFacade,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      code: new FormControl('', [Validators.required, Validators.pattern(/\d{6}/)]),
      newPassword: new FormControl('', this.PASSWORD_VALIDATORS),
      confirmPassword: new FormControl('', [
        ...this.PASSWORD_VALIDATORS,
        matchingPasswordsValidator,
      ]),
    });

    this.passwordValueChangeSubscription = this.form.controls[
      'newPassword'
    ].valueChanges.subscribe(() => {
      this.form.controls['confirmPassword'].updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    this.passwordValueChangeSubscription.unsubscribe();
  }

  hasError(control: AbstractControl): boolean {
    return control.value !== '' && control.invalid;
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.errors.hasOwnProperty('required')) {
      return 'This field is required';
    } else if (control.errors.hasOwnProperty('email')) {
      return 'Invalid email';
    } else if (control.errors.hasOwnProperty('pattern')) {
      return 'Invalid input (incorrect format)';
    } else if (control.errors.hasOwnProperty('noLowercaseLetter')) {
      return 'Password needs to include at least one lowercase letter';
    } else if (control.errors.hasOwnProperty('noUppercaseLetter')) {
      return 'Password needs to include at least one uppercase letter';
    } else if (control.errors.hasOwnProperty('noSpecialChar')) {
      return 'Password needs to include at least one special character';
    } else if (control.errors.hasOwnProperty('noNumber')) {
      return 'Password needs to include at least one number';
    } else if (control.errors.hasOwnProperty('minlength')) {
      return 'Password needs to be at least 8 characters long';
    } else if (control.errors.hasOwnProperty('passwordMismatch')) {
      return "Passwords don't match";
    } else {
      return 'Unknown error';
    }
  }

  onSubmit(): void {
    const request: PasswordChangeRequest = {
      email: this.form.value['email'],
      newPassword: this.form.value['password'],
      code: this.form.value['code'].toString(),
    };
    this.facade.onSubmit(request);
  }
}
