import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { FormErrorIconComponent } from '@app/components/form-error-icon/form-error-icon.component';
import { ChangePasswordFormGroup } from '@app/models';
import {
  emailValidator,
  hasLowercaseLetterValidator,
  hasNumberValidator,
  hasSpecialCharValidator,
  hasUppercaseLetterValidator,
  matchingPasswordsValidator,
} from '@app/validators';

@UntilDestroy()
@Component({
  selector: 'lcc-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrl: './change-password-form.component.scss',
  imports: [FormErrorIconComponent, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordFormComponent implements OnInit {
  @Input({ required: true }) hasCode!: boolean;

  @Output() requestChangePassword = new EventEmitter<{
    email: string;
    password: string;
    code: string;
  }>();
  @Output() requestCodeForPasswordChange = new EventEmitter<string>();
  @Output() requestNewCode = new EventEmitter<void>();

  public form!: FormGroup<ChangePasswordFormGroup>;

  constructor(private readonly formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.initForm();
    this.initFormValueChangeListener();
  }

  public onSubmit(hasCode: boolean): void {
    if (
      (!hasCode && this.form.controls.email.invalid) ||
      (hasCode && this.form.invalid)
    ) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.value.email;
    const password = this.form.value.newPassword;
    const code = this.form.value.code;

    if (!hasCode && email) {
      this.requestCodeForPasswordChange.emit(email);
    }

    if (hasCode && email && password && code) {
      this.requestChangePassword.emit({ email, password, code });
    }
  }

  public onRequestNewCode(): void {
    this.requestNewCode.emit();
  }

  private initForm(): void {
    this.form = this.formBuilder.group(
      {
        email: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, emailValidator],
        }),
        code: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.pattern(/\d{6}/)],
        }),
        newPassword: new FormControl('', {
          nonNullable: true,
          validators: this.passwordValidators,
        }),
        confirmPassword: new FormControl('', {
          nonNullable: true,
          validators: this.passwordValidators,
        }),
      },
      { validators: matchingPasswordsValidator },
    );
  }

  private initFormValueChangeListener(): void {
    this.form.valueChanges.pipe(debounceTime(250), untilDestroyed(this)).subscribe(() => {
      this.form.controls.confirmPassword.setErrors(
        this.form.hasError('passwordMismatch') ? { passwordMismatch: true } : null,
      );
    });
  }

  private readonly passwordValidators: ValidatorFn[] = [
    Validators.required,
    Validators.minLength(8),
    hasLowercaseLetterValidator,
    hasUppercaseLetterValidator,
    hasSpecialCharValidator,
    hasNumberValidator,
  ];
}
