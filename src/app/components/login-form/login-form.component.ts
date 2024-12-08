import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import { IconsModule } from '@app/icons';
import { NavPathTypes } from '@app/types';
import { emailValidator } from '@app/validators';

import { LoginFormFacade } from './login-form.facade';

@Component({
  selector: 'lcc-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  providers: [LoginFormFacade],
  imports: [CommonModule, IconsModule, ReactiveFormsModule, RouterLink, TooltipDirective],
})
export class LoginFormComponent implements OnInit {
  readonly NavPathTypes = NavPathTypes;

  form!: FormGroup;

  constructor(
    public facade: LoginFormFacade,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: new FormControl('', {
        validators: [Validators.required, emailValidator],
        updateOn: 'blur',
      }),
      password: new FormControl('', Validators.required),
    });
  }

  hasError(control: AbstractControl): boolean {
    return control.value !== '' && control.invalid;
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.hasError('required')) {
      return 'This field is required';
    } else if (control.hasError('invalidEmailFormat')) {
      return 'Invalid email';
    }
    return 'Unknown error';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.facade.onLogin(this.form.value);
  }
}
