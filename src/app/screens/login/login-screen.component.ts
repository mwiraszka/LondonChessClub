import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { LoaderService } from '@app/shared/services';

import { LoginScreenFacade } from './login-screen.facade';

@Component({
  selector: 'lcc-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss'],
})
export class LoginScreenComponent {
  form!: FormGroup;

  constructor(
    public facade: LoginScreenFacade,
    private formBuilder: FormBuilder,
    private loader: LoaderService
  ) {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  hasError(control: AbstractControl): boolean {
    return control.value !== '' && control.invalid;
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.errors.hasOwnProperty('required')) {
      return 'This field is required';
    } else if (control.errors.hasOwnProperty('email')) {
      return 'Invalid email';
    } else {
      return 'Unknown error';
    }
  }

  onKeyUp(event: any): void {
    if (event.keyCode === 13) {
      this.onLogin();
    }
  }

  onLogin(): void {
    this.loader.display(true);
    this.facade.onLogin(this.form.value);
    setTimeout(() => this.loader.display(false), 1000);
  }
}
