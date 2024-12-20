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
import { IconsModule } from '@app/icons';
import { AuthActions } from '@app/store/auth';
import { NavPathTypes } from '@app/types';
import { emailValidator } from '@app/validators';

@Component({
  selector: 'lcc-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  imports: [CommonModule, IconsModule, ReactiveFormsModule, RouterLink, TooltipDirective],
})
export class LoginFormComponent implements OnInit {
  public readonly NavPathTypes = NavPathTypes;

  public form!: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
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

  public hasError(control: AbstractControl): boolean {
    return control.dirty && control.invalid;
  }

  public getErrorMessage(control: AbstractControl): string {
    if (control.hasError('required')) {
      return 'This field is required';
    } else if (control.hasError('invalidEmailFormat')) {
      return 'Invalid email';
    }
    return 'Unknown error';
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.store.dispatch(AuthActions.loginRequested({ request: this.form.value }));
  }
}
