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
  emailValidator,
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
      email: new FormControl('', [Validators.required, emailValidator]),
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

  getErrorMessage(control: AbstractControl): string {
    if (control.hasError('required')) {
      return 'This field is required';
    } else if (control.hasError('invalidEmailFormat')) {
      return 'Invalid email';
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
      console.log('Could not recognize', control.errors);
      return 'Unknown error';
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.facade.onSignUp(this.form.value);
  }
}
