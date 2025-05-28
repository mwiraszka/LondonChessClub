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

import { TooltipDirective } from '@app/directives/tooltip.directive';
import IconsModule from '@app/icons';
import { LoginFormGroup } from '@app/models';
import { AuthActions } from '@app/store/auth';
import { emailValidator } from '@app/validators';

@Component({
  selector: 'lcc-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  imports: [CommonModule, IconsModule, ReactiveFormsModule, RouterLink, TooltipDirective],
})
export class LoginFormComponent implements OnInit {
  public form!: FormGroup<LoginFormGroup>;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: new FormControl('', {
        nonNullable: true,
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

    this.store.dispatch(
      AuthActions.loginRequested({
        email: this.form!.value.email!,
        password: this.form!.value.password!,
      }),
    );
  }
}
