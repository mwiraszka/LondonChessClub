import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { TooltipDirective } from '@app/directives/tooltip.directive';

@Component({
  selector: 'lcc-form-error-icon',
  template: `
    <mat-icon
      [style.visibility]="hasError ? 'visible' : 'hidden'"
      [tooltip]="errorMessage">
      warning_amber
    </mat-icon>
  `,
  styleUrl: './form-error-icon.component.scss',
  imports: [MatIconModule, TooltipDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class FormErrorIconComponent {
  @Input({ required: true }) control!: AbstractControl;

  public get hasError(): boolean {
    return this.control.touched && this.control.invalid;
  }

  public get errorMessage(): string {
    if (this.control.hasError('required')) {
      return 'This field is required';
    } else if (this.control.hasError('pattern') || this.control.hasError('invalidText')) {
      return 'Text contains invalid characters';
    } else if (this.control.hasError('invalidOrdinal')) {
      return 'Invalid ordinal number - please input a number between 1 and 99';
    } else if (this.control.hasError('invalidEmailFormat')) {
      return 'Invalid email';
    } else if (this.control.hasError('invalidPhoneNumberFormat')) {
      return 'Invalid phone number format - please input as XXX-XXX-XXXX';
    } else if (this.control.hasError('invalidRating')) {
      return 'Invalid rating';
    } else if (this.control.hasError('invalidYearOfBirth')) {
      return 'Invalid year';
    } else if (this.control.hasError('invalidId')) {
      return 'Invalid ID';
    } else if (this.control.hasError('minlength')) {
      return 'Input is too short';
    } else if (this.control.hasError('maxlength')) {
      return 'Input is too long';
    } else {
      return 'Unknown error';
    }
  }
}
