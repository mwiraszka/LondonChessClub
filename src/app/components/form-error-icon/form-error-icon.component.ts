import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { TooltipDirective } from '@app/directives/tooltip.directive';

@Component({
  selector: 'lcc-form-error-icon',
  template: `
    @if (hasError) {
      <mat-icon
        error_outline
        class="alert-icon"
        [tooltip]="errorMessage">
      </mat-icon>
    }
  `,
  styleUrl: './form-error-icon.component.scss',
  standalone: true,
  imports: [MatIconModule, TooltipDirective],
})
export class FormErrorIconComponent {
  @Input({ required: true }) control!: AbstractControl;

  public get hasError(): boolean {
    return this.control.touched && this.control.invalid;
  }

  public get errorMessage(): string {
    if (this.control.hasError('required')) {
      return 'This field is required';
    } else if (this.control.hasError('pattern')) {
      return 'Invalid input (incorrect format)';
    } else if (this.control.hasError('invalidEmailFormat')) {
      return 'Invalid email';
    } else if (this.control.hasError('invalidPhoneNumberFormat')) {
      return 'Invalid phone number format - please input as XXX-XXX-XXXX';
    } else if (this.control.hasError('invalidRating')) {
      return 'Invalid rating';
    } else if (this.control.hasError('invalidYearOfBirth')) {
      return 'Invalid year';
    } else if (this.control.hasError('invalidImageCaption')) {
      return 'Image caption can only contain letters, numbers, and readable symbols';
    } else if (this.control.hasError('albumAlreadyExists')) {
      return 'Album name already exists';
    } else if (this.control.hasError('albumRequired')) {
      return 'Image must be added to at least one album';
    } else if (this.control.hasError('minlength')) {
      return 'Input is too short';
    } else if (this.control.hasError('maxlength')) {
      return 'Input is too long';
    } else if (this.control.hasError('noLowercaseLetter')) {
      return 'Password needs to include at least one lowercase letter';
    } else if (this.control.hasError('noUppercaseLetter')) {
      return 'Password needs to include at least one uppercase letter';
    } else if (this.control.hasError('noSpecialChar')) {
      return 'Password needs to include at least one special character';
    } else if (this.control.hasError('noNumber')) {
      return 'Password needs to include at least one number';
    } else if (this.control.hasError('passwordMismatch')) {
      return 'Passwords must match';
    } else {
      return 'Unknown error';
    }
  }
}
