import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ClarityIcons, exclamationTriangleIcon } from '@cds/core/icon';
import { Subscription } from 'rxjs';

import {
  confirmPasswordValidator,
  dateValidator,
  hasLowercaseLetterValidator,
  hasNumberValidator,
  hasSpecialCharValidator,
  hasUppercaseLetterValidator,
  phoneNumberValidator,
} from '@app/validators';

import { SignUpScreenFacade } from './sign-up-screen.facade';

const PASSWORD_VALIDATORS: ValidatorFn[] = [
  Validators.required,
  Validators.minLength(8),
  hasLowercaseLetterValidator,
  hasUppercaseLetterValidator,
  hasSpecialCharValidator,
  hasNumberValidator,
];

@Component({
  selector: 'lcc-sign-up-screen',
  templateUrl: './sign-up-screen.component.html',
  styleUrls: ['./sign-up-screen.component.scss'],
  providers: [SignUpScreenFacade],
})
export class SignUpScreenComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  passwordChangesSub!: Subscription;

  constructor(public facade: SignUpScreenFacade, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    ClarityIcons.addIcons(exclamationTriangleIcon);
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', PASSWORD_VALIDATORS),
      confirmPassword: new FormControl('', [
        ...PASSWORD_VALIDATORS,
        confirmPasswordValidator,
      ]),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      yearOfBirth: new FormControl('', dateValidator),
      phoneNumber: new FormControl('', [Validators.required, phoneNumberValidator]),
      city: new FormControl('London', Validators.required),
    });

    this.passwordChangesSub = this.form.controls['password'].valueChanges.subscribe(
      () => {
        this.form.controls['confirmPassword'].updateValueAndValidity();
      }
    );
  }

  hasError(control: AbstractControl): boolean {
    return control.value !== '' && control.invalid;
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.errors.hasOwnProperty('required')) {
      return 'This field is required';
    } else if (control.errors.hasOwnProperty('invalidDateFormat')) {
      return 'Invalid date: please input as YYYY-MM-DD';
    } else if (control.errors.hasOwnProperty('invalidPhoneNumberFormat')) {
      return 'Invalid phone number: please input as XXX-XXX-XXXX';
    } else if (control.errors.hasOwnProperty('email')) {
      return 'Invalid email';
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
      console.log('Could not recognize', control.errors);
      return 'Unknown error';
    }
  }

  ngOnDestroy(): void {
    this.passwordChangesSub.unsubscribe();
  }
}
