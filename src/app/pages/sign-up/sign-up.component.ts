import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthFacade, SignUpRequest } from '@app/core/auth';
import { LoaderService } from '@app/shared/services';

@Component({
  selector: 'lcc-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  signUpForm!: FormGroup;

  constructor(
    public facade: AuthFacade,
    private formBuilder: FormBuilder,
    private loader: LoaderService
  ) {
    this.signUpForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      city: new FormControl('London', Validators.required),
      accessToken: new FormControl('', Validators.required),
    });
  }

  onKeyUp(event: any): void {
    if (event.keyCode === 13) {
      this.onSignUp();
    }
  }

  onSignUp(): void {
    this.loader.display(true);
    this.facade.onSignUp(this.signUpForm.value as SignUpRequest);
    setTimeout(() => this.loader.display(false), 1000);
  }
}
