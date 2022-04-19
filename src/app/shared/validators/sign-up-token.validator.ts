import { FormControl } from '@angular/forms';
import { environment } from '@environments/environment';

export const signUpTokenValidator = (
  control: FormControl
): { invalidSignUpToken: true } => {
  return control.value === environment.signUpToken ? null : { invalidSignUpToken: true };
};
