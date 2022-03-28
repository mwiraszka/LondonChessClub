import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { LoaderService } from '@app/shared/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private loader: LoaderService) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  onKeyUp(event: any): void {
    if (event.keyCode === 13) {
      this.onLogin();
    }
  }

  onLogin(): void {
    this.loader.display(true);
    const { email, password } = this.loginForm.value;
    setTimeout(() => this.loader.display(false), 1000);
  }
}
