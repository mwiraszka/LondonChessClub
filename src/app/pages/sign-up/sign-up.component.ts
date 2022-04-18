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
import { dateValidator, phoneNumberValidator } from '@app/shared/validators';
import { environment } from '@environments/environment';

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
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', dateValidator),
      phoneNumber: new FormControl('', [Validators.required, phoneNumberValidator]),
      city: new FormControl('London', Validators.required),
      signUpToken: new FormControl('', [
        Validators.required,
        Validators.pattern(environment.signUpToken),
      ]),
    });
  }

  hasError(control: AbstractControl): boolean {
    return control.value !== '' && control.invalid;
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.errors.hasOwnProperty('required')) {
      return 'This field is required';
    } else if (control.errors.hasOwnProperty('invalidDateFormat')) {
      return 'Invalid date';
    } else if (control.errors.hasOwnProperty('invalidPhoneNumberFormat')) {
      return 'Invalid phone number';
    } else if (control.errors.hasOwnProperty('email')) {
      return 'Invalid email';
    } else {
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
