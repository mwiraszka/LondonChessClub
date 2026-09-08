import {
  ButtonComponent,
  InputComponent,
  NumberInputComponent,
  ShieldIconComponent,
  ToastService,
} from '@eagami/ui';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApiError, ApiService, AuthDrawerService } from '@app/services';
import { EMAIL_REGEX } from '@app/utils/email.util';

const MIN_YEAR_OF_BIRTH = 1900;

@Component({
  selector: 'lcc-create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['./auth-form.component.scss', './create-account-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    ButtonComponent,
    InputComponent,
    NumberInputComponent,
    ShieldIconComponent,
  ],
})
export class CreateAccountFormComponent {
  private readonly api = inject(ApiService);
  protected readonly authDrawer = inject(AuthDrawerService);
  private readonly toast = inject(ToastService);

  protected readonly minYearOfBirth = MIN_YEAR_OF_BIRTH;
  protected readonly currentYear = new Date().getFullYear();

  firstName = signal('');
  lastName = signal('');
  email = signal('');
  yearOfBirth = signal<number | null>(null);

  emailError = signal('');
  error = signal('');
  loading = signal(false);

  protected readonly canSubmit = computed(() => {
    const year = this.yearOfBirth();
    return (
      !!this.firstName().trim() &&
      !!this.lastName().trim() &&
      EMAIL_REGEX.test(this.email()) &&
      year !== null &&
      year >= MIN_YEAR_OF_BIRTH &&
      year <= this.currentYear
    );
  });

  onEmailChange(value: string): void {
    this.email.set(value);
    if (this.emailError() && EMAIL_REGEX.test(value)) {
      this.emailError.set('');
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

  async onSubmit(): Promise<void> {
    const year = this.yearOfBirth();
    if (!this.canSubmit() || year === null) {
      return;
    }

    this.error.set('');
    this.loading.set(true);

    try {
      await this.api.post('/users/account-requests', {
        firstName: this.firstName().trim(),
        lastName: this.lastName().trim(),
        email: this.email().trim(),
        yearOfBirth: year,
      });

      this.authDrawer.close();
      this.toast.show(
        `Thanks ${this.firstName().trim()} – your information has been sent for review. We will email you at ${this.email().trim()} once your account is confirmed.`,
        { title: 'Request sent', variant: 'info' },
      );
    } catch (e: unknown) {
      this.error.set(
        e instanceof ApiError
          ? e.message.replace(/\.$/, '')
          : 'Something went wrong, please try again',
      );
    } finally {
      this.loading.set(false);
    }
  }
}
