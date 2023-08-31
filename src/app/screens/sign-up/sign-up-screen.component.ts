/* eslint-disable no-prototype-builtins */
import { ClarityIcons, exclamationTriangleIcon } from '@cds/core/icon';
import { Subscription } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import {
  hasLowercaseLetterValidator,
  hasNumberValidator,
  hasSpecialCharValidator,
  hasUppercaseLetterValidator,
  matchingPasswordsValidator,
} from '@app/validators';

import { SignUpScreenFacade } from './sign-up-screen.facade';

@Component({
  selector: 'lcc-sign-up-screen',
  templateUrl: './sign-up-screen.component.html',
  styleUrls: ['./sign-up-screen.component.scss'],
  providers: [SignUpScreenFacade],
})
export class SignUpScreenComponent implements OnInit, OnDestroy {
  PASSWORD_VALIDATORS: ValidatorFn[] = [
    Validators.required,
    Validators.minLength(8),
    hasLowercaseLetterValidator,
    hasUppercaseLetterValidator,
    hasSpecialCharValidator,
    hasNumberValidator,
  ];

  form!: FormGroup;
  passwordChangesSub!: Subscription;

  constructor(public facade: SignUpScreenFacade, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    ClarityIcons.addIcons(exclamationTriangleIcon);
  }

  ngOnDestroy(): void {
    this.passwordChangesSub.unsubscribe();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      newPassword: new FormControl('', this.PASSWORD_VALIDATORS),
      confirmPassword: new FormControl('', [
        ...this.PASSWORD_VALIDATORS,
        matchingPasswordsValidator,
      ]),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
    });

    this.passwordChangesSub = this.form.controls['newPassword'].valueChanges.subscribe(
      () => {
        this.form.controls['confirmPassword'].updateValueAndValidity();
      },
    );
  }

  hasError(control: AbstractControl): boolean {
    return control.value !== '' && control.invalid;
  }

  // TODO: Get error messages without accessing the errors' properties like this
  getErrorMessage(control: AbstractControl): string {
    if (control.errors?.hasOwnProperty('required')) {
      return 'This field is required';
    } else if (control.errors?.hasOwnProperty('email')) {
      return 'Invalid email';
    } else if (control.errors?.hasOwnProperty('noLowercaseLetter')) {
      return 'Password needs to include at least one lowercase letter';
    } else if (control.errors?.hasOwnProperty('noUppercaseLetter')) {
      return 'Password needs to include at least one uppercase letter';
    } else if (control.errors?.hasOwnProperty('noSpecialChar')) {
      return 'Password needs to include at least one special character';
    } else if (control.errors?.hasOwnProperty('noNumber')) {
      return 'Password needs to include at least one number';
    } else if (control.errors?.hasOwnProperty('minlength')) {
      return 'Password needs to be at least 8 characters long';
    } else if (control.errors?.hasOwnProperty('passwordMismatch')) {
      return "Passwords don't match";
    } else {
      console.log('Could not recognize', control.errors);
      return 'Unknown error';
    }
  }
}
