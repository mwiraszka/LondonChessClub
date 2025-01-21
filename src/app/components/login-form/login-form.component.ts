import { Store } from '@ngrx/store';

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
import IconsModule from '@app/icons';
import { LoginFormGroup, LoginRequest } from '@app/models';
import { AuthActions } from '@app/store/auth';
import { emailValidator } from '@app/validators';

@Component({
  selector: 'lcc-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  imports: [CommonModule, IconsModule, ReactiveFormsModule, RouterLink, TooltipDirective],
})
export class LoginFormComponent implements OnInit {
  public form: FormGroup<LoginFormGroup> | null = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: new FormControl('', {
        nonNullable: true,
        updateOn: 'blur',
        validators: [Validators.required, emailValidator],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
    });
  }

  public hasError(control: AbstractControl): boolean {
    return control.dirty && control.invalid;
  }

  public getErrorMessage(control: AbstractControl): string {
    return control.hasError('required')
      ? 'This field is required'
      : control.hasError('invalidEmailFormat')
        ? 'Invalid email'
        : 'Unknown error';
  }

  public onSubmit(): void {
    if (this.form?.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request = this.form!.value as Required<LoginRequest>;
    this.store.dispatch(AuthActions.loginRequested({ request }));
  }
}
