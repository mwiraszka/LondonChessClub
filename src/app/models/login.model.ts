import { FormControl } from '@angular/forms';

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
