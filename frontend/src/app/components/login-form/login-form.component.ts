import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { LoginFormGroup } from '@app/models';
import { emailValidator } from '@app/validators';

@Component({
  selector: 'lcc-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent implements OnInit {
  public form!: FormGroup<LoginFormGroup>;

  @Output() requestLogin = new EventEmitter<{ email: string; password: string }>();

  constructor(private readonly formBuilder: FormBuilder) {}

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

    this.requestLogin.emit({
      email: this.form.value.email!,
      password: this.form.value.password!,
    });
  }
}
