import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subscription } from 'rxjs';
import { debounceTime, first, tap } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import type { Member, ModificationInfo } from '@app/types';
import {
  dateValidator,
  emailValidator,
  phoneNumberValidator,
  ratingValidator,
  yearValidator,
} from '@app/validators';

import { MemberFormFacade } from './member-form.facade';

@UntilDestroy()
@Component({
  selector: 'lcc-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.scss'],
  providers: [MemberFormFacade],
})
export class MemberFormComponent implements OnInit {
  form!: FormGroup;
  memberFullName!: string;
  modificationInfo!: ModificationInfo | null;
  valueChangesSubscription!: Subscription;

  constructor(public facade: MemberFormFacade, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.facade.memberCurrently$
      .pipe(
        tap(member => {
          this.initForm(member);
          this.modificationInfo = member.modificationInfo;
        }),
        first(),
      )
      .subscribe();
  }

  hasError(control: AbstractControl): boolean {
    return control.dirty && control.invalid;
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.hasError('required')) {
      return 'This field is required';
    } else if (control.hasError('invalidRating')) {
      return 'Invalid rating';
    } else if (control.hasError('invalidDateFormat')) {
      return 'Invalid date format - please input as YYYY-MM-DD';
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
      dateJoined: [member.dateJoined, [Validators.required, dateValidator]],
      email: [member.email, emailValidator],
      phoneNumber: [member.phoneNumber, phoneNumberValidator],
      yearOfBirth: [member.yearOfBirth, yearValidator],
      chesscomUsername: [member.chesscomUsername, Validators.pattern(/[^\s]/)],
      lichessUsername: [member.lichessUsername, Validators.pattern(/[^\s]/)],
      isActive: [member.isActive],
      id: [member.id],
      modificationInfo: [member.modificationInfo],
      peakRating: [member.peakRating],
    });

    this.valueChangesSubscription = this.form.valueChanges
      .pipe(debounceTime(200), untilDestroyed(this))
      .subscribe((member: Member) => this.facade.onValueChange(member));
  }
}
