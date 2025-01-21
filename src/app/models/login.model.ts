import { FormControl } from '@angular/forms';

import { AdminUser, UnverifiedUser } from './user.model';

export interface LoginRequest {
  email: string;
  password: string;
  temporaryPassword?: string;
}

export interface LoginResponse {
  adminUser?: AdminUser;
  unverifiedUser?: UnverifiedUser;
  temporaryPassword?: string;
  error?: Error;
}

export interface LoginFormGroup {
  email: FormControl<string>;
  password: FormControl<string>;
}

export interface ChangePasswordFormGroup {
  email: FormControl<string>;
  code: FormControl<string>;
  newPassword: FormControl<string>;
  confirmPassword: FormControl<string>;
}
