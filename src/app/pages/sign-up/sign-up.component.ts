import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ClarityIcons, exclamationTriangleIcon } from '@cds/core/icon';

import { AuthFacade, SignUpRequestData } from '@app/core/auth';
import { LoaderService } from '@app/shared/services';
import {
  dateValidator,
  hasLowercaseLetterValidator,
  hasNumberValidator,
  hasSpecialCharValidator,
  hasUppercaseLetterValidator,
  phoneNumberValidator,
  signUpTokenValidator,
} from '@app/shared/validators';

@Component({
  selector: 'lcc-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;

  constructor(
    private facade: AuthFacade,
    private formBuilder: FormBuilder,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.initForm();
    ClarityIcons.addIcons(exclamationTriangleIcon);
  }

  initForm(): void {
    this.signUpForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        hasLowercaseLetterValidator,
        hasUppercaseLetterValidator,
        hasSpecialCharValidator,
        hasNumberValidator,
      ]),
      confirmPassword: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', dateValidator),
      phoneNumber: new FormControl('', [Validators.required, phoneNumberValidator]),
      city: new FormControl('London', Validators.required),
      signUpToken: new FormControl('', [Validators.required, signUpTokenValidator]),
    });
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
    } else if (control.errors.hasOwnProperty('invalidSignUpToken')) {
      return 'Invalid sign up token - please contact an LCC admin';
    } else {
      console.log('Could not recognize', control.errors);
      return 'Unknown error';
    }
  }

  onKeyUp(event: any): void {
    if (event.keyCode === 13 && this.signUpForm.valid) {
      this.onSignUp();
    }
  }

  onAlreadyHaveAccount(): void {
    this.facade.onAlreadyHaveAccount();
  }

  onSignUp(): void {
    this.loader.display(true);
    this.facade.onSignUp(this.signUpForm.value as SignUpRequestData);
    setTimeout(() => this.loader.display(false), 1000);
  }
}
