import { Store } from '@ngrx/store';

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { FormErrorIconComponent } from '@app/components/form-error-icon/form-error-icon.component';
import { LoginFormGroup } from '@app/models';
import { AuthActions } from '@app/store/auth';
import { emailValidator } from '@app/validators';

@Component({
  selector: 'lcc-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  imports: [FormErrorIconComponent, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent implements OnInit {
  public form!: FormGroup<LoginFormGroup>;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
  ) {}

  public ngOnInit(): void {
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

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.store.dispatch(
      AuthActions.loginRequested({
        email: this.form.value.email!,
        password: this.form.value.password!,
      }),
    );
  }
}
