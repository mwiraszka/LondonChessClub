import { ButtonComponent, InputComponent } from '@eagami/ui';

import {
  ChangeDetectionStrategy,
  Component,
  type OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthDrawerService } from '@app/services/auth-drawer.service';
import { ClerkService } from '@app/services/clerk.service';
import { EMAIL_REGEX } from '@app/utils/email.util';

@Component({
  selector: 'lcc-forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrl: './auth-form.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, ButtonComponent, InputComponent],
})
export class ForgotPasswordFormComponent implements OnDestroy {
  private readonly clerk = inject(ClerkService);
  protected readonly authDrawer = inject(AuthDrawerService);

  email = signal('');
  code = signal('');
  newPassword = signal('');
  confirmPassword = signal('');

  emailError = signal('');
  codeError = signal('');
  newPasswordError = signal('');
  confirmPasswordError = signal('');
  error = signal('');
  loading = signal(false);
  codeSent = signal(false);

  ngOnDestroy(): void {
    this.newPassword.set('');
    this.confirmPassword.set('');
  }

  onEmailChange(value: string): void {
    this.email.set(value);
    if (this.emailError() && EMAIL_REGEX.test(value)) {
      this.emailError.set('');
    }
  }

  onCodeChange(value: string): void {
    this.code.set(value);
    if (this.codeError() && value) {
      this.codeError.set('');
    }
  }

  onNewPasswordChange(value: string): void {
    this.newPassword.set(value);
    if (this.newPasswordError() && value.length >= 8) {
      this.newPasswordError.set('');
    }
    if (this.confirmPasswordError() && this.confirmPassword() === value) {
      this.confirmPasswordError.set('');
    }
  }

  onConfirmPasswordChange(value: string): void {
    this.confirmPassword.set(value);
    if (this.confirmPasswordError() && value === this.newPassword()) {
      this.confirmPasswordError.set('');
    }
  }

  onEmailBlur(): void {
    if (!this.email()) {
      return;
    }
    this.emailError.set(
      EMAIL_REGEX.test(this.email()) ? '' : 'Please enter a valid email address',
    );
  }

  onNewPasswordBlur(): void {
    if (!this.newPassword()) {
      return;
    }
    this.newPasswordError.set(
      this.newPassword().length >= 8 ? '' : 'Must be at least 8 characters',
    );
  }

  onConfirmPasswordBlur(): void {
    if (!this.confirmPassword()) {
      return;
    }
    this.confirmPasswordError.set(
      !this.newPassword() || this.confirmPassword() === this.newPassword()
        ? ''
        : 'Passwords do not match',
    );
  }

  async onSendCode(): Promise<void> {
    if (!this.email()) {
      this.emailError.set('Email is required');
      return;
    }
    if (!EMAIL_REGEX.test(this.email())) {
      this.emailError.set('Please enter a valid email address');
      return;
    }
    this.emailError.set('');

    this.error.set('');
    this.loading.set(true);

    try {
      await this.clerk.sendPasswordResetCode(this.email());
      this.codeSent.set(true);
    } catch (e: unknown) {
      this.error.set(this.clerk.extractError(e));
    } finally {
      this.loading.set(false);
    }
  }

  private validateReset(): boolean {
    if (!this.code()) {
      this.codeError.set('Reset code is required');
    } else {
      this.codeError.set('');
    }

    if (!this.newPassword()) {
      this.newPasswordError.set('Password is required');
    } else if (this.newPassword().length < 8) {
      this.newPasswordError.set('Must be at least 8 characters');
    } else {
      this.newPasswordError.set('');
    }

    if (!this.confirmPassword()) {
      this.confirmPasswordError.set('Please confirm your password');
    } else if (this.newPassword() && this.confirmPassword() !== this.newPassword()) {
      this.confirmPasswordError.set('Passwords do not match');
    } else {
      this.confirmPasswordError.set('');
    }

    return !this.codeError() && !this.newPasswordError() && !this.confirmPasswordError();
  }

  async onResetPassword(): Promise<void> {
    if (!this.validateReset()) {
      return;
    }

    this.error.set('');
    this.loading.set(true);

    try {
      await this.clerk.resetPassword(this.code(), this.newPassword());
      this.authDrawer.setMode('login');
    } catch (e: unknown) {
      this.error.set(this.clerk.extractError(e));
    } finally {
      this.loading.set(false);
    }
  }
}
