import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatestWith, debounceTime, filter, first } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ModificationInfoComponent } from '@app/components/modification-info/modification-info.component';
import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import { IconsModule } from '@app/icons';
import type { Member } from '@app/types';
import { isDefined } from '@app/utils';
import {
  emailValidator,
  phoneNumberValidator,
  ratingValidator,
  yearOfBirthValidator,
} from '@app/validators';

import { DatePickerComponent } from '../date-picker/date-picker.component';
import { MemberFormFacade } from './member-form.facade';

@UntilDestroy()
@Component({
  selector: 'lcc-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.scss'],
  providers: [MemberFormFacade],
  imports: [
    CommonModule,
    DatePickerComponent,
    IconsModule,
    ModificationInfoComponent,
    ReactiveFormsModule,
    TooltipDirective,
  ],
})
export class MemberFormComponent implements OnInit {
  form!: FormGroup;

  constructor(
    public facade: MemberFormFacade,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.facade.setMember$
      .pipe(filter(isDefined), combineLatestWith(this.facade.formMember$), first())
      .subscribe(([setMember, formMember]) => {
        if (!formMember) {
          formMember = setMember;
        }

        this.initForm(formMember);
        this.initValueChangesListener();
      });
  }

  hasError(control: AbstractControl): boolean {
    return control.dirty && control.invalid;
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.hasError('required')) {
      return 'This field is required';
    } else if (control.hasError('invalidRating')) {
      return 'Invalid rating';
    } else if (control.hasError('invalidEmailFormat')) {
      return 'Invalid email';
    } else if (control.hasError('invalidPhoneNumberFormat')) {
      return 'Invalid phone number format - please input as XXX-XXX-XXXX';
    } else if (control.hasError('invalidYear')) {
      return 'Invalid year';
    } else if (control.hasError('pattern')) {
      return 'Invalid input (incorrect format)';
    } else if (control.hasError('minlength')) {
      return 'Invalid input (number too low)';
    } else if (control.hasError('maxlength')) {
      return 'Invalid input (number too high)';
    } else {
      return 'Unknown error';
    }
  }

  onCancel(): void {
    this.facade.onCancel();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.facade.onSubmit(this.form.value);
  }

  private initForm(member: Member): void {
    this.form = this.formBuilder.group({
      firstName: [member.firstName, [Validators.required, Validators.pattern(/[^\s]/)]],
      lastName: [member.lastName, [Validators.required, Validators.pattern(/[^\s]/)]],
      city: [member.city, [Validators.required, Validators.pattern(/[^\s]/)]],
      rating: [
        member.rating,
        [Validators.required, ratingValidator, Validators.max(3000)],
      ],
      dateJoined: [member.dateJoined, [Validators.required]],
      email: [member.email, emailValidator],
      phoneNumber: [member.phoneNumber, phoneNumberValidator],
      yearOfBirth: [member.yearOfBirth, yearOfBirthValidator],
      chesscomUsername: [member.chesscomUsername, Validators.pattern(/[^\s]/)],
      lichessUsername: [member.lichessUsername, Validators.pattern(/[^\s]/)],
      isActive: [member.isActive],
      id: [member.id],
      modificationInfo: [member.modificationInfo],
      peakRating: [member.peakRating],
    });
  }

  private initValueChangesListener(): void {
    this.form.valueChanges
      .pipe(debounceTime(500), untilDestroyed(this))
      .subscribe((formData: Member) => this.facade.onValueChange(formData));
  }
}
